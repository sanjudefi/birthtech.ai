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
  Clock,
  RefreshCw,
  Coffee,
  Sun,
  Moon,
  Apple,
} from 'lucide-react';

interface MealPlan {
  breakfast: {
    name: string;
    description: string;
    benefits: string;
    prepTime: string;
  };
  lunch: {
    name: string;
    description: string;
    benefits: string;
    prepTime: string;
  };
  dinner: {
    name: string;
    description: string;
    benefits: string;
    prepTime: string;
  };
  snacks: Array<{ name: string; benefits: string }>;
  hydrationReminder: string;
  nutritionTip: string;
}

function MealsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // Check if we should auto-generate
    if (searchParams.get('generate') === 'true') {
      generateMealPlan(token);
    } else {
      // Try to fetch existing plan
      fetchTodaysPlan(token);
    }
  }, [router, searchParams]);

  const fetchTodaysPlan = async (token: string) => {
    try {
      // For now, just set initial loading to false
      // In production, we'd fetch from dailyPlan API
      setInitialLoading(false);
    } catch (error) {
      console.error('Error fetching plan:', error);
      setInitialLoading(false);
    }
  };

  const generateMealPlan = async (token?: string) => {
    const authToken = token || localStorage.getItem('token');
    if (!authToken) return;

    setLoading(true);
    try {
      const res = await fetch('/api/ai/meal-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.mealPlan) {
        setMealPlan(data.mealPlan);
      } else {
        throw new Error(data.error || 'Failed to generate meal plan');
      }
    } catch (error: any) {
      console.error('Error generating meal plan:', error);
      alert('Failed to generate meal plan. Please try again.');
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <Heart className="w-12 h-12 text-pink-500 mx-auto animate-pulse" fill="#ec4899" />
          <p className="mt-4 text-gray-600">Loading meal planner...</p>
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
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">Meal Planner</h1>
              <p className="text-xs text-gray-500">AI-powered nutrition</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Generate Button */}
        {!mealPlan && !loading && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Utensils className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Ready for Today's Meals?</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Get a personalized meal plan based on your pregnancy stage, diet preferences, and nutritional needs.
            </p>
            <button
              onClick={() => generateMealPlan()}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow flex items-center gap-2 mx-auto"
            >
              <Sparkles className="w-5 h-5" />
              Generate My Meal Plan
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 text-pink-500 mx-auto animate-spin" />
            <p className="mt-4 text-gray-600">Creating your personalized meal plan...</p>
            <p className="text-sm text-gray-400 mt-2">This may take a moment</p>
          </div>
        )}

        {/* Meal Plan Display */}
        {mealPlan && !loading && (
          <div className="space-y-6">
            {/* Regenerate Button */}
            <div className="flex justify-end">
              <button
                onClick={() => generateMealPlan()}
                className="flex items-center gap-2 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </button>
            </div>

            {/* Breakfast */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Coffee className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Breakfast</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {mealPlan.breakfast.prepTime}
                  </p>
                </div>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">{mealPlan.breakfast.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{mealPlan.breakfast.description}</p>
              <div className="bg-green-50 text-green-700 text-sm px-3 py-2 rounded-lg">
                <strong>Benefits:</strong> {mealPlan.breakfast.benefits}
              </div>
            </div>

            {/* Lunch */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Sun className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Lunch</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {mealPlan.lunch.prepTime}
                  </p>
                </div>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">{mealPlan.lunch.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{mealPlan.lunch.description}</p>
              <div className="bg-green-50 text-green-700 text-sm px-3 py-2 rounded-lg">
                <strong>Benefits:</strong> {mealPlan.lunch.benefits}
              </div>
            </div>

            {/* Dinner */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Moon className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Dinner</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {mealPlan.dinner.prepTime}
                  </p>
                </div>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">{mealPlan.dinner.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{mealPlan.dinner.description}</p>
              <div className="bg-green-50 text-green-700 text-sm px-3 py-2 rounded-lg">
                <strong>Benefits:</strong> {mealPlan.dinner.benefits}
              </div>
            </div>

            {/* Snacks */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                  <Apple className="w-5 h-5 text-pink-500" />
                </div>
                <h3 className="font-semibold text-gray-900">Snacks</h3>
              </div>
              <div className="space-y-3">
                {mealPlan.snacks.map((snack, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-pink-600 font-medium">{i + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{snack.name}</p>
                      <p className="text-xs text-gray-500">{snack.benefits}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-5 text-white">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Nutrition Tip
              </h3>
              <p className="text-sm text-purple-100 mb-4">{mealPlan.nutritionTip}</p>
              <p className="text-sm">
                <strong>Hydration:</strong> {mealPlan.hydrationReminder}
              </p>
            </div>

            {/* Disclaimer */}
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500">
                This meal plan is generated based on your profile. Always consult your healthcare provider
                for specific dietary needs or concerns.
              </p>
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
