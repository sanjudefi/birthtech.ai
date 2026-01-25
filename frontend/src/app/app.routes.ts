import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { subscriptionGuard } from './core/guards/subscription.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing.component').then(
        (m) => m.LandingComponent
      ),
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: 'signup',
        loadComponent: () =>
          import('./features/auth/signup/signup.component').then(
            (m) => m.SignupComponent
          ),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./features/auth/forgot-password/forgot-password.component').then(
            (m) => m.ForgotPasswordComponent
          ),
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./features/auth/reset-password/reset-password.component').then(
            (m) => m.ResetPasswordComponent
          ),
      },
    ],
  },
  {
    path: 'subscribe',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/subscription/plans/plans.component').then(
            (m) => m.PlansComponent
          ),
      },
      {
        path: 'success',
        loadComponent: () =>
          import('./features/subscription/success/success.component').then(
            (m) => m.SuccessComponent
          ),
      },
    ],
  },
  {
    path: 'onboarding',
    canActivate: [authGuard, subscriptionGuard],
    loadComponent: () =>
      import('./features/onboarding/onboarding.component').then(
        (m) => m.OnboardingComponent
      ),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard, subscriptionGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'profile',
    canActivate: [authGuard, subscriptionGuard],
    loadComponent: () =>
      import('./features/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
