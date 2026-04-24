import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../../core/services/alert.service';
import { LoaderService } from '../../core/services/loader.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NzButtonModule,
    NzCardModule,
    NzInputModule,
    NzIconModule,
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.less',
})
export class LoginPage {
  protected loginForm: FormGroup<{
    username: FormControl<string>;
    password: FormControl<string>;
  }>;

  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private alertService = inject(AlertService);

  readonly loaderService = inject(LoaderService);

  constructor() {
    this.loginForm = this.fb.nonNullable.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(12)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onLogin(): void {
    const usernameErrors = this.loginForm.get('username')?.errors;
    const passwordErrors = this.loginForm.get('password')?.errors;

    if (this.loginForm.invalid) {
      handleLoginValidationAlert(usernameErrors, passwordErrors, this.alertService);
      return;
    }

    const loginData = this.loginForm.getRawValue();

    this.authService.login(loginData).subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(['/']);
          this.alertService.show('', res.message, 'success', 4000);
        } else {
          this.alertService.show('LỖI ĐĂNG NHẬP', res.message, 'error', 4000);
        }
      },
    });
  }
}

export const handleLoginValidationAlert = (
  userErrors: ValidationErrors | null | undefined,
  passErrors: ValidationErrors | null | undefined,
  alertService: AlertService,
): void => {
  let message = '';

  if (userErrors) {
    if (userErrors['required']) message = 'Tên đăng nhập không được để trống.';
    else if (userErrors['minlength'])
      message = `Tên đăng nhập phải có ít nhất ${userErrors['minlength'].requiredLength} ký tự.`;
    else if (userErrors['maxlength'])
      message = `Tên đăng nhập không vượt quá ${userErrors['maxlength'].requiredLength} ký tự.`;
  } else if (passErrors) {
    if (passErrors['required']) message = 'Mật khẩu không được để trống.';
    else if (passErrors['minlength'])
      message = `Mật khẩu phải từ ${passErrors['minlength'].requiredLength} ký tự trở lên.`;
  }

  if (message) {
    alertService.show('', message, 'warning', 4000);
  }
};
