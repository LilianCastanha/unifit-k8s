import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserRole } from '@auth/domain/enums';
import { UserModel } from '@auth/domain/interfaces';
import { JWTService } from '@auth/services/jwt.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalStateService {
  private currentUserSubject = new BehaviorSubject<UserModel | null>(null);
  currentUser$: Observable<UserModel | null> =
    this.currentUserSubject.asObservable();

  constructor(private jwtService: JWTService) {
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    const user = this.jwtService.jwtDecode();
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): UserModel | null {
    return this.currentUserSubject.value;
  }

  setCurrentUser(user: UserModel) {
    this.currentUserSubject.next(user);
  }

  getCurrentUserId(): number | null {
    const currentUser = this.currentUserSubject.value;
    return currentUser ? Number(currentUser.id) : null;
  }

  getCurrentUserRole(): string {
    const currentUser = this.currentUserSubject.value;
    if (currentUser && currentUser.roles.length > 0) {
      if (currentUser.roles.includes(UserRole.Admin)) {
        return UserRole.Admin;
      }
    }
    return UserRole.Colaborador;
  }
}
