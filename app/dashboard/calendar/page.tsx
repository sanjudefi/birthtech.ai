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
  Star,
  Info,
  Droplets,
  ShoppingCart,
  FileText,
} from 'lucide-react';

interface DayData {
  date: Date;
  hasMealPlan: boolean;
  hasWorkout: boolean;
  supplementsTaken: boolean;
  hydrationComplete: boolean;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  isCurrentMonth: boolean;
  isDueDate?: boolean;
  pregnancyWeek?: number;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Pregnancy week highlights
const weekHighlights: Record<number, { title: string; description: string; emoji: string }> = {
  4: { title: 'Implantation', description: 'Baby implants in uterus', emoji: '🌱' },
  8: { title: 'Heartbeat', description: 'Heart starts beating!', emoji: '💗' },
  12: { title: 'First Trimester End', description: 'Risk of miscarriage drops', emoji: '🎉' },
  16: { title: 'Quickening', description: 'May feel first movements', emoji: '✨' },
  20: { title: 'Anatomy Scan', description: 'Detailed ultrasound time', emoji: '📷' },
  24: { title: 'Viability', description: 'Baby could survive if born', emoji: '🌟' },
  28: { title: 'Third Trimester', description: 'Final stretch begins!', emoji: '🏃‍♀️' },
  32: { title: 'Baby Position', description: 'Baby starts positioning', emoji: '👶' },
  36: { title: 'Full Term Soon', description: 'Almost there!', emoji: '🎯' },
  40: { title: 'Due Date', description: 'Baby could arrive anytime', emoji: '🍼' },
};

// Baby size by week
const babySizeByWeek: Record<number, { size: string; emoji: string }> = {
  4: { size: 'poppy seed', emoji: '·' },
  5: { size: 'sesame seed', emoji: '·' },
  6: { size: 'lentil', emoji: '🫘' },
  7: { size: 'blueberry', emoji: '🫐' },
  8: { size: 'raspberry', emoji: '🍇' },
  9: { size: 'olive', emoji: '🫒' },
  10: { size: 'prune', emoji: '🍇' },
  11: { size: 'lime', emoji: '🍋' },
  12: { size: 'plum', emoji: '🍑' },
  14: { size: 'lemon', emoji: '🍋' },
  16: { size: 'avocado', emoji: '🥑' },
  18: { size: 'bell pepper', emoji: '🫑' },
  20: { size: 'banana', emoji: '🍌' },
  22: { size: 'papaya', emoji: '🥭' },
  24: { size: 'corn', emoji: '🌽' },
  26: { size: 'lettuce', emoji: '🥬' },
  28: { size: 'eggplant', emoji: '🍆' },
  30: { size: 'cabbage', emoji: '🥬' },
  32: { size: 'squash', emoji: '🎃' },
  34: { size: 'cantaloupe', emoji: '🍈' },
  36: { size: 'honeydew', emoji: '🍈' },
  38: { size: 'pumpkin', emoji: '🎃' },
  40: { size: 'watermelon', emoji: '🍉' },
};

export default function CalendarPage() {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [profile, setProfile] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const getPregnancyWeekForDate = (date: Date): number | undefined => {
    if (!profile?.lastPeriodDate) return undefined;
    const lmp = new Date(profile.lastPeriodDate);
    const diffTime = date.getTime() - lmp.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return undefined;
    const week = Math.floor(diffDays / 7);
    if (week < 1 || week > 42) return undefined;
    return week;
  };

  const getCurrentPregnancyWeek = (): number => {
    if (!profile?.lastPeriodDate) {
      // Estimate from pregnancy month
      return (profile?.pregnancyMonth || 6) * 4;
    }
    const week = getPregnancyWeekForDate(new Date());
    return week || (profile?.pregnancyMonth || 6) * 4;
  };

  const getTrimester = (week: number): number => {
    if (week <= 12) return 1;
    if (week <= 27) return 2;
    return 3;
  };

  const getDaysInMonth = (date: Date): DayData[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = profile?.dueDate ? new Date(profile.dueDate) : null;
    if (dueDate) dueDate.setHours(0, 0, 0, 0);

    const days: DayData[] = [];

    // Add empty days for the start of the week
    for (let i = 0; i < firstDay.getDay(); i++) {
      const prevDate = new Date(year, month, -(firstDay.getDay() - 1 - i));
      days.push({
        date: prevDate,
        hasMealPlan: false,
        hasWorkout: false,
        supplementsTaken: false,
        hydrationComplete: false,
        isToday: false,
        isPast: true,
        isFuture: false,
        isCurrentMonth: false,
      });
    }

    // Add days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const currentDate = new Date(year, month, day);
      currentDate.setHours(0, 0, 0, 0);

      const isDueDate = dueDate ? currentDate.getTime() === dueDate.getTime() : false;

      days.push({
        date: currentDate,
        hasMealPlan: currentDate <= today && Math.random() > 0.3, // Demo data
        hasWorkout: currentDate <= today && Math.random() > 0.5,
        supplementsTaken: currentDate <= today && Math.random() > 0.3,
        hydrationComplete: currentDate <= today && Math.random() > 0.4,
        isToday: currentDate.getTime() === today.getTime(),
        isPast: currentDate < today,
        isFuture: currentDate > today,
        isCurrentMonth: true,
        isDueDate,
        pregnancyWeek: getPregnancyWeekForDate(currentDate),
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
        hydrationComplete: false,
        isToday: false,
        isPast: false,
        isFuture: true,
        isCurrentMonth: false,
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

  const getCompletionScore = (day: DayData): number => {
    if (!day.isPast || !day.isCurrentMonth) return 0;
    let score = 0;
    if (day.hasMealPlan) score += 25;
    if (day.hasWorkout) score += 25;
    if (day.supplementsTaken) score += 25;
    if (day.hydrationComplete) score += 25;
    return score;
  };

  const dueDateInfo = getDueDateInfo();
  const days = getDaysInMonth(currentMonth);
  const currentWeek = getCurrentPregnancyWeek();
  const trimester = getTrimester(currentWeek);
  const babySize = babySizeByWeek[currentWeek] || babySizeByWeek[Math.floor(currentWeek / 2) * 2] || { size: 'growing!', emoji: '👶' };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <Heart className="w-12 h-12 text-pink-500 mx-auto animate-pulse" fill="#ec4899" />
          <p className="mt-4 text-gray-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

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
        {/* Pregnancy Progress Card */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-5 text-white mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-purple-100 text-sm">Week {currentWeek} • Trimester {trimester}</p>
              <p className="text-xl font-bold mt-1">
                Baby is the size of a {babySize.size}! {babySize.emoji}
              </p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <Baby className="w-7 h-7" />
            </div>
          </div>

          {/* Progress to due date */}
          {dueDateInfo && (
            <div className="bg-white/20 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-purple-100">Progress to due date</span>
                <span className="text-sm font-medium">
                  {dueDateInfo.daysRemaining > 0 ? `${dueDateInfo.daysRemaining} days left` : 'Due any day!'}
                </span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${Math.min(100, Math.max(0, ((40 * 7 - dueDateInfo.daysRemaining) / (40 * 7)) * 100))}%` }}
                />
              </div>
              <p className="text-xs text-purple-100 mt-2 text-center">
                Due: {dueDateInfo.dueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          )}
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
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
              const completionScore = getCompletionScore(day);

              return (
                <button
                  key={i}
                  onClick={() => day.isCurrentMonth && setSelectedDate(day.date)}
                  disabled={!day.isCurrentMonth}
                  className={`relative aspect-square p-1 rounded-lg transition-colors ${
                    !day.isCurrentMonth
                      ? 'text-gray-300'
                      : day.isDueDate
                      ? 'bg-pink-500 text-white ring-2 ring-pink-300'
                      : day.isToday
                      ? 'bg-purple-500 text-white'
                      : selectedDate?.toDateString() === day.date.toDateString()
                      ? 'bg-purple-100 text-purple-700'
                      : day.isPast
                      ? 'text-gray-600 hover:bg-gray-50'
                      : 'text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-sm font-medium">{day.date.getDate()}</span>

                  {/* Due date star */}
                  {day.isDueDate && (
                    <Star className="absolute top-0.5 right-0.5 w-3 h-3 text-yellow-300" fill="currentColor" />
                  )}

                  {/* Activity Indicators */}
                  {day.isCurrentMonth && day.isPast && !day.isDueDate && !day.isToday && (
                    <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                      {day.hasMealPlan && (
                        <div className="w-1.5 h-1.5 bg-pink-400 rounded-full" title="Meal Plan" />
                      )}
                      {day.hasWorkout && (
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" title="Workout" />
                      )}
                      {day.supplementsTaken && (
                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" title="Supplements" />
                      )}
                      {day.hydrationComplete && (
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" title="Hydration" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-gray-100 flex-wrap">
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
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-blue-400 rounded-full" />
              <span className="text-xs text-gray-500">Hydration</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-3 h-3 text-pink-500" fill="currentColor" />
              <span className="text-xs text-gray-500">Due Date</span>
            </div>
          </div>
        </div>

        {/* Selected Date Details */}
        {selectedDate && (
          <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </h3>
              {getPregnancyWeekForDate(selectedDate) && (
                <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  Week {getPregnancyWeekForDate(selectedDate)}
                </span>
              )}
            </div>

            <div className="space-y-3">
              <Link
                href={`/dashboard/meals`}
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
                href={`/dashboard/workouts`}
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

              <Link
                href="/dashboard/supplements"
                className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
              >
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Pill className="w-5 h-5 text-orange-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Supplements</p>
                  <p className="text-sm text-gray-500">Track daily intake</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>

              <Link
                href="/dashboard/grocery"
                className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Grocery List</p>
                  <p className="text-sm text-gray-500">Weekly shopping list</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            </div>
          </div>
        )}

        {/* Week Highlight */}
        {weekHighlights[currentWeek] && (
          <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">
                {weekHighlights[currentWeek].emoji}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Week {currentWeek} Milestone</h3>
                <p className="text-lg font-medium text-purple-600">{weekHighlights[currentWeek].title}</p>
                <p className="text-sm text-gray-500 mt-1">{weekHighlights[currentWeek].description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Milestones */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Upcoming Milestones</h3>
          <div className="space-y-3">
            {Object.entries(weekHighlights)
              .filter(([week]) => parseInt(week) > currentWeek)
              .slice(0, 3)
              .map(([week, milestone]) => (
                <div key={week} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">{milestone.emoji}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{milestone.title}</p>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                        Week {week}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{milestone.description}</p>
                  </div>
                </div>
              ))}

            {/* Due Date */}
            {dueDateInfo && (
              <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-xl">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Baby className="w-5 h-5 text-pink-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Due Date</p>
                  <p className="text-sm text-gray-500">
                    {dueDateInfo.dueDate.toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                    {dueDateInfo.daysRemaining > 0 && ` (${dueDateInfo.daysRemaining} days)`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
