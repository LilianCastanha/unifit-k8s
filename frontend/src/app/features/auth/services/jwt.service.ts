import { inject, Injectable } from '@angular/core';
import { UserModel } from '@auth/domain/interfaces';
import { AuthTokenService } from '@auth/services/auth-token.service';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { UserRole } from '@auth/domain/enums';

interface KeycloakJwtPayload extends JwtPayload {
  preferred_username: string;
  email: string;
  sub: string;
  realm_access?: {
    roles?: string[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class JWTService {
  private readonly authTokenService = inject(AuthTokenService);

  jwtDecode(): UserModel | null {
    const token = this.authTokenService.getToken();
    if (!token) return null;

    try {
      const decode = jwtDecode<KeycloakJwtPayload>(token);

      const jwtRoles = decode.realm_access?.roles ?? [];
      const roles = jwtRoles.filter((role): role is UserRole =>
        Object.values(UserRole).includes(role as UserRole)
      );

      return {
        id: 0,
        name: decode.preferred_username,
        age: 0,
        weight: null,
        height: 0,
        email: decode.email,
        roles,
        userIdentifier: decode.sub,
        trainingPlansIds: [],
      };
    } catch (error) {
      console.error('Erro em decodificar o token', error);
      return null;
    }
  }
}
