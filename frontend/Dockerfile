# Estágio de build
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Estágio final - servidor web Nginx
FROM nginx:alpine

COPY --from=build /app/dist/unifit/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Permite que o Nginx inicie em testes locais isolados caso o host unifit-backend ainda não exista no DNS
RUN printf '#!/bin/sh\nif ! getent hosts unifit-backend >/dev/null 2>&1; then\n  echo "127.0.0.1 unifit-backend" >> /etc/hosts\nfi\n' > /docker-entrypoint.d/40-fallback.sh \
    && chmod +x /docker-entrypoint.d/40-fallback.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
