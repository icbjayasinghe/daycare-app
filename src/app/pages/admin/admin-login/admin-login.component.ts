import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
})
export class AdminLoginComponent {
  readonly loginForm: FormGroup;
  loading = false;
  loginError = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthServiceService,
    private readonly router: Router,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.loading) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.loginError = '';
    const { email, password } = this.loginForm.getRawValue();

    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.loading = false;
        if (!this.authService.establishAdminSession(response, email)) {
          this.loginError = 'This account does not have administrator access.';
          return;
        }

        this.router.navigate(['/pages/admin/dashboard']);
      },
      error: () => {
        this.loading = false;
        this.loginError = 'Invalid email or password.';
      },
    });
  }
}
