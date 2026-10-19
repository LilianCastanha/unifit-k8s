import { Injectable } from '@angular/core';
import { GlobalStateService } from './global-state.service';
import { LocalStorageService } from './local-storage.service';
import { UserRole } from '@auth/domain/enums';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private globalStateService: GlobalStateService,
    private localStorageService: LocalStorageService
  ) {}

  isAuthenticated(): boolean {
    const token = this.localStorageService.getItem('authToken');
    return !!token;
  }

  isAdmin(): boolean {
    const role = this.globalStateService.getCurrentUserRole();
    return role === UserRole.Admin;
  }
}
