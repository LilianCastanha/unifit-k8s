import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { createENV } from '@shared/utils/helpers';
import { catchError, Observable, throwError } from 'rxjs';
import { RegisterRequest, RegisterResponse } from '../domain/interfaces';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private readonly API_URL: string = createENV('/auth/register');
  private readonly http = inject(HttpClient);

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(this.API_URL, data).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(error.message));
      })
    );
  }
}
