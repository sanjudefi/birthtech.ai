import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PregnancyProfile {
  id?: string;
  pregnancyMonth: number;
  dueDate: string;
  heightCm?: number;
  weightKg?: number;
  dietPreference: string;
  allergies: string[];
}

export interface ProfileResponse {
  message: string;
  profile: PregnancyProfile;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<PregnancyProfile | null> {
    return this.http.get<PregnancyProfile | null>(`${this.apiUrl}/profile`);
  }

  createProfile(profile: Omit<PregnancyProfile, 'id'>): Observable<ProfileResponse> {
    return this.http.post<ProfileResponse>(`${this.apiUrl}/profile`, profile);
  }

  updateProfile(profile: Partial<PregnancyProfile>): Observable<ProfileResponse> {
    return this.http.put<ProfileResponse>(`${this.apiUrl}/profile`, profile);
  }
}
