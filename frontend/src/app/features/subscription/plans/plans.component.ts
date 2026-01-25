import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SubscriptionService, SubscriptionPlan } from '../../../core/services/subscription.service';

@Component({
  selector: 'app-plans',
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
    <div class="plans-page">
      <div class="plans-container">
        <div class="header">
          <a routerLink="/" class="logo">BirthTech.ai</a>
        </div>

        <h1>Choose Your Plan</h1>
        <p class="subtitle">Start your pregnancy care journey today</p>

        @if (cancelled()) {
          <div class="info-message">
            <mat-icon>info</mat-icon>
            Your checkout was cancelled. Feel free to try again when you're ready.
          </div>
        }

        @if (error()) {
          <div class="error-message">{{ error() }}</div>
        }

        <div class="plans-grid">
          @for (plan of plans(); track plan.id) {
            <mat-card class="plan-card" [class.featured]="plan.id === 'premium'">
              @if (plan.id === 'premium') {
                <div class="badge">Most Popular</div>
              }
              <h2>{{ plan.name }}</h2>
              <div class="price">
                <span class="currency">$</span>
                <span class="amount">{{ plan.price }}</span>
                <span class="period">/{{ plan.interval }}</span>
              </div>
              <ul class="features">
                @for (feature of plan.features; track feature) {
                  <li>
                    <mat-icon>check_circle</mat-icon>
                    {{ feature }}
                  </li>
                }
              </ul>
              <button
                mat-raised-button
                [color]="plan.id === 'premium' ? 'primary' : undefined"
                (click)="selectPlan(plan)"
                [disabled]="loadingPlan() === plan.id"
              >
                @if (loadingPlan() === plan.id) {
                  <mat-spinner diameter="20"></mat-spinner>
                } @else {
                  Get {{ plan.name }}
                }
              </button>
            </mat-card>
          }
        </div>

        <p class="secure-note">
          <mat-icon>lock</mat-icon>
          Secure payment powered by Stripe. Cancel anytime.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .plans-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #FDF2F8 0%, #EDE9FE 100%);
      padding: 24px;
    }

    .plans-container {
      max-width: 900px;
      margin: 0 auto;
    }

    .header {
      text-align: center;
      margin-bottom: 32px;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: #8B5CF6;
      text-decoration: none;
    }

    h1 {
      text-align: center;
      font-size: 2.5rem;
      color: #1F2937;
      margin-bottom: 8px;
    }

    .subtitle {
      text-align: center;
      color: #6B7280;
      margin-bottom: 32px;
      font-size: 1.125rem;
    }

    .plans-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .plan-card {
      padding: 40px;
      border-radius: 16px;
      position: relative;
      text-align: center;
    }

    .plan-card.featured {
      border: 2px solid #8B5CF6;
      transform: scale(1.02);
    }

    .badge {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      background: #8B5CF6;
      color: white;
      padding: 4px 16px;
      border-radius: 16px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .plan-card h2 {
      font-size: 1.5rem;
      color: #1F2937;
      margin-bottom: 16px;
    }

    .price {
      margin-bottom: 24px;
    }

    .currency {
      font-size: 1.5rem;
      color: #6B7280;
      vertical-align: top;
    }

    .amount {
      font-size: 3.5rem;
      font-weight: 700;
      color: #1F2937;
    }

    .period {
      font-size: 1rem;
      color: #6B7280;
    }

    .features {
      list-style: none;
      padding: 0;
      margin: 0 0 32px 0;
      text-align: left;
    }

    .features li {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      color: #4B5563;
      border-bottom: 1px solid #F3F4F6;
    }

    .features li:last-child {
      border-bottom: none;
    }

    .features mat-icon {
      color: #10B981;
      font-size: 20px;
      height: 20px;
      width: 20px;
    }

    .plan-card button {
      width: 100%;
      height: 48px;
      font-size: 1rem;
      border-radius: 24px;
    }

    .secure-note {
      text-align: center;
      color: #6B7280;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 0.875rem;
    }

    .secure-note mat-icon {
      font-size: 18px;
      height: 18px;
      width: 18px;
    }

    .error-message {
      background: #FEE2E2;
      color: #DC2626;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 24px;
      text-align: center;
    }

    .info-message {
      background: #DBEAFE;
      color: #1E40AF;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    @media (max-width: 768px) {
      .plans-grid {
        grid-template-columns: 1fr;
      }

      .plan-card.featured {
        transform: none;
      }

      h1 {
        font-size: 2rem;
      }
    }
  `],
})
export class PlansComponent implements OnInit {
  plans = signal<SubscriptionPlan[]>([]);
  loadingPlan = signal<string | null>(null);
  error = signal('');
  cancelled = signal(false);

  constructor(
    private subscriptionService: SubscriptionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check if redirected from cancelled checkout
    if (this.route.snapshot.queryParams['cancelled']) {
      this.cancelled.set(true);
    }

    this.loadPlans();
  }

  loadPlans(): void {
    this.subscriptionService.getPlans().subscribe({
      next: (plans) => {
        this.plans.set(plans);
      },
      error: () => {
        this.error.set('Failed to load plans. Please refresh the page.');
      },
    });
  }

  selectPlan(plan: SubscriptionPlan): void {
    this.loadingPlan.set(plan.id);
    this.error.set('');

    this.subscriptionService.createCheckout(plan.id).subscribe({
      next: (response) => {
        // Redirect to Stripe checkout
        if (response.url) {
          window.location.href = response.url;
        }
      },
      error: (err) => {
        this.loadingPlan.set(null);
        this.error.set(err.error?.message || 'Failed to start checkout. Please try again.');
      },
    });
  }
}
