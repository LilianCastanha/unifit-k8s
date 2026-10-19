import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { LoginService } from '@auth/services/login.service';
import { GlobalStateService } from '@core/services/global-state.service';
import { UserService } from '@profile/services/user.service';
import { catchError, map, of, tap } from 'rxjs';

export const userResolver: ResolveFn<boolean> = () => {
  const userService = inject(UserService);
  const globalStateService = inject(GlobalStateService);
  const loginService = inject(LoginService);

  return userService.getUser().pipe(
    tap(user => {
      if (!user) {
        loginService.logout();
        return;
      }
      globalStateService.setCurrentUser(user); 
    }),
    map(user => !!user),
    catchError(() => {
      loginService.logout();
      return of(false);
    })
  );
};
