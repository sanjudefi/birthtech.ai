import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="auth-page">
      <div class="form-container">
        <div class="logo">BirthTech.ai</div>
        <h1 class="form-title">Welcome Back</h1>
        <p class="form-subtitle">Sign in to continue your pregnancy journey</p>

        @if (error()) {
          <div class="error-message">{{ error() }}</div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field class="form-field" appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" />
            @if (form.get('email')?.hasError('required') && form.get('email')?.touched) {
              <mat-error>Email is required</mat-error>
            }
            @if (form.get('email')?.hasError('email') && form.get('email')?.touched) {
              <mat-error>Please enter a valid email</mat-error>
            }
          </mat-form-field>

          <mat-form-field class="form-field" appearance="outline">
            <mat-label>Password</mat-label>
            <input
              matInput
              [type]="hidePassword() ? 'password' : 'text'"
              formControlName="password"
            />
            <button
              mat-icon-button
              matSuffix
              type="button"
              (click)="hidePassword.set(!hidePassword())"
            >
              <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            @if (form.get('password')?.hasError('required') && form.get('password')?.touched) {
              <mat-error>Password is required</mat-error>
            }
          </mat-form-field>

          <div class="forgot-link">
            <a routerLink="/auth/forgot-password">Forgot password?</a>
          </div>

          <button
            mat-raised-button
            color="primary"
            type="submit"
            class="submit-btn"
            [disabled]="loading()"
          >
            @if (loading()) {
              <mat-spinner diameter="20"></mat-spinner>
            } @else {
              Sign In
            }
          </button>
        </form>

        <p class="switch-auth">
          Don't have an account?
          <a routerLink="/auth/signup">Sign up</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #FDF2F8 0%, #EDE9FE 100%);
      padding: 24px;
    }

    .form-container {
      width: 100%;
      max-width: 400px;
      background: white;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .logo {
      text-align: center;
      font-size: 1.5rem;
      font-weight: 700;
      color: #8B5CF6;
      margin-bottom: 24px;
    }

    .form-title {
      font-size: 1.75rem;
      font-weight: 500;
      text-align: center;
      margin-bottom: 8px;
      color: #1F2937;
    }

    .form-subtitle {
      text-align: center;
      color: #6B7280;
      margin-bottom: 32px;
    }

    .form-field {
      width: 100%;
      margin-bottom: 16px;
    }

    .forgot-link {
      text-align: right;
      margin-bottom: 24px;
    }

    .forgot-link a {
      color: #8B5CF6;
      text-decoration: none;
      font-size: 0.875rem;
    }

    .submit-btn {
      width: 100%;
      height: 48px;
      font-size: 1rem;
      border-radius: 24px;
    }

    .switch-auth {
      text-align: center;
      margin-top: 24px;
      color: #6B7280;
    }

    .switch-auth a {
      color: #8B5CF6;
      text-decoration: none;
      font-weight: 500;
    }

    .error-message {
      background: #FEE2E2;
      color: #DC2626;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-size: 0.875rem;
    }

    mat-spinner {
      display: inline-block;
    }

    ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      height: 20px;
    }
  `],
})
export class LoginComponent {
  form: FormGroup;
  loading = signal(false);
  error = signal('');
  hidePassword = signal(true);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const { email, password } = this.form.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.user.hasActiveSubscription) {
          if (response.user.hasProfile) {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/onboarding']);
          }
        } else {
          this.router.navigate(['/subscribe']);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Login failed. Please try again.');
      },
    });
  }
}
