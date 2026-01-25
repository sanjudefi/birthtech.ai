import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  priceId: string;
}

export interface SubscriptionStatus {
  status: string;
  planType?: string;
  hasSubscription: boolean;
  currentPeriodEnd?: string;
}

export interface CheckoutResponse {
  sessionId: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPlans(): Observable<SubscriptionPlan[]> {
    return this.http.get<SubscriptionPlan[]>(`${this.apiUrl}/subscription/plans`);
  }

  createCheckout(planType: string): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(`${this.apiUrl}/subscription/checkout`, {
      planType,
    });
  }

  getStatus(): Observable<SubscriptionStatus> {
    return this.http.get<SubscriptionStatus>(`${this.apiUrl}/subscription/status`);
  }
}
