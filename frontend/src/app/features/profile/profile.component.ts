import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
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
import { MatToolbarModule } from '@angular/material/toolbar';
import { ProfileService, PregnancyProfile } from '../../core/services/profile.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
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
    MatToolbarModule,
  ],
  template: `
    <div class="profile-page">
      <mat-toolbar class="header" color="primary">
        <button mat-icon-button routerLink="/dashboard">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span>Edit Profile</span>
      </mat-toolbar>

      <div class="profile-container">
        @if (loading()) {
          <div class="loading-state">
            <mat-spinner diameter="48"></mat-spinner>
          </div>
        } @else {
          @if (error()) {
            <div class="error-message">{{ error() }}</div>
          }

          @if (success()) {
            <div class="success-message">
              <mat-icon>check_circle</mat-icon>
              Profile updated successfully!
            </div>
          }

          <mat-card class="form-card">
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <mat-form-field class="form-field" appearance="outline">
                <mat-label>Current Pregnancy Month</mat-label>
                <mat-select formControlName="pregnancyMonth">
                  @for (month of months; track month.value) {
                    <mat-option [value]="month.value">
                      {{ month.label }}
                    </mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field class="form-field" appearance="outline">
                <mat-label>Expected Due Date</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="dueDate" />
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>

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

              <mat-form-field class="form-field" appearance="outline">
                <mat-label>Food Allergies</mat-label>
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

              <div class="form-actions">
                <button mat-button type="button" routerLink="/dashboard">
                  Cancel
                </button>
                <button
                  mat-raised-button
                  color="primary"
                  type="submit"
                  [disabled]="saving()"
                >
                  @if (saving()) {
                    <mat-spinner diameter="20"></mat-spinner>
                  } @else {
                    Save Changes
                  }
                </button>
              </div>
            </form>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: [`
    .profile-page {
      min-height: 100vh;
      background: #FDF2F8;
    }

    .header {
      background: linear-gradient(135deg, #8B5CF6 0%, #F472B6 100%);
    }

    .profile-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 24px;
    }

    .loading-state {
      display: flex;
      justify-content: center;
      padding: 48px;
    }

    .form-card {
      padding: 32px;
      border-radius: 16px;
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

    .form-actions {
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
    }

    .success-message {
      background: #D1FAE5;
      color: #065F46;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    @media (max-width: 480px) {
      .row {
        flex-direction: column;
        gap: 0;
      }
    }
  `],
})
export class ProfileComponent implements OnInit {
  form: FormGroup;
  loading = signal(true);
  saving = signal(false);
  error = signal('');
  success = signal(false);
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

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        if (profile) {
          this.form.patchValue({
            pregnancyMonth: profile.pregnancyMonth,
            dueDate: new Date(profile.dueDate),
            heightCm: profile.heightCm,
            weightKg: profile.weightKg,
            dietPreference: profile.dietPreference,
          });
          this.allergies.set(profile.allergies || []);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/onboarding']);
      },
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

    this.saving.set(true);
    this.error.set('');
    this.success.set(false);

    const formValue = this.form.value;
    const profile = {
      pregnancyMonth: formValue.pregnancyMonth,
      dueDate: formValue.dueDate.toISOString(),
      heightCm: formValue.heightCm,
      weightKg: formValue.weightKg,
      dietPreference: formValue.dietPreference,
      allergies: this.allergies(),
    };

    this.profileService.updateProfile(profile).subscribe({
      next: () => {
        this.saving.set(false);
        this.success.set(true);
        setTimeout(() => this.success.set(false), 3000);
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err.error?.message || 'Failed to update profile. Please try again.');
      },
    });
  }
}
