import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

export const httpInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);
  const localStorageService = inject(LocalStorageService);

  const token = localStorageService.getItem('authToken');
  const isAuthPath = request.url.includes('/auth');

  if (token && !isAuthPath) {
    request = request.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        router.navigate(['/auth/login']);
      }

      return throwError(
        () => new Error('An error occurred while processing the request')
      );
    })
  );
};
