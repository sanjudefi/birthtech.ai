import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <div class="landing-page">
      <!-- Hero Section -->
      <header class="hero">
        <nav class="nav-bar">
          <div class="logo">BirthTech.ai</div>
          <div class="nav-links">
            <a mat-button routerLink="/auth/login">Login</a>
            <a mat-raised-button color="primary" routerLink="/auth/signup">
              Get Started
            </a>
          </div>
        </nav>

        <div class="hero-content">
          <h1>Your AI-Powered Pregnancy Care Companion</h1>
          <p>
            Personalized nutrition, exercise, and wellness guidance throughout
            your pregnancy journey. Like having a caring partner and expert
            dietitian by your side.
          </p>
          <div class="hero-buttons">
            <a mat-raised-button color="primary" routerLink="/auth/signup">
              Start Your Journey
            </a>
            <a mat-stroked-button routerLink="/auth/login">
              Already a member? Login
            </a>
          </div>
        </div>
      </header>

      <!-- Features Section -->
      <section class="features">
        <h2>Everything You Need for a Healthy Pregnancy</h2>
        <div class="feature-grid">
          <mat-card class="feature-card">
            <mat-icon>restaurant</mat-icon>
            <h3>Daily Meal Plans</h3>
            <p>
              Personalized nutrition recommendations based on your pregnancy stage
              and dietary preferences.
            </p>
          </mat-card>

          <mat-card class="feature-card">
            <mat-icon>fitness_center</mat-icon>
            <h3>Safe Exercises</h3>
            <p>
              Gentle exercise routines designed specifically for each trimester
              of your pregnancy.
            </p>
          </mat-card>

          <mat-card class="feature-card">
            <mat-icon>local_drink</mat-icon>
            <h3>Hydration Tracking</h3>
            <p>
              Stay properly hydrated with reminders and tracking for your daily
              water intake.
            </p>
          </mat-card>

          <mat-card class="feature-card">
            <mat-icon>calendar_today</mat-icon>
            <h3>Weekly Calendar</h3>
            <p>
              Plan your week with a clear view of meals, exercises, and wellness
              activities.
            </p>
          </mat-card>

          <mat-card class="feature-card">
            <mat-icon>shopping_cart</mat-icon>
            <h3>Grocery Lists</h3>
            <p>
              Weekly shopping lists based on your meal plan, making preparation
              effortless.
            </p>
          </mat-card>

          <mat-card class="feature-card">
            <mat-icon>favorite</mat-icon>
            <h3>Wellness Tips</h3>
            <p>
              Daily tips for sleep, relaxation, and overall well-being during
              pregnancy.
            </p>
          </mat-card>
        </div>
      </section>

      <!-- Pricing Section -->
      <section class="pricing">
        <h2>Simple, Transparent Pricing</h2>
        <div class="pricing-grid">
          <mat-card class="pricing-card">
            <h3>Basic Care</h3>
            <div class="price">
              <span class="currency">$</span>
              <span class="amount">10</span>
              <span class="period">/month</span>
            </div>
            <ul>
              <li>Daily meal suggestions</li>
              <li>Exercise recommendations</li>
              <li>Hydration tracking</li>
              <li>Weekly grocery list</li>
              <li>Basic wellness tips</li>
            </ul>
            <a mat-raised-button routerLink="/auth/signup">Get Started</a>
          </mat-card>

          <mat-card class="pricing-card featured">
            <div class="badge">Most Popular</div>
            <h3>Premium Care</h3>
            <div class="price">
              <span class="currency">$</span>
              <span class="amount">20</span>
              <span class="period">/month</span>
            </div>
            <ul>
              <li>Everything in Basic</li>
              <li>Personalized nutrition plans</li>
              <li>Advanced exercise routines</li>
              <li>Monthly staple inventory</li>
              <li>Priority support</li>
              <li>Partner/family access</li>
            </ul>
            <a mat-raised-button color="primary" routerLink="/auth/signup">
              Get Premium
            </a>
          </mat-card>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-content">
          <div class="footer-brand">
            <div class="logo">BirthTech.ai</div>
            <p>AI-powered pregnancy care for Canadian families.</p>
          </div>
          <div class="footer-disclaimer">
            <p>
              <strong>Disclaimer:</strong> BirthTech.ai provides general guidance
              only and is not a substitute for professional medical advice.
              Always consult your healthcare provider.
            </p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 BirthTech.ai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .landing-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #FDF2F8 0%, #EDE9FE 100%);
    }

    .hero {
      padding: 0 24px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .nav-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 0;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: #8B5CF6;
    }

    .nav-links {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .hero-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      max-width: 800px;
      margin: 0 auto;
    }

    .hero-content h1 {
      font-size: 3rem;
      font-weight: 700;
      color: #1F2937;
      margin-bottom: 24px;
      line-height: 1.2;
    }

    .hero-content p {
      font-size: 1.25rem;
      color: #6B7280;
      margin-bottom: 32px;
      line-height: 1.6;
    }

    .hero-buttons {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .features {
      padding: 80px 24px;
      background: white;
    }

    .features h2 {
      text-align: center;
      font-size: 2rem;
      color: #1F2937;
      margin-bottom: 48px;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .feature-card {
      padding: 32px;
      text-align: center;
      border-radius: 16px;
    }

    .feature-card mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      color: #8B5CF6;
      margin-bottom: 16px;
    }

    .feature-card h3 {
      font-size: 1.25rem;
      color: #1F2937;
      margin-bottom: 8px;
    }

    .feature-card p {
      color: #6B7280;
      line-height: 1.5;
    }

    .pricing {
      padding: 80px 24px;
      background: linear-gradient(135deg, #FDF2F8 0%, #EDE9FE 100%);
    }

    .pricing h2 {
      text-align: center;
      font-size: 2rem;
      color: #1F2937;
      margin-bottom: 48px;
    }

    .pricing-grid {
      display: flex;
      justify-content: center;
      gap: 32px;
      flex-wrap: wrap;
      max-width: 900px;
      margin: 0 auto;
    }

    .pricing-card {
      padding: 40px;
      border-radius: 16px;
      min-width: 320px;
      max-width: 400px;
      position: relative;
    }

    .pricing-card.featured {
      border: 2px solid #8B5CF6;
    }

    .pricing-card .badge {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      background: #8B5CF6;
      color: white;
      padding: 4px 16px;
      border-radius: 16px;
      font-size: 0.875rem;
    }

    .pricing-card h3 {
      font-size: 1.5rem;
      color: #1F2937;
      margin-bottom: 16px;
      text-align: center;
    }

    .price {
      text-align: center;
      margin-bottom: 24px;
    }

    .price .currency {
      font-size: 1.5rem;
      color: #6B7280;
      vertical-align: top;
    }

    .price .amount {
      font-size: 3rem;
      font-weight: 700;
      color: #1F2937;
    }

    .price .period {
      font-size: 1rem;
      color: #6B7280;
    }

    .pricing-card ul {
      list-style: none;
      padding: 0;
      margin-bottom: 24px;
    }

    .pricing-card li {
      padding: 8px 0;
      color: #4B5563;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .pricing-card li::before {
      content: '✓';
      color: #10B981;
      font-weight: bold;
    }

    .pricing-card a {
      width: 100%;
    }

    .footer {
      background: #1F2937;
      color: white;
      padding: 48px 24px 24px;
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      max-width: 1200px;
      margin: 0 auto;
      gap: 48px;
      flex-wrap: wrap;
    }

    .footer-brand .logo {
      color: white;
      margin-bottom: 8px;
    }

    .footer-brand p {
      color: #9CA3AF;
    }

    .footer-disclaimer {
      max-width: 500px;
    }

    .footer-disclaimer p {
      color: #9CA3AF;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .footer-bottom {
      text-align: center;
      margin-top: 48px;
      padding-top: 24px;
      border-top: 1px solid #374151;
    }

    .footer-bottom p {
      color: #6B7280;
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      .hero-content h1 {
        font-size: 2rem;
      }

      .pricing-card {
        min-width: 100%;
      }
    }
  `],
})
export class LandingComponent {}
