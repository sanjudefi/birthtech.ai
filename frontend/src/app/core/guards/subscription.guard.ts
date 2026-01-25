import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { SubscriptionService } from '../services/subscription.service';

export const subscriptionGuard: CanActivateFn = () => {
  const subscriptionService = inject(SubscriptionService);
  const router = inject(Router);

  return subscriptionService.getStatus().pipe(
    map((status) => {
      if (status.hasSubscription) {
        return true;
      }
      router.navigate(['/subscribe']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/subscribe']);
      return of(false);
    })
  );
};
