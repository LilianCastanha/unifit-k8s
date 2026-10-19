# Unifit no Kubernetes (Minikube)

Migração da aplicação Unifit (Mensal 1) para Kubernetes, executada localmente com Minikube.

## Arquitetura

| Componente | Imagem | Réplicas | Exposição | Comunicação |
|---|---|---|---|---|
| Frontend (Angular + Nginx) | `unifit-frontend:1.0` | 2 | NodePort 30080 | Navegador acessa o frontend; o Nginx encaminha `/api/` para o backend |
| Backend (Spring Boot 3.3.4, Java 17) | `unifit-backend:1.0` | 2 | ClusterIP 8080 | Conecta ao MySQL e ao Keycloak pelo nome do Service |
| MySQL 8.0 | `mysql:8.0` | 1 | ClusterIP 3306 | Armazena dados do app e do Keycloak, com volume persistente (PVC) |
| Keycloak 26.2.3 | `quay.io/keycloak/keycloak:26.2.3` | 1 | ClusterIP 8080 | Emite tokens; acessado pelo backend, não pelo navegador |

Fluxo de login:

Navegador → Nginx (frontend) → /api/auth/login → Backend → Keycloak (password grant) → token

## Pré-requisitos

- Docker Desktop
- Minikube
- kubectl
- Java 17 e Maven (apenas para gerar o `.war` localmente, se necessário)
- Node.js 20 (apenas para build local do frontend, se necessário)

## Estrutura

unifit-k8s/
├── backend/        código Spring Boot + Dockerfile
├── frontend/       código Angular + Dockerfile + nginx.conf
├── k8s/
│   ├── 00-config.yaml     ConfigMap e Secret
│   ├── 01-mysql.yaml      PVC, Deployment e Service do MySQL
│   ├── 02-keycloak.yaml   Deployment e Service do Keycloak
│   ├── 03-backend.yaml    Deployment (2 réplicas) e Service do backend
│   └── 04-frontend.yaml   Deployment (2 réplicas) e Service NodePort
├── evidencias/     capturas de tela
└── README.md
```

## 1. Iniciar o cluster

```bash
minikube start --driver=docker
kubectl get nodes
```

## 2. Gerar as imagens e carregá-las no Minikube

As imagens precisam estar dentro do cluster. Construí-las no Docker do Mac não basta.

```bash
docker build -t unifit-backend:1.0 ./backend
docker build -t unifit-frontend:1.0 ./frontend

minikube image load unifit-backend:1.0
minikube image load unifit-frontend:1.0
minikube image ls | grep unifit
```

Os Deployments usam `imagePullPolicy: Never`, então, se a imagem não estiver carregada, o Pod fica em `ImagePullBackOff`.

## 3. Aplicar ConfigMap, Secret, MySQL e Keycloak

O arquivo `00-config.yaml` tem placeholders no Secret. Aplique-o primeiro e, em seguida, substitua o Secret pelas senhas reais, sem gravá-las em arquivo:

```bash
kubectl apply -f k8s/00-config.yaml

kubectl create secret generic unifit-secret \
  --from-literal=DB_USER=root \
  --from-literal=DB_PASSWORD='<SENHA_DB>' \
  --from-literal=KC_ADMIN_PASSWORD='<SENHA_ADMIN>' \
  --from-literal=KC_CLIENT_SECRET='<CLIENT_SECRET>' \
  --dry-run=client -o yaml | kubectl apply -f -

kubectl apply -f k8s/01-mysql.yaml
kubectl apply -f k8s/02-keycloak.yaml
kubectl wait --for=condition=ready pod -l app=keycloak --timeout=240s
```

Na primeira execução, `<CLIENT_SECRET>` ainda não existe. Use qualquer valor temporário e atualize depois, no passo 5.

> Atenção: a senha do MySQL é definida só na criação do banco. Se você mudar `DB_PASSWORD` depois, zere o PVC (`kubectl delete pvc mysql-pvc`) e reaplique o `01-mysql.yaml`.

## 4. Acessar a administração do Keycloak

Em um terminal que fica aberto:

```bash
kubectl port-forward svc/keycloak 8081:8080
```

Abra `http://localhost:8081` e entre com:

- Usuário: `admin`
- Senha: `<SENHA_ADMIN>`

Se a porta 8081 estiver ocupada, use outra (por exemplo `8082:8080`).

## 5. Configurar o Keycloak

Faça estes passos uma única vez, no realm `unifit`:

1. **Criar o realm:** *Manage realms > Create realm* com o nome `unifit`.
2. **Criar o client:** *Clients > Create client*:
   - *Client ID*: `unifit`
   - Ative **Client authentication**
   - Em *Authentication flow*, ative **Direct access grants** (o backend usa o password grant)
