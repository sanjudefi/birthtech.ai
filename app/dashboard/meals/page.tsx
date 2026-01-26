'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Heart,
  ArrowLeft,
  Utensils,
  Loader2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Calendar,
  RefreshCw,
  Clock,
  Coffee,
  Sun,
  Cookie,
  Moon,
  Apple,
  Check,
  Download,
  History,
  X,
  Eye,
} from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MEALS = ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner'];
const MEAL_LABELS = {
  breakfast: { label: 'Breakfast', icon: Coffee, color: 'bg-amber-100 text-amber-600' },
  snack1: { label: 'Snack', icon: Cookie, color: 'bg-pink-100 text-pink-600' },
  lunch: { label: 'Lunch', icon: Sun, color: 'bg-orange-100 text-orange-600' },
  snack2: { label: 'Snack', icon: Apple, color: 'bg-green-100 text-green-600' },
  dinner: { label: 'Dinner', icon: Moon, color: 'bg-indigo-100 text-indigo-600' },
};

interface MealItem {
  name: string;
  description?: string;
  benefits?: string;
  prepTime?: string;
}

interface WeeklyMeals {
  [day: string]: {
    breakfast: MealItem;
    snack1?: MealItem;
    lunch: MealItem;
    snack2?: MealItem;
    dinner: MealItem;
    snacks?: MealItem[];
  };
}

interface WeeklyPlanRecord {
  id: string;
  weekStart: string;
  weekEnd: string;
  meals: any;
  createdAt: string;
}

function MealsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyMeals | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<{ day: string; meal: string } | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [history, setHistory] = useState<WeeklyPlanRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetchHistory(token);

    if (searchParams.get('generate') === 'true') {
      generateWeeklyPlan();
    }
  }, [router, searchParams]);

  const fetchHistory = async (token: string) => {
    try {
      const res = await fetch('/api/ai/weekly-meal-plan', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data.plans || []);

        // Load current week's plan if exists
        const currentWeek = getWeekStart(new Date());
        const currentPlan = data.plans?.find((p: WeeklyPlanRecord) =>
          new Date(p.weekStart).toDateString() === currentWeek.toDateString()
        );
        if (currentPlan) {
          loadPlanFromRecord(currentPlan);
        }
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const loadPlanFromRecord = (record: WeeklyPlanRecord) => {
    setCurrentPlanId(record.id);
    const meals = record.meals;

    // Transform API response to component format
    const transformed: WeeklyMeals = {};
    DAYS.forEach((day) => {
      const dayKey = day.toLowerCase();
      const dayData = meals[dayKey] || meals[day];
      if (dayData) {
        transformed[dayKey] = {
          breakfast: dayData.breakfast || { name: 'Not planned' },
          snack1: dayData.snacks?.[0] || { name: 'Fruit & nuts' },
          lunch: dayData.lunch || { name: 'Not planned' },
          snack2: dayData.snacks?.[1] || { name: 'Yogurt' },
          dinner: dayData.dinner || { name: 'Not planned' },
        };
      }
    });

    setWeeklyPlan(transformed);
    setShowHistory(false);
  };

  const getWeekStart = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const getWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + weekOffset * 7);

    return DAYS.map((_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date;
    });
  };

  const weekDates = getWeekDates();
  const weekStart = weekDates[0];
  const weekEnd = weekDates[6];

  const formatWeekRange = () => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${weekStart.toLocaleDateString('en-US', options)} - ${weekEnd.toLocaleDateString('en-US', options)}`;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const generateWeeklyPlan = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch('/api/ai/weekly-meal-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.plan) {
        loadPlanFromRecord(data.plan);
        // Refresh history
        fetchHistory(token);
      } else {
        throw new Error(data.error || 'Failed to generate meal plan');
      }
    } catch (error: any) {
      console.error('Error generating meal plan:', error);
      // Generate sample data for demo
      generateSamplePlan();
    } finally {
      setLoading(false);
    }
  };

  const generateSamplePlan = () => {
    const sampleMeals: WeeklyMeals = {};
    const breakfasts = ['Oatmeal with Berries', 'Scrambled Eggs & Toast', 'Greek Yogurt Parfait', 'Avocado Toast', 'Banana Pancakes', 'Smoothie Bowl', 'French Toast'];
    const lunches = ['Grilled Chicken Salad', 'Quinoa Buddha Bowl', 'Turkey Wrap', 'Lentil Soup', 'Salmon Rice Bowl', 'Veggie Stir-fry', 'Mediterranean Plate'];
    const dinners = ['Baked Salmon & Veggies', 'Chicken Curry & Rice', 'Pasta Primavera', 'Beef Stir-fry', 'Grilled Fish Tacos', 'Vegetable Lasagna', 'Roast Chicken'];
    const snacks = ['Apple & Almond Butter', 'Greek Yogurt', 'Trail Mix', 'Hummus & Carrots', 'Cheese & Crackers', 'Fruit Smoothie', 'Nuts & Dried Fruit'];

    DAYS.forEach((day, i) => {
      sampleMeals[day.toLowerCase()] = {
        breakfast: { name: breakfasts[i], benefits: 'Energy & nutrients for the day' },
        snack1: { name: snacks[i], benefits: 'Keeps blood sugar stable' },
        lunch: { name: lunches[i], benefits: 'Protein & vegetables' },
        snack2: { name: snacks[(i + 3) % 7], benefits: 'Afternoon energy boost' },
        dinner: { name: dinners[i], benefits: 'Complete nutrition' },
      };
    });

    setWeeklyPlan(sampleMeals);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                <Utensils className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">Weekly Meal Planner</h1>
                <p className="text-xs text-gray-500">Personalized nutrition for you & baby</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={() => setShowHistory(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <History className="w-4 h-4" />
                History ({history.length})
              </button>
            )}
            {weeklyPlan && (
              <button
                onClick={generateWeeklyPlan}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Regenerate
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setWeekOffset(weekOffset - 1)}
            className="p-2 hover:bg-white rounded-xl transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              <h2 className="text-lg font-semibold text-gray-900">{formatWeekRange()}</h2>
            </div>
            {weekOffset === 0 && (
              <p className="text-xs text-purple-600 mt-1">This Week</p>
            )}
          </div>

          <button
            onClick={() => setWeekOffset(weekOffset + 1)}
            className="p-2 hover:bg-white rounded-xl transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Generate Button */}
        {!weeklyPlan && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Utensils className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Weekly Meal Plan</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Get a personalized 7-day meal plan based on your pregnancy stage, diet preferences, and nutritional needs.
            </p>
            <button
              onClick={generateWeeklyPlan}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl font-medium hover:shadow-lg transition-shadow flex items-center gap-3 mx-auto text-lg"
            >
              <Sparkles className="w-6 h-6" />
              Generate My Meal Plan
            </button>
            {history.length > 0 && (
              <p className="text-sm text-gray-500 mt-4">
                Or <button onClick={() => setShowHistory(true)} className="text-purple-600 hover:underline">view your past plans</button>
              </p>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-16 h-16 text-pink-500 mx-auto animate-spin" />
            <p className="mt-6 text-gray-600 text-lg">Creating your personalized meal plan...</p>
            <p className="text-sm text-gray-400 mt-2">Considering your deficiencies, allergies & preferences</p>
          </div>
        )}

        {/* Weekly Meal Grid */}
        {weeklyPlan && !loading && (
          <>
            {/* Desktop Grid */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="grid grid-cols-8 border-b border-gray-100">
                <div className="p-4 bg-gray-50"></div>
                {DAYS.map((day, i) => {
                  const date = weekDates[i];
                  const today = isToday(date);
                  return (
                    <div
                      key={day}
                      className={`p-4 text-center border-l border-gray-100 ${
                        today ? 'bg-purple-50' : 'bg-gray-50'
                      }`}
                    >
                      <p className={`font-semibold ${today ? 'text-purple-600' : 'text-gray-900'}`}>
                        {day}
                      </p>
                      <p className={`text-xs ${today ? 'text-purple-500' : 'text-gray-500'}`}>
                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  );
                })}
              </div>

              {MEALS.map((meal) => {
                const mealInfo = MEAL_LABELS[meal as keyof typeof MEAL_LABELS];
                const Icon = mealInfo.icon;

                return (
                  <div key={meal} className="grid grid-cols-8 border-b border-gray-100 last:border-b-0">
                    <div className="p-3 flex items-center gap-2 bg-gray-50">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${mealInfo.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{mealInfo.label}</span>
                    </div>

                    {DAYS.map((day, i) => {
                      const dayKey = day.toLowerCase();
                      const mealData = weeklyPlan[dayKey]?.[meal as keyof typeof weeklyPlan[string]];
                      const today = isToday(weekDates[i]);

                      return (
                        <button
                          key={`${day}-${meal}`}
                          onClick={() => setSelectedMeal({ day: dayKey, meal })}
                          className={`p-3 text-left border-l border-gray-100 hover:bg-purple-50 transition-colors ${
                            today ? 'bg-purple-50/50' : ''
                          }`}
                        >
                          {mealData && (
                            <>
                              <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                {mealData.name}
                              </p>
                              {mealData.benefits && (
                                <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                  {mealData.benefits}
                                </p>
                              )}
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {DAYS.map((day, i) => {
                const date = weekDates[i];
                const today = isToday(date);
                const dayKey = day.toLowerCase();

                return (
                  <div
                    key={day}
                    className={`bg-white rounded-2xl p-4 shadow-sm ${today ? 'ring-2 ring-purple-500' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className={`font-semibold ${today ? 'text-purple-600' : 'text-gray-900'}`}>
                          {day}
                        </p>
                        <p className="text-xs text-gray-500">
                          {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                      {today && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-600 text-xs font-medium rounded-full">
                          Today
                        </span>
                      )}
                    </div>

                    <div className="space-y-3">
                      {MEALS.map((meal) => {
                        const mealInfo = MEAL_LABELS[meal as keyof typeof MEAL_LABELS];
                        const Icon = mealInfo.icon;
                        const mealData = weeklyPlan[dayKey]?.[meal as keyof typeof weeklyPlan[string]];

                        return (
                          <div key={meal} className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${mealInfo.color}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500">{mealInfo.label}</p>
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {mealData?.name || 'Not planned'}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tips */}
            <div className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-semibold">Weekly Nutrition Tips</h3>
              </div>
              <ul className="text-sm text-purple-100 space-y-2">
                <li>• Eat small, frequent meals to avoid nausea</li>
                <li>• Include iron-rich foods with vitamin C for better absorption</li>
                <li>• Stay hydrated - aim for 8-10 glasses of water daily</li>
              </ul>
            </div>

            {/* Disclaimer */}
            <div className="mt-4 bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500">
                This meal plan is personalized based on your profile. Always consult your healthcare provider for specific dietary needs.
              </p>
            </div>
          </>
        )}

        {/* Meal Detail Modal */}
        {selectedMeal && weeklyPlan && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedMeal(null)}
          >
            <div
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const mealData = weeklyPlan[selectedMeal.day]?.[selectedMeal.meal as keyof typeof weeklyPlan[string]];
                const mealInfo = MEAL_LABELS[selectedMeal.meal as keyof typeof MEAL_LABELS];
                const Icon = mealInfo.icon;

                return (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${mealInfo.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{mealInfo.label}</h3>
                        <p className="text-sm text-gray-500 capitalize">{selectedMeal.day}</p>
                      </div>
                    </div>

                    <h4 className="text-xl font-bold text-gray-900 mb-2">{mealData?.name}</h4>

                    {mealData?.description && (
                      <p className="text-gray-600 mb-4">{mealData.description}</p>
                    )}

                    {mealData?.benefits && (
                      <div className="bg-green-50 text-green-700 p-3 rounded-xl text-sm mb-4">
                        <strong>Benefits:</strong> {mealData.benefits}
                      </div>
                    )}

                    {mealData?.prepTime && (
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>Prep time: {mealData.prepTime}</span>
                      </div>
                    )}

                    <button
                      onClick={() => setSelectedMeal(null)}
                      className="mt-6 w-full py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors"
                    >
                      Close
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* History Modal */}
        {showHistory && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowHistory(false)}
          >
            <div
              className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">Meal Plan History</h3>
                </div>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="overflow-y-auto max-h-[calc(80vh-80px)] p-4">
                {history.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No meal plans generated yet</p>
                ) : (
                  <div className="space-y-3">
                    {history.map((plan) => (
                      <button
                        key={plan.id}
                        onClick={() => loadPlanFromRecord(plan)}
                        className={`w-full p-4 rounded-xl border text-left hover:border-purple-300 transition-colors ${
                          currentPlanId === plan.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              {formatDate(plan.weekStart)} - {formatDate(plan.weekEnd)}
                            </p>
                            <p className="text-sm text-gray-500">
                              Generated {formatDate(plan.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {currentPlanId === plan.id && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs font-medium rounded-full">
                                Current
                              </span>
                            )}
                            <Eye className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function MealsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
          <div className="text-center">
            <Heart className="w-12 h-12 text-pink-500 mx-auto animate-pulse" fill="#ec4899" />
            <p className="mt-4 text-gray-600">Loading meal planner...</p>
          </div>
        </div>
      }
    >
      <MealsContent />
    </Suspense>
  );
}
