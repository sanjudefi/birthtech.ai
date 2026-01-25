import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-subscription-success',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="success-page">
      <mat-card class="success-card">
        @if (loading()) {
          <div class="loading-state">
            <mat-spinner diameter="48"></mat-spinner>
            <p>Setting up your account...</p>
          </div>
        } @else {
          <div class="success-icon">
            <mat-icon>check_circle</mat-icon>
          </div>
          <h1>Welcome to BirthTech.ai!</h1>
          <p class="message">
            Your subscription is now active. Let's set up your pregnancy profile
            to personalize your care experience.
          </p>
          <button mat-raised-button color="primary" (click)="continue()">
            Set Up Your Profile
          </button>
        }
      </mat-card>
    </div>
  `,
  styles: [`
    .success-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #FDF2F8 0%, #EDE9FE 100%);
      padding: 24px;
    }

    .success-card {
      max-width: 450px;
      width: 100%;
      padding: 48px;
      text-align: center;
      border-radius: 16px;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
    }

    .loading-state p {
      color: #6B7280;
      font-size: 1.125rem;
    }

    .success-icon mat-icon {
      font-size: 80px;
      height: 80px;
      width: 80px;
      color: #10B981;
    }

    h1 {
      font-size: 1.75rem;
      color: #1F2937;
      margin: 24px 0 16px;
    }

    .message {
      color: #6B7280;
      line-height: 1.6;
      margin-bottom: 32px;
    }

    button {
      height: 48px;
      padding: 0 32px;
      font-size: 1rem;
      border-radius: 24px;
    }
  `],
})
export class SuccessComponent implements OnInit {
  loading = signal(true);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Give Stripe webhook time to process, then refresh user data
    setTimeout(() => {
      this.authService.getMe().subscribe({
        next: () => {
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
    }, 2000);
  }

  continue(): void {
    this.router.navigate(['/onboarding']);
  }
}