3. **Copiar o client secret:** em *Clients > unifit > Credentials*, copie o valor de *Client secret*.
4. **Atualizar o Secret com esse valor:**
```bash
   kubectl create secret generic unifit-secret \
     --from-literal=DB_USER=root \
     --from-literal=DB_PASSWORD='<SENHA_DB>' \
     --from-literal=KC_ADMIN_PASSWORD='<SENHA_ADMIN>' \
     --from-literal=KC_CLIENT_SECRET='<CLIENT_SECRET>' \
     --dry-run=client -o yaml | kubectl apply -f -
```
5. **Criar um usuário de teste:** *Users > Create new user*, com *Username*, *Email*, *First name* e *Last name* preenchidos e **Email verified** ligado.
6. **Definir a senha:** em *Users > <usuario> > Credentials > Set password*, com **Temporary desmarcado**.

Se o usuário tiver ações obrigatórias pendentes (*Required user actions*), remova-as, senão o login retorna `Account is not fully set up`.

## 6. Subir o backend e o frontend

```bash
kubectl apply -f k8s/03-backend.yaml
kubectl apply -f k8s/04-frontend.yaml
kubectl rollout status deployment/unifit-backend
kubectl rollout status deployment/unifit-frontend
kubectl get pods -o wide
```

Se o backend começar em `CrashLoopBackOff` antes do realm existir, ele reinicia sozinho. Se tiver atualizado o Secret depois que os Pods já estavam rodando, reinicie-os:

```bash
kubectl rollout restart deployment/unifit-backend
```

## 7. Acessar a aplicação

```bash
minikube service unifit-frontend --url
```

O comando mostra uma URL, como `http://127.0.0.1:XXXXX`. No macOS com driver Docker, **o terminal precisa ficar aberto** enquanto você usa a aplicação.

Abra essa URL no navegador.

## 8. Testar

### Login pela API

```bash
curl -i -X POST URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"<USUARIO>","password":"<SENHA_USUARIO>"}'
```

Resultado esperado: `HTTP/1.1 200` com `access_token` no corpo.

### Balanceamento entre os Pods do frontend

Cada resposta traz o header `X-Served-By` com o nome do Pod que atendeu:

```bash
for i in $(seq 1 6); do curl -sI URL | grep -i x-served-by; done
```

Os nomes devem alternar entre os dois Pods de `unifit-frontend`.

### Recriação automática de Pod

```bash
kubectl get pods -o wide
kubectl delete pod <NOME_DE_UM_POD>
kubectl get pods -w
```

O Deployment cria um novo Pod para manter o número de réplicas. Use `Ctrl+C` para sair do modo `-w`.

## 9. Comandos de verificação

```bash
kubectl get pods -o wide
kubectl get services
kubectl get deployments
kubectl logs deployment/unifit-backend --tail=50
kubectl describe pod <NOME_DO_POD>
```

## 10. Problemas comuns

| Sintoma | Causa provável | Solução |
|---|---|---|
| `ImagePullBackOff` | Imagem não carregada no Minikube | `minikube image load <imagem>` |
| `CrashLoopBackOff` no backend | Keycloak ou realm ainda não prontos | Aguarde ou reinicie o Deployment |
| `401` no login pela API | Client secret do backend diferente do Keycloak | Atualize o Secret e rode `kubectl rollout restart deployment/unifit-backend` |
| `invalid_grant` / `Invalid user credentials` | Usuário ou senha incorretos | Confira o usuário e redefina a senha |
| `Account is not fully set up` | Senha temporária ou ação obrigatória pendente | Desmarque *Temporary* e remova *Required user actions* |
| `invalid_client` | Client secret incorreto | Copie o valor atual em *Clients > unifit > Credentials* |
| `address already in use` no `port-forward` | Porta local ocupada | Use outra porta local, por exemplo `8082:8080` |
| `502` no navegador | Nginx não alcança o backend | `kubectl get endpoints unifit-backend` |

## 11. Limpeza

```bash
kubectl delete -f k8s/04-frontend.yaml
kubectl delete -f k8s/03-backend.yaml
kubectl delete -f k8s/02-keycloak.yaml
kubectl delete -f k8s/01-mysql.yaml
kubectl delete pvc mysql-pvc
kubectl delete -f k8s/00-config.yaml
minikube stop
```

## Segurança

Nenhuma senha real está versionada neste repositório. Os valores de `k8s/00-config.yaml` são placeholders, e as senhas reais devem ser aplicadas no cluster pelo comando `kubectl create secret ... | kubectl apply -f -`.

## Evidências

Estão em `evidencias/`:
- Saída de `kubectl get pods -o wide`
- Saída de `kubectl get services`
- Saída de `kubectl get deployments`
- Aplicação aberta no navegador
- Login bem-sucedido
- Balanceamento entre os Pods do frontend
- Exclusão de um Pod e sua recriação
