import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { LoginService } from '../../services/login.service';
import { catchError, finalize, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { GlobalStateService } from '@core/services/global-state.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    RouterModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitting = false;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private toastService: ToastrService,
    private globalStateService: GlobalStateService
  ) {
    this.loginForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      email: [''],
      password: [''],
    });
  }

  async handleSubmit() {
    if (this.isSubmitting || this.loginForm.invalid) return;

    this.isSubmitting = true;
    this.loginForm.disable();

    this.loginService
      .login(this.loginForm.value)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
          this.loginForm.enable();
        }),
        catchError(() => {
          this.toastService.error('Credenciais inválidas');
          return of(null);
        })
      )
      .subscribe(response => {
        if (!response) return;

        this.globalStateService.loadCurrentUser();
        this.router.navigate(['/app/workouts']);
      });
  }
}
