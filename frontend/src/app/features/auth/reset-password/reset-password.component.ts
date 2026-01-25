import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
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
        <h1 class="form-title">Reset Password</h1>
        <p class="form-subtitle">Enter your new password below.</p>

        @if (success()) {
          <div class="success-message">
            <mat-icon>check_circle</mat-icon>
            <p>Your password has been reset successfully!</p>
          </div>
          <a mat-raised-button color="primary" routerLink="/auth/login" class="submit-btn">
            Sign In
          </a>
        } @else {
          @if (error()) {
            <div class="error-message">{{ error() }}</div>
          }

          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field class="form-field" appearance="outline">
              <mat-label>New Password</mat-label>
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
              @if (form.get('password')?.hasError('minlength') && form.get('password')?.touched) {
                <mat-error>Password must be at least 8 characters</mat-error>
              }
            </mat-form-field>

            <mat-form-field class="form-field" appearance="outline">
              <mat-label>Confirm Password</mat-label>
              <input
                matInput
                [type]="hideConfirmPassword() ? 'password' : 'text'"
                formControlName="confirmPassword"
              />
              <button
                mat-icon-button
                matSuffix
                type="button"
                (click)="hideConfirmPassword.set(!hideConfirmPassword())"
              >
                <mat-icon>{{ hideConfirmPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (form.hasError('passwordMismatch') && form.get('confirmPassword')?.touched) {
                <mat-error>Passwords do not match</mat-error>
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
                Reset Password
              }
            </button>
          </form>
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
      margin-bottom: 16px;
    }

    .submit-btn {
      width: 100%;
      height: 48px;
      font-size: 1rem;
      border-radius: 24px;
      margin-top: 8px;
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
  `],
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  loading = signal(false);
  error = signal('');
  success = signal(false);
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);
  private token = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'] || '';
    if (!this.token) {
      this.router.navigate(['/auth/forgot-password']);
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.authService.resetPassword(this.token, this.form.value.password).subscribe({
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
