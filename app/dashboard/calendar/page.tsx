'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Utensils,
  Dumbbell,
  Pill,
  CheckCircle,
  Baby,
} from 'lucide-react';

interface DayData {
  date: Date;
  hasMealPlan: boolean;
  hasWorkout: boolean;
  supplementsTaken: boolean;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarPage() {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [profile, setProfile] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchProfile(token);
  }, [router]);

  const fetchProfile = async (token: string) => {
    try {
      const res = await fetch('/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const getDaysInMonth = (date: Date): DayData[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days: DayData[] = [];

    // Add empty days for the start of the week
    for (let i = 0; i < firstDay.getDay(); i++) {
      const prevDate = new Date(year, month, -(firstDay.getDay() - 1 - i));
      days.push({
        date: prevDate,
        hasMealPlan: false,
        hasWorkout: false,
        supplementsTaken: false,
        isToday: false,
        isPast: true,
        isFuture: false,
      });
    }

    // Add days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const currentDate = new Date(year, month, day);
      currentDate.setHours(0, 0, 0, 0);

      days.push({
        date: currentDate,
        hasMealPlan: Math.random() > 0.5, // Demo data
        hasWorkout: Math.random() > 0.6,
        supplementsTaken: Math.random() > 0.4,
        isToday: currentDate.getTime() === today.getTime(),
        isPast: currentDate < today,
        isFuture: currentDate > today,
      });
    }

    // Add empty days for the end of the week
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({
        date: nextDate,
        hasMealPlan: false,
        hasWorkout: false,
        supplementsTaken: false,
        isToday: false,
        isPast: false,
        isFuture: true,
      });
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getDueDateInfo = () => {
    if (!profile?.dueDate) return null;
    const dueDate = new Date(profile.dueDate);
    const today = new Date();
    const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return { dueDate, daysRemaining };
  };

  const dueDateInfo = getDueDateInfo();
  const days = getDaysInMonth(currentMonth);
  const isCurrentMonthView = currentMonth.getMonth() === new Date().getMonth() &&
                             currentMonth.getFullYear() === new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">Calendar</h1>
              <p className="text-xs text-gray-500">Track your pregnancy journey</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Due Date Countdown */}
        {dueDateInfo && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-5 text-white mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Due Date</p>
                <p className="text-xl font-bold">
                  {dueDateInfo.dueDate.toLocaleDateString('en-CA', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-1">
                  <Baby className="w-8 h-8" />
                </div>
                <p className="text-2xl font-bold">{Math.max(0, dueDateInfo.daysRemaining)}</p>
                <p className="text-xs text-purple-100">days to go</p>
              </div>
            </div>
          </div>
        )}

        {/* Calendar */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekdays.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-gray-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              const isCurrentMonth = day.date.getMonth() === currentMonth.getMonth();

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(day.date)}
                  disabled={!isCurrentMonth}
                  className={`relative aspect-square p-1 rounded-lg transition-colors ${
                    !isCurrentMonth
                      ? 'text-gray-300'
                      : day.isToday
                      ? 'bg-purple-500 text-white'
                      : selectedDate?.toDateString() === day.date.toDateString()
                      ? 'bg-purple-100 text-purple-700'
                      : day.isPast
                      ? 'text-gray-400 hover:bg-gray-50'
                      : 'text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-sm font-medium">{day.date.getDate()}</span>

                  {/* Activity Indicators */}
                  {isCurrentMonth && day.isPast && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                      {day.hasMealPlan && (
                        <div className="w-1.5 h-1.5 bg-pink-400 rounded-full" title="Meal Plan" />
                      )}
                      {day.hasWorkout && (
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" title="Workout" />
                      )}
                      {day.supplementsTaken && (
                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" title="Supplements" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-pink-400 rounded-full" />
              <span className="text-xs text-gray-500">Meals</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-purple-400 rounded-full" />
              <span className="text-xs text-gray-500">Workout</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-orange-400 rounded-full" />
              <span className="text-xs text-gray-500">Supplements</span>
            </div>
          </div>
        </div>

        {/* Selected Date Details */}
        {selectedDate && (
          <div className="mt-6 bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">
              {selectedDate.toLocaleDateString('en-CA', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </h3>

            <div className="space-y-3">
              <Link
                href={`/dashboard/meals?date=${selectedDate.toISOString().split('T')[0]}`}
                className="flex items-center gap-3 p-3 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors"
              >
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-pink-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Meal Plan</p>
                  <p className="text-sm text-gray-500">View or generate meals</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>

              <Link
                href={`/dashboard/workouts?date=${selectedDate.toISOString().split('T')[0]}`}
                className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-purple-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Workout</p>
                  <p className="text-sm text-gray-500">View or generate exercises</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>

              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Pill className="w-5 h-5 text-orange-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Supplements</p>
                  <p className="text-sm text-gray-500">Track daily intake</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </div>
        )}

        {/* Pregnancy Milestones */}
        <div className="mt-6 bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Upcoming Milestones</h3>
          <div className="space-y-3">
            {profile?.pregnancyMonth && profile.pregnancyMonth < 9 && (
              <>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Month {profile.pregnancyMonth + 1}</p>
                    <p className="text-sm text-gray-500">Baby continues to grow!</p>
                  </div>
                </div>
                {profile.pregnancyMonth < 6 && (
                  <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-xl">
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Anatomy Scan</p>
                      <p className="text-sm text-gray-500">Usually around week 18-22</p>
                    </div>
                  </div>
                )}
              </>
            )}
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Baby className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Due Date</p>
                <p className="text-sm text-gray-500">
                  {profile?.dueDate
                    ? new Date(profile.dueDate).toLocaleDateString('en-CA', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Not set'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
