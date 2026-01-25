import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Meal {
  name: string;
  description: string;
}

export interface MealPlan {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: string[];
}

export interface TodaysCare {
  greeting: string;
  pregnancyInfo: {
    month: number;
    week: number;
    babySize: string;
    babySizeEmoji: string;
    dueDate: string;
  };
  todaysCare: {
    meals: MealPlan;
    exercise: {
      minutes: number;
      type: string;
    };
    hydration: {
      targetGlasses: number;
      completed: number;
    };
    sleepTip: string;
    wellnessTip: string;
    safetyNote: string;
  };
  disclaimer: string;
}

export interface WeekDay {
  date: string;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
  isPast: boolean;
  summary: {
    mealHighlight: string;
    exerciseMinutes: number;
    exerciseType: string;
  };
}

export interface WeeklyCalendar {
  weekStart: string;
  weekEnd: string;
  days: WeekDay[];
}

export interface InventoryItem {
  item: string;
  quantity: string;
}

export interface WeeklyInventory {
  title: string;
  description: string;
  inventory: {
    proteins: InventoryItem[];
    vegetables: InventoryItem[];
    fruits: InventoryItem[];
    dairy: InventoryItem[];
    grains: InventoryItem[];
  };
}

export interface MonthlyStaples {
  title: string;
  description: string;
  pregnancyMonth: number;
  staples: {
    ironRich: string[];
    calciumSources: string[];
    omega3: string[];
    folate: string[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class CareService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTodaysCare(): Observable<TodaysCare> {
    return this.http.get<TodaysCare>(`${this.apiUrl}/care/today`);
  }

  getWeeklyCalendar(): Observable<WeeklyCalendar> {
    return this.http.get<WeeklyCalendar>(`${this.apiUrl}/care/week`);
  }

  getWeeklyInventory(): Observable<WeeklyInventory> {
    return this.http.get<WeeklyInventory>(`${this.apiUrl}/care/inventory/weekly`);
  }

  getMonthlyStaples(): Observable<MonthlyStaples> {
    return this.http.get<MonthlyStaples>(`${this.apiUrl}/care/inventory/monthly`);
  }
}
