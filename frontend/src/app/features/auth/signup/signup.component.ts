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
  selector: 'app-signup',
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
        <h1 class="form-title">Create Account</h1>
        <p class="form-subtitle">Start your pregnancy care journey today</p>

        @if (error()) {
          <div class="error-message">{{ error() }}</div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="name-row">
            <mat-form-field class="form-field half" appearance="outline">
              <mat-label>First Name</mat-label>
              <input matInput formControlName="firstName" />
            </mat-form-field>

            <mat-form-field class="form-field half" appearance="outline">
              <mat-label>Last Name</mat-label>
              <input matInput formControlName="lastName" />
            </mat-form-field>
          </div>

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
            @if (form.get('confirmPassword')?.hasError('required') && form.get('confirmPassword')?.touched) {
              <mat-error>Please confirm your password</mat-error>
            }
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
              Create Account
            }
          </button>
        </form>

        <p class="switch-auth">
          Already have an account?
          <a routerLink="/auth/login">Sign in</a>
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
      max-width: 450px;
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

    .name-row {
      display: flex;
      gap: 16px;
    }

    .form-field {
      width: 100%;
      margin-bottom: 16px;
    }

    .form-field.half {
      flex: 1;
    }

    .submit-btn {
      width: 100%;
      height: 48px;
      font-size: 1rem;
      border-radius: 24px;
      margin-top: 8px;
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

    @media (max-width: 480px) {
      .name-row {
        flex-direction: column;
        gap: 0;
      }
    }
  `],
})
export class SignupComponent {
  form: FormGroup;
  loading = signal(false);
  error = signal('');
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group(
      {
        firstName: [''],
        lastName: [''],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
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

    const { firstName, lastName, email, password } = this.form.value;

    this.authService.signup({ email, password, firstName, lastName }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/subscribe']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Signup failed. Please try again.');
      },
    });
  }
}
