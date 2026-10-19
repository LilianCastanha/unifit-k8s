import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  handle(error: HttpErrorResponse) {
    console.error('HTTP error occurred:', error);

    return throwError(
      () => new Error(error.message || 'An unknown error occurred.')
    );
  }
}
