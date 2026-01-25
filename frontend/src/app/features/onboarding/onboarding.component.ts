import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { ProfileService } from '../../core/services/profile.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatStepperModule,
  ],
  template: `
    <div class="onboarding-page">
      <div class="onboarding-container">
        <div class="logo">BirthTech.ai</div>
        <h1>Let's Get to Know You</h1>
        <p class="subtitle">
          Tell us about your pregnancy so we can personalize your care experience.
        </p>

        @if (error()) {
          <div class="error-message">{{ error() }}</div>
        }

        <mat-card class="form-card">
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-stepper linear #stepper>
              <!-- Step 1: Pregnancy Info -->
              <mat-step [stepControl]="form">
                <ng-template matStepLabel>Pregnancy Info</ng-template>
                <div class="step-content">
                  <mat-form-field class="form-field" appearance="outline">
                    <mat-label>Current Pregnancy Month</mat-label>
                    <mat-select formControlName="pregnancyMonth">
                      @for (month of months; track month.value) {
                        <mat-option [value]="month.value">
                          {{ month.label }}
                        </mat-option>
                      }
                    </mat-select>
                    <mat-hint>Select your current month of pregnancy</mat-hint>
                  </mat-form-field>

                  <mat-form-field class="form-field" appearance="outline">
                    <mat-label>Expected Due Date</mat-label>
                    <input matInput [matDatepicker]="picker" formControlName="dueDate" />
                    <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                    <mat-datepicker #picker></mat-datepicker>
                  </mat-form-field>

                  <div class="step-actions">
                    <button mat-raised-button color="primary" matStepperNext type="button">
                      Next
                    </button>
                  </div>
                </div>
              </mat-step>

              <!-- Step 2: Physical Info -->
              <mat-step>
                <ng-template matStepLabel>Your Details</ng-template>
                <div class="step-content">
                  <div class="row">
                    <mat-form-field class="form-field half" appearance="outline">
                      <mat-label>Height (cm)</mat-label>
                      <input matInput type="number" formControlName="heightCm" />
                    </mat-form-field>

                    <mat-form-field class="form-field half" appearance="outline">
                      <mat-label>Weight (kg)</mat-label>
                      <input matInput type="number" formControlName="weightKg" />
                    </mat-form-field>
                  </div>

                  <mat-form-field class="form-field" appearance="outline">
                    <mat-label>Diet Preference</mat-label>
                    <mat-select formControlName="dietPreference">
                      <mat-option value="non-veg">Non-Vegetarian</mat-option>
                      <mat-option value="veg">Vegetarian</mat-option>
                      <mat-option value="vegan">Vegan</mat-option>
                    </mat-select>
                  </mat-form-field>

                  <div class="step-actions">
                    <button mat-button matStepperPrevious type="button">Back</button>
                    <button mat-raised-button color="primary" matStepperNext type="button">
                      Next
                    </button>
                  </div>
                </div>
              </mat-step>

              <!-- Step 3: Allergies -->
              <mat-step>
                <ng-template matStepLabel>Allergies</ng-template>
                <div class="step-content">
                  <p class="info-text">
                    Add any food allergies so we can customize your meal recommendations.
                    Press Enter after each allergy.
                  </p>

                  <mat-form-field class="form-field" appearance="outline">
                    <mat-label>Food Allergies (optional)</mat-label>
                    <mat-chip-grid #chipGrid>
                      @for (allergy of allergies(); track allergy) {
                        <mat-chip-row (removed)="removeAllergy(allergy)">
                          {{ allergy }}
                          <button matChipRemove>
                            <mat-icon>cancel</mat-icon>
                          </button>
                        </mat-chip-row>
                      }
                    </mat-chip-grid>
                    <input
                      placeholder="Type and press Enter..."
                      [matChipInputFor]="chipGrid"
                      [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
                      (matChipInputTokenEnd)="addAllergy($event)"
                    />
                  </mat-form-field>

                  <div class="step-actions">
                    <button mat-button matStepperPrevious type="button">Back</button>
                    <button
                      mat-raised-button
                      color="primary"
                      type="submit"
                      [disabled]="loading() || form.invalid"
                    >
                      @if (loading()) {
                        <mat-spinner diameter="20"></mat-spinner>
                      } @else {
                        Start My Journey
                      }
                    </button>
                  </div>
                </div>
              </mat-step>
            </mat-stepper>
          </form>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .onboarding-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #FDF2F8 0%, #EDE9FE 100%);
      padding: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .onboarding-container {
      max-width: 600px;
      width: 100%;
    }

    .logo {
      text-align: center;
      font-size: 1.5rem;
      font-weight: 700;
      color: #8B5CF6;
      margin-bottom: 24px;
    }

    h1 {
      text-align: center;
      font-size: 2rem;
      color: #1F2937;
      margin-bottom: 8px;
    }

    .subtitle {
      text-align: center;
      color: #6B7280;
      margin-bottom: 32px;
    }

    .form-card {
      padding: 32px;
      border-radius: 16px;
    }

    .step-content {
      padding: 24px 0;
    }

    .form-field {
      width: 100%;
      margin-bottom: 16px;
    }

    .row {
      display: flex;
      gap: 16px;
    }

    .half {
      flex: 1;
    }

    .info-text {
      color: #6B7280;
      margin-bottom: 16px;
      line-height: 1.5;
    }

    .step-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 24px;
    }

    .error-message {
      background: #FEE2E2;
      color: #DC2626;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 16px;
      text-align: center;
    }

    ::ng-deep .mat-horizontal-stepper-header-container {
      margin-bottom: 16px;
    }

    @media (max-width: 480px) {
      .row {
        flex-direction: column;
        gap: 0;
      }
    }
  `],
})
export class OnboardingComponent {
  form: FormGroup;
  loading = signal(false);
  error = signal('');
  allergies = signal<string[]>([]);
  separatorKeysCodes = [ENTER, COMMA];

  months = [
    { value: 1, label: 'Month 1 (Weeks 1-4)' },
    { value: 2, label: 'Month 2 (Weeks 5-8)' },
    { value: 3, label: 'Month 3 (Weeks 9-13)' },
    { value: 4, label: 'Month 4 (Weeks 14-17)' },
    { value: 5, label: 'Month 5 (Weeks 18-22)' },
    { value: 6, label: 'Month 6 (Weeks 23-27)' },
    { value: 7, label: 'Month 7 (Weeks 28-31)' },
    { value: 8, label: 'Month 8 (Weeks 32-35)' },
    { value: 9, label: 'Month 9 (Weeks 36-40)' },
  ];

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private router: Router
  ) {
    this.form = this.fb.group({
      pregnancyMonth: [null, Validators.required],
      dueDate: [null, Validators.required],
      heightCm: [null],
      weightKg: [null],
      dietPreference: ['non-veg', Validators.required],
    });
  }

  addAllergy(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.allergies.update((allergies) => [...allergies, value]);
    }
    event.chipInput!.clear();
  }

  removeAllergy(allergy: string): void {
    this.allergies.update((allergies) => allergies.filter((a) => a !== allergy));
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const formValue = this.form.value;
    const profile = {
      pregnancyMonth: formValue.pregnancyMonth,
      dueDate: formValue.dueDate.toISOString(),
      heightCm: formValue.heightCm,
      weightKg: formValue.weightKg,
      dietPreference: formValue.dietPreference,
      allergies: this.allergies(),
    };

    this.profileService.createProfile(profile).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Failed to create profile. Please try again.');
      },
    });
  }
}
