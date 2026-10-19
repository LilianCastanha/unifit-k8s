import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RegisterService } from '../../services/register.service';
import { catchError, finalize, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    RouterModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
  ],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm: FormGroup;
  isSubmitting = false;

  constructor(
    private router: Router,
    private registerService: RegisterService,
    private formBuilder: FormBuilder,
    private toastService: ToastrService
  ) {
    this.registerForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      //Campo 'username' adicionado: o backend e o Keycloak exigem
      //esse campo para criar o usuario
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  async handleSubmit() {
    if (this.isSubmitting || this.registerForm.invalid) return;

    this.isSubmitting = true;
    this.registerForm.disable();

    this.registerService
      .register(this.registerForm.value)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
          this.registerForm.enable();
        }),
        catchError(() => {
          this.toastService.error('Ocorreu um erro ao criar a conta');
          return of(null);
        })
      )
      .subscribe(response => {
        if (!response) return;

        this.toastService.success(
          'Conta criada com sucesso! Faça login para continuar'
        );
        this.router.navigate(['/auth/login']);
      });
  }
}
