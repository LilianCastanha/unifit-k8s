import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserModel } from '@auth/domain/interfaces';
import { AuthTokenService } from '@auth/services/auth-token.service';
import { ErrorHandlerService } from '@core/services/error-handler.service';
import { createENV } from '@shared/utils/helpers';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly API_URL: string = createENV('/usuarios');
  private readonly http = inject(HttpClient);
  private readonly authTokenService = inject(AuthTokenService);

  constructor(private errorHandler: ErrorHandlerService) {}

  getUser(): Observable<UserModel> {
    const token = this.authTokenService.getToken();
    console.log('Token antes da requisição:', token); 

    if (!token) {
      console.error('Token não encontrado, fazendo logout...');
      this.authTokenService.removeToken();
      return throwError(() => new Error('Token não encontrado'));
    }

    return this.http
      .get<UserModel>(`${this.API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(catchError(this.errorHandler.handle));
  }

  getUsers(): Observable<UserModel[]> {
    return this.http
      .get<UserModel[]>(this.API_URL)
      .pipe(catchError(this.errorHandler.handle));
  }

  addTrainingPlans(
    userId: number,
    trainingPlanIds: number[]
  ): Observable<void> {
    return this.http
      .put<void>(`${this.API_URL}/${userId}/set-plano-treino`, trainingPlanIds)
      .pipe(catchError(this.errorHandler.handle));
  }

  updateUser(userId: number, user: UserModel): Observable<UserModel> {
    return this.http
      .put<UserModel>(`${this.API_URL}/${userId}`, user)
      .pipe(catchError(this.errorHandler.handle));
  }

  deleteUser(userId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.API_URL}/${userId}`)
      .pipe(catchError(this.errorHandler.handle));
  }
}
