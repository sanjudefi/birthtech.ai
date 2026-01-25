import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
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
        <h1 class="form-title">Forgot Password?</h1>
        <p class="form-subtitle">
          Enter your email and we'll send you a link to reset your password.
        </p>

        @if (success()) {
          <div class="success-message">
            <mat-icon>check_circle</mat-icon>
            <p>If an account exists with this email, you'll receive a password reset link shortly.</p>
          </div>
          <a mat-raised-button color="primary" routerLink="/auth/login" class="back-btn">
            Back to Login
          </a>
        } @else {
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
                Send Reset Link
              }
            </button>
          </form>

          <p class="switch-auth">
            Remember your password?
            <a routerLink="/auth/login">Sign in</a>
          </p>
        }
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
      margin-bottom: 24px;
    }

    .submit-btn, .back-btn {
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

    .success-message {
      background: #D1FAE5;
      color: #065F46;
      padding: 24px;
      border-radius: 8px;
      margin-bottom: 24px;
      text-align: center;
    }

    .success-message mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: 16px;
    }

    .success-message p {
      line-height: 1.5;
    }
  `],
})
export class ForgotPasswordComponent {
  form: FormGroup;
  loading = signal(false);
  error = signal('');
  success = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.authService.forgotPassword(this.form.value.email).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Something went wrong. Please try again.');
      },
    });
  }
}
