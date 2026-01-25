import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';
import {
  CareService,
  TodaysCare,
  WeeklyCalendar,
  WeeklyInventory,
  MonthlyStaples,
} from '../../core/services/care.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatMenuModule,
    MatTabsModule,
    MatDividerModule,
  ],
  template: `
    <div class="dashboard">
      <!-- Header -->
      <mat-toolbar class="header" color="primary">
        <span class="logo">BirthTech.ai</span>
        <span class="spacer"></span>
        <button mat-icon-button routerLink="/profile">
          <mat-icon>person</mat-icon>
        </button>
        <button mat-icon-button [matMenuTriggerFor]="menu">
          <mat-icon>more_vert</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item routerLink="/profile">
            <mat-icon>edit</mat-icon>
            <span>Edit Profile</span>
          </button>
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Logout</span>
          </button>
        </mat-menu>
      </mat-toolbar>

      @if (loading()) {
        <div class="loading-container">
          <mat-spinner diameter="48"></mat-spinner>
          <p>Loading your care plan...</p>
        </div>
      } @else if (todaysCare()) {
        <div class="dashboard-content">
          <!-- Greeting Header -->
          <div class="greeting-section">
            <h1>{{ todaysCare()!.greeting }}</h1>
            <p class="pregnancy-info">
              You're in Week {{ todaysCare()!.pregnancyInfo.week }}
              {{ todaysCare()!.pregnancyInfo.babySizeEmoji }}
              Baby is the size of {{ todaysCare()!.pregnancyInfo.babySize }}
            </p>
          </div>

          <!-- Today's Care Section -->
          <section class="section">
            <h2 class="section-title">
              <mat-icon>favorite</mat-icon>
              Today's Care
            </h2>
            <div class="care-grid">
              <!-- Meals Card -->
              <mat-card class="care-card meals-card">
                <div class="card-header">
                  <mat-icon>restaurant</mat-icon>
                  <h3>Meals</h3>
                </div>
                <div class="meal-item">
                  <span class="meal-label">Breakfast</span>
                  <span class="meal-name">{{ todaysCare()!.todaysCare.meals.breakfast.name }}</span>
                  <span class="meal-desc">{{ todaysCare()!.todaysCare.meals.breakfast.description }}</span>
                </div>
                <mat-divider></mat-divider>
                <div class="meal-item">
                  <span class="meal-label">Lunch</span>
                  <span class="meal-name">{{ todaysCare()!.todaysCare.meals.lunch.name }}</span>
                  <span class="meal-desc">{{ todaysCare()!.todaysCare.meals.lunch.description }}</span>
                </div>
                <mat-divider></mat-divider>
                <div class="meal-item">
                  <span class="meal-label">Dinner</span>
                  <span class="meal-name">{{ todaysCare()!.todaysCare.meals.dinner.name }}</span>
                  <span class="meal-desc">{{ todaysCare()!.todaysCare.meals.dinner.description }}</span>
                </div>
                @if (todaysCare()!.todaysCare.meals.snacks.length) {
                  <mat-divider></mat-divider>
                  <div class="snacks">
                    <span class="meal-label">Snacks</span>
                    <ul>
                      @for (snack of todaysCare()!.todaysCare.meals.snacks; track snack) {
                        <li>{{ snack }}</li>
                      }
                    </ul>
                  </div>
                }
              </mat-card>

              <!-- Exercise Card -->
              <mat-card class="care-card">
                <div class="card-header">
                  <mat-icon>fitness_center</mat-icon>
                  <h3>Exercise</h3>
                </div>
                <div class="stat-display">
                  <span class="stat-number">{{ todaysCare()!.todaysCare.exercise.minutes }}</span>
                  <span class="stat-label">minutes</span>
                </div>
                <p class="care-text">{{ todaysCare()!.todaysCare.exercise.type }}</p>
              </mat-card>

              <!-- Hydration Card -->
              <mat-card class="care-card">
                <div class="card-header">
                  <mat-icon>local_drink</mat-icon>
                  <h3>Hydration</h3>
                </div>
                <div class="stat-display">
                  <span class="stat-number">{{ todaysCare()!.todaysCare.hydration.targetGlasses }}</span>
                  <span class="stat-label">glasses</span>
                </div>
                <p class="care-text">Stay hydrated throughout the day</p>
              </mat-card>

              <!-- Sleep Card -->
              <mat-card class="care-card">
                <div class="card-header">
                  <mat-icon>bedtime</mat-icon>
                  <h3>Rest</h3>
                </div>
                <p class="care-text">{{ todaysCare()!.todaysCare.sleepTip }}</p>
              </mat-card>

              <!-- Wellness Card -->
              <mat-card class="care-card">
                <div class="card-header">
                  <mat-icon>spa</mat-icon>
                  <h3>Wellness</h3>
                </div>
                <p class="care-text">{{ todaysCare()!.todaysCare.wellnessTip }}</p>
              </mat-card>

              <!-- Safety Card -->
              <mat-card class="care-card safety-card">
                <div class="card-header">
                  <mat-icon>warning</mat-icon>
                  <h3>Safety</h3>
                </div>
                <p class="care-text">{{ todaysCare()!.todaysCare.safetyNote }}</p>
              </mat-card>
            </div>
          </section>

          <!-- Weekly Calendar -->
          @if (weeklyCalendar()) {
            <section class="section">
              <h2 class="section-title">
                <mat-icon>calendar_today</mat-icon>
                This Week
              </h2>
              <mat-card class="calendar-card">
                <div class="calendar-header">
                  <span>{{ weeklyCalendar()!.weekStart }} - {{ weeklyCalendar()!.weekEnd }}</span>
                </div>
                <div class="calendar-grid">
                  @for (day of weeklyCalendar()!.days; track day.date) {
                    <div
                      class="calendar-day"
                      [class.today]="day.isToday"
                      [class.past]="day.isPast"
                    >
                      <span class="day-name">{{ day.dayName }}</span>
                      <span class="day-number">{{ day.dayNumber }}</span>
                      @if (day.isPast) {
                        <mat-icon class="completed-icon">check_circle</mat-icon>
                      }
                    </div>
                  }
                </div>
              </mat-card>
            </section>
          }

          <!-- Weekly Grocery List -->
          @if (weeklyInventory()) {
            <section class="section">
              <h2 class="section-title">
                <mat-icon>shopping_cart</mat-icon>
                {{ weeklyInventory()!.title }}
              </h2>
              <mat-card class="inventory-card">
                <p class="inventory-desc">{{ weeklyInventory()!.description }}</p>
                <div class="inventory-grid">
                  <div class="inventory-category">
                    <h4>Proteins</h4>
                    <ul>
                      @for (item of weeklyInventory()!.inventory.proteins; track item.item) {
                        <li>{{ item.item }} - {{ item.quantity }}</li>
                      }
                    </ul>
                  </div>
                  <div class="inventory-category">
                    <h4>Vegetables</h4>
                    <ul>
                      @for (item of weeklyInventory()!.inventory.vegetables; track item.item) {
                        <li>{{ item.item }} - {{ item.quantity }}</li>
                      }
                    </ul>
                  </div>
                  <div class="inventory-category">
                    <h4>Fruits</h4>
                    <ul>
                      @for (item of weeklyInventory()!.inventory.fruits; track item.item) {
                        <li>{{ item.item }} - {{ item.quantity }}</li>
                      }
                    </ul>
                  </div>
                  <div class="inventory-category">
                    <h4>Dairy</h4>
                    <ul>
                      @for (item of weeklyInventory()!.inventory.dairy; track item.item) {
                        <li>{{ item.item }} - {{ item.quantity }}</li>
                      }
                    </ul>
                  </div>
                  <div class="inventory-category">
                    <h4>Grains</h4>
                    <ul>
                      @for (item of weeklyInventory()!.inventory.grains; track item.item) {
                        <li>{{ item.item }} - {{ item.quantity }}</li>
                      }
                    </ul>
                  </div>
                </div>
              </mat-card>
            </section>
          }

          <!-- Monthly Staples -->
          @if (monthlyStaples()) {
            <section class="section">
              <h2 class="section-title">
                <mat-icon>inventory_2</mat-icon>
                {{ monthlyStaples()!.title }}
              </h2>
              <mat-card class="staples-card">
                <p class="staples-desc">{{ monthlyStaples()!.description }}</p>
                <div class="staples-grid">
                  <div class="staple-category">
                    <h4><mat-icon>grain</mat-icon> Iron-Rich Foods</h4>
                    <ul>
                      @for (item of monthlyStaples()!.staples.ironRich; track item) {
                        <li>{{ item }}</li>
                      }
                    </ul>
                  </div>
                  <div class="staple-category">
                    <h4><mat-icon>local_cafe</mat-icon> Calcium Sources</h4>
                    <ul>
                      @for (item of monthlyStaples()!.staples.calciumSources; track item) {
                        <li>{{ item }}</li>
                      }
                    </ul>
                  </div>
                  <div class="staple-category">
                    <h4><mat-icon>set_meal</mat-icon> Omega-3</h4>
                    <ul>
                      @for (item of monthlyStaples()!.staples.omega3; track item) {
                        <li>{{ item }}</li>
                      }
                    </ul>
                  </div>
                  <div class="staple-category">
                    <h4><mat-icon>eco</mat-icon> Folate</h4>
                    <ul>
                      @for (item of monthlyStaples()!.staples.folate; track item) {
                        <li>{{ item }}</li>
                      }
                    </ul>
                  </div>
                </div>
              </mat-card>
            </section>
          }

          <!-- Disclaimer -->
          <div class="disclaimer">
            <mat-icon>info</mat-icon>
            <p>{{ todaysCare()!.disclaimer }}</p>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard {
      min-height: 100vh;
      background: #FDF2F8;
    }

    .header {
      background: linear-gradient(135deg, #8B5CF6 0%, #F472B6 100%);
    }

    .logo {
      font-size: 1.25rem;
      font-weight: 700;
    }

    .spacer {
      flex: 1;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 64px);
      gap: 16px;
    }

    .loading-container p {
      color: #6B7280;
    }

    .dashboard-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    .greeting-section {
      background: linear-gradient(135deg, #8B5CF6 0%, #F472B6 100%);
      color: white;
      padding: 32px;
      border-radius: 16px;
      margin-bottom: 32px;
    }

    .greeting-section h1 {
      font-size: 1.75rem;
      margin-bottom: 8px;
    }

    .pregnancy-info {
      opacity: 0.9;
      font-size: 1.125rem;
    }

    .section {
      margin-bottom: 32px;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.25rem;
      color: #1F2937;
      margin-bottom: 16px;
    }

    .section-title mat-icon {
      color: #8B5CF6;
    }

    .care-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
    }

    .care-card {
      padding: 24px;
      border-radius: 16px;
    }

    .meals-card {
      grid-column: span 2;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .card-header mat-icon {
      color: #8B5CF6;
      font-size: 28px;
      height: 28px;
      width: 28px;
    }

    .card-header h3 {
      font-size: 1.125rem;
      color: #1F2937;
      margin: 0;
    }

    .meal-item {
      padding: 12px 0;
    }

    .meal-label {
      display: block;
      font-size: 0.75rem;
      color: #8B5CF6;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .meal-name {
      display: block;
      font-size: 1rem;
      font-weight: 500;
      color: #1F2937;
      margin: 4px 0;
    }

    .meal-desc {
      display: block;
      font-size: 0.875rem;
      color: #6B7280;
    }

    .snacks ul {
      list-style: none;
      padding: 0;
      margin: 8px 0 0 0;
    }

    .snacks li {
      color: #6B7280;
      font-size: 0.875rem;
      padding: 4px 0;
    }

    .stat-display {
      text-align: center;
      margin: 16px 0;
    }

    .stat-number {
      font-size: 3rem;
      font-weight: 700;
      color: #8B5CF6;
    }

    .stat-label {
      display: block;
      color: #6B7280;
      font-size: 0.875rem;
    }

    .care-text {
      color: #4B5563;
      line-height: 1.6;
    }

    .safety-card {
      border-left: 4px solid #F59E0B;
    }

    .safety-card .card-header mat-icon {
      color: #F59E0B;
    }

    .calendar-card {
      padding: 24px;
      border-radius: 16px;
    }

    .calendar-header {
      text-align: center;
      font-weight: 500;
      color: #6B7280;
      margin-bottom: 16px;
    }

    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 8px;
    }

    .calendar-day {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px 8px;
      border-radius: 12px;
      background: #F9FAFB;
      transition: background-color 0.2s;
    }

    .calendar-day.today {
      background: #8B5CF6;
      color: white;
    }

    .calendar-day.past {
      background: #D1FAE5;
    }

    .day-name {
      font-size: 0.75rem;
      font-weight: 500;
      margin-bottom: 4px;
    }

    .day-number {
      font-size: 1.25rem;
      font-weight: 600;
    }

    .completed-icon {
      font-size: 16px;
      height: 16px;
      width: 16px;
      color: #10B981;
      margin-top: 4px;
    }

    .inventory-card, .staples-card {
      padding: 24px;
      border-radius: 16px;
    }

    .inventory-desc, .staples-desc {
      color: #6B7280;
      margin-bottom: 24px;
    }

    .inventory-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 24px;
    }

    .inventory-category h4, .staple-category h4 {
      font-size: 0.875rem;
      color: #8B5CF6;
      margin-bottom: 12px;
      font-weight: 600;
    }

    .inventory-category ul, .staple-category ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .inventory-category li, .staple-category li {
      padding: 6px 0;
      color: #4B5563;
      font-size: 0.875rem;
      border-bottom: 1px solid #F3F4F6;
    }

    .inventory-category li:last-child, .staple-category li:last-child {
      border-bottom: none;
    }

    .staples-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
    }

    .staple-category h4 {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .staple-category h4 mat-icon {
      font-size: 18px;
      height: 18px;
      width: 18px;
    }

    .disclaimer {
      background: #FEF3C7;
      border-left: 4px solid #F59E0B;
      padding: 16px;
      border-radius: 8px;
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }

    .disclaimer mat-icon {
      color: #F59E0B;
      flex-shrink: 0;
    }

    .disclaimer p {
      color: #92400E;
      font-size: 0.875rem;
      margin: 0;
      line-height: 1.5;
    }

    @media (max-width: 768px) {
      .meals-card {
        grid-column: span 1;
      }

      .calendar-grid {
        grid-template-columns: repeat(7, 1fr);
      }

      .calendar-day {
        padding: 8px 4px;
      }

      .day-name {
        font-size: 0.625rem;
      }

      .day-number {
        font-size: 1rem;
      }
    }
  `],
})
export class DashboardComponent implements OnInit {
  loading = signal(true);
  todaysCare = signal<TodaysCare | null>(null);
  weeklyCalendar = signal<WeeklyCalendar | null>(null);
  weeklyInventory = signal<WeeklyInventory | null>(null);
  monthlyStaples = signal<MonthlyStaples | null>(null);

  constructor(
    private careService: CareService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Load today's care
    this.careService.getTodaysCare().subscribe({
      next: (data) => {
        this.todaysCare.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 404) {
          // Profile not found, redirect to onboarding
          this.router.navigate(['/onboarding']);
        }
      },
    });

    // Load weekly calendar
    this.careService.getWeeklyCalendar().subscribe({
      next: (data) => this.weeklyCalendar.set(data),
    });

    // Load weekly inventory
    this.careService.getWeeklyInventory().subscribe({
      next: (data) => this.weeklyInventory.set(data),
    });

    // Load monthly staples
    this.careService.getMonthlyStaples().subscribe({
      next: (data) => this.monthlyStaples.set(data),
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
