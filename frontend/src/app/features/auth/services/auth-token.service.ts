import { Injectable } from '@angular/core';
import { LocalStorageService } from '@core/services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthTokenService {
  constructor(private localStorageService: LocalStorageService) {}

  setToken(token: string): void {
    this.localStorageService.setItem('authToken', token);
  }

  getToken(): string | null {
    return this.localStorageService.getItem<string>('authToken');
  }

  removeToken(): void {
    this.localStorageService.deleteItem('authToken');
  }
}
