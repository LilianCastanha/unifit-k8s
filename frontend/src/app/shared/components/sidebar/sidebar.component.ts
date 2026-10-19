import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { UserRole } from '@auth/domain/enums';
import { UserModel } from '@auth/domain/interfaces';
import { LoginService } from '@auth/services/login.service';
import { GlobalStateService } from '@core/services/global-state.service';
import { cn } from '@shared/utils/helpers';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  @Input() isMobile = false;
  @Input() handleClose = () => {};

  user: UserModel | null = null;
  sidebarWrapperClasses = '';
  isUserAdmin = false;

  private subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private globalStateService: GlobalStateService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.sidebarWrapperClasses = cn(
      'flex-col items-center justify-between h-full gap-8 px-6 py-4 overflow-y-auto bg-white',
      this.isMobile ? 'w-full flex' : 'w-64 hidden sm:flex'
    );

    const userSubscription = this.globalStateService.currentUser$.subscribe(
      currentUser => {
        if (!currentUser) return;

        this.user = currentUser;
        this.isUserAdmin = currentUser.roles.includes(UserRole.Admin);
      }
    );

    this.subscription.add(userSubscription);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  handleLogout() {
    this.loginService.logout();
    this.router.navigate(['/auth/login']);
  }

  handleLinkClick() {
    if (!this.isMobile) return;

    this.handleClose();
  }
}
