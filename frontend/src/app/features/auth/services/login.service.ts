import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { createENV } from '@shared/utils/helpers';
import { LoginRequest, LoginResponse } from '../domain/interfaces';
import { AuthTokenService } from './auth-token.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly API_URL: string = createENV('/auth/login');
  private readonly http = inject(HttpClient);
  private readonly authTokenService = inject(AuthTokenService);

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.API_URL, data).pipe(
      map((response: LoginResponse) => {
        this.authTokenService.setToken(response.access_token);
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(error.message));
      })
    );
  }

  logout() {
    console.log("LOGOUT REALIZADO")
    this.authTokenService.removeToken();
  }
}
