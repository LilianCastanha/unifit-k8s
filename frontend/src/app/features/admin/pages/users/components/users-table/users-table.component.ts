import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserModel } from '@auth/domain/interfaces';
import { GlobalStateService } from '@core/services/global-state.service';
import { UserService } from '@profile/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { UserRole } from '@auth/domain/enums';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './users-table.component.html',
})
export class UsersTableComponent implements OnInit {
  public UserRole = UserRole;
  currentUserId: number = 0;
  users: UserModel[] = [];
  isLoading: boolean = true;
  isEmpty: boolean = false;

  constructor(
    private userService: UserService,
    private globalStateService: GlobalStateService,
    private toastService: ToastrService
  ) {}

  ngOnInit() {
    this.currentUserId = this.globalStateService.getCurrentUserId()!;
    this.loadUsers();
  }

  private loadUsers() {
    this.isLoading = true;

    this.userService.getUsers().subscribe({
      next: users => {
        this.users = users;
        this.isEmpty = users.length === 0;
      },
      error: () => {
        this.toastService.error('Ocorreu um erro ao carregar os usuários');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private roleLabels: Record<UserRole.Admin | UserRole.Colaborador, string> = {
    [UserRole.Admin]: 'Administrador',
    [UserRole.Colaborador]: 'Colaborador',
  };

  getRoleDisplay(roles: UserRole[] = []): string[] {
    return roles
      .filter(role => role === UserRole.Admin || role === UserRole.Colaborador)
      .map(role => this.roleLabels[role] || role);
  }

  handleDeleteUser(userId: number) {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.toastService.success('Usuário excluído com sucesso');
        this.loadUsers();
      },
      error: () => {
        this.toastService.error('Ocorreu um erro ao excluir o usuário');
      },
    });
  }
}
