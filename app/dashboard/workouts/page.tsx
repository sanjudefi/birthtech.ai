'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ArrowLeft,
  Dumbbell,
  Loader2,
  Sparkles,
  Clock,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Play,
  Pause,
  X,
  Flame,
  Timer,
  Target,
  Zap,
  Moon,
  Sun,
  Footprints,
  Wind,
  Waves,
  History,
  Eye,
} from 'lucide-react';

interface Exercise {
  name: string;
  duration: string;
  reps?: string;
  instructions: string;
  modification?: string;
  icon?: string;
}

interface DayWorkout {
  type: string;
  duration: string;
  calories?: string;
  warmup?: Exercise[];
  main?: Exercise[];
  cooldown?: Exercise[];
  exercises?: Exercise[];
  focus?: string;
  isRestDay?: boolean;
  restDay?: boolean;
}

interface WeeklyWorkoutPlan {
  [key: string]: DayWorkout | number | string | string[] | undefined;
  monday?: DayWorkout;
  tuesday?: DayWorkout;
  wednesday?: DayWorkout;
  thursday?: DayWorkout;
  friday?: DayWorkout;
  saturday?: DayWorkout;
  sunday?: DayWorkout;
  weekNumber?: number;
  weeklyGoal?: string;
  safetyReminders?: string[];
}

interface WeeklyPlanRecord {
  id: string;
  weekStart: string;
  weekEnd: string;
  workouts: any;
  createdAt: string;
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS: Record<string, string> = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun',
};

const WORKOUT_TYPES: Record<string, { icon: any; color: string; bgColor: string; label: string }> = {
  strength: { icon: Dumbbell, color: 'text-purple-600', bgColor: 'bg-purple-100', label: 'Strength' },
  cardio: { icon: Flame, color: 'text-orange-600', bgColor: 'bg-orange-100', label: 'Cardio' },
  flexibility: { icon: Wind, color: 'text-teal-600', bgColor: 'bg-teal-100', label: 'Flexibility' },
  prenatal_yoga: { icon: Waves, color: 'text-indigo-600', bgColor: 'bg-indigo-100', label: 'Prenatal Yoga' },
  walking: { icon: Footprints, color: 'text-green-600', bgColor: 'bg-green-100', label: 'Walking' },
  rest: { icon: Moon, color: 'text-gray-600', bgColor: 'bg-gray-100', label: 'Rest Day' },
  'Rest Day': { icon: Moon, color: 'text-gray-600', bgColor: 'bg-gray-100', label: 'Rest Day' },
};

export default function WorkoutsPage() {
  const router = useRouter();
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyWorkoutPlan | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [history, setHistory] = useState<WeeklyPlanRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchProfile(token);
    fetchHistory(token);
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

  const fetchHistory = async (token: string) => {
    try {
      const res = await fetch('/api/ai/weekly-workout', {
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
        if (currentPlan?.workouts) {
          loadPlanFromRecord(currentPlan);
        }
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const getWeekStart = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const loadPlanFromRecord = (record: WeeklyPlanRecord) => {
    setCurrentPlanId(record.id);
    setWeeklyPlan(record.workouts);
    setShowHistory(false);
  };

  const generateWeeklyWorkout = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch('/api/ai/weekly-workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.plan) {
        loadPlanFromRecord(data.plan);
        fetchHistory(token);
      } else {
        generateSampleWorkout();
      }
    } catch (error: any) {
      console.error('Error generating workout:', error);
      generateSampleWorkout();
    } finally {
      setLoading(false);
    }
  };

  const generateSampleWorkout = () => {
    const samplePlan: WeeklyWorkoutPlan = {
      monday: {
        type: 'prenatal_yoga',
        duration: '30 min',
        calories: '150',
        focus: 'Flexibility & Relaxation',
        exercises: [
          { name: 'Cat-Cow Stretch', duration: '3 min', instructions: 'On all fours, alternate between arching and rounding your back', modification: 'Use a pillow under knees for comfort' },
          { name: 'Modified Child\'s Pose', duration: '2 min', instructions: 'Kneel with knees wide apart, stretch arms forward', modification: 'Keep knees wide to accommodate belly' },
          { name: 'Butterfly Stretch', duration: '3 min', instructions: 'Sit with soles of feet together, gently press knees down' },
        ],
      },
      tuesday: {
        type: 'walking',
        duration: '25 min',
        calories: '120',
        focus: 'Light Cardio',
        exercises: [
          { name: 'Brisk Walk', duration: '15 min', instructions: 'Maintain a pace where you can still hold a conversation' },
          { name: 'Cool Down Walk', duration: '5 min', instructions: 'Gradually slow your pace' },
        ],
      },
      wednesday: {
        type: 'strength',
        duration: '25 min',
        calories: '130',
        focus: 'Upper Body & Core',
        exercises: [
          { name: 'Wall Push-ups', reps: '2 sets of 10', duration: '3 min', instructions: 'Stand arm\'s length from wall', modification: 'Step closer to wall to make easier' },
          { name: 'Bird Dog', reps: '10 each side', duration: '4 min', instructions: 'On all fours, extend opposite arm and leg' },
        ],
      },
      thursday: {
        type: 'rest',
        duration: '0 min',
        focus: 'Recovery & Self-Care',
        restDay: true,
        exercises: [],
      },
      friday: {
        type: 'cardio',
        duration: '20 min',
        calories: '100',
        focus: 'Low-Impact Cardio',
        exercises: [
          { name: 'Side Steps', duration: '3 min', instructions: 'Step side to side with arm movements' },
          { name: 'Gentle Squats', reps: '2 sets of 10', duration: '4 min', instructions: 'Feet wide, squat to comfortable depth' },
        ],
      },
      saturday: {
        type: 'flexibility',
        duration: '25 min',
        calories: '80',
        focus: 'Full Body Stretch',
        exercises: [
          { name: 'Neck & Shoulder Release', duration: '4 min', instructions: 'Ear to shoulder stretches, shoulder rolls' },
          { name: 'Hip Flexor Stretch', duration: '4 min', instructions: 'Lunge position with back knee down' },
        ],
      },
      sunday: {
        type: 'rest',
        duration: '0 min',
        focus: 'Rest & Rejuvenation',
        restDay: true,
        exercises: [],
      },
    };
    setWeeklyPlan(samplePlan);
  };

  const getWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + weekOffset * 7);

    return DAYS.map((_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return {
        day: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        isToday: date.toDateString() === new Date().toDateString(),
      };
    });
  };

  const getWeekRange = () => {
    const dates = getWeekDates();
    return `${dates[0].month} ${dates[0].day} - ${dates[6].month} ${dates[6].day}`;
  };

  const toggleExercise = (day: string, index: number) => {
    const key = `${day}-${index}`;
    setCompletedExercises((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const getDayProgress = (day: string) => {
    if (!weeklyPlan || !weeklyPlan[day]) return 0;
    const workout = weeklyPlan[day] as DayWorkout;
    if (workout.restDay || workout.isRestDay) return 100;

    const exercises = workout.exercises || [];
    if (exercises.length === 0) return 0;

    let completed = 0;
    exercises.forEach((_, i) => {
      if (completedExercises.has(`${day}-${i}`)) completed++;
    });

    return Math.round((completed / exercises.length) * 100);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const weekDates = getWeekDates();
  const selectedWorkout = selectedDay && weeklyPlan ? weeklyPlan[selectedDay] as DayWorkout | undefined : null;

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <Heart className="w-12 h-12 text-pink-500 mx-auto animate-pulse" fill="#ec4899" />
          <p className="mt-4 text-gray-600">Loading workout plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">Weekly Workouts</h1>
                <p className="text-xs text-gray-500">Safe pregnancy exercises</p>
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
                onClick={generateWeeklyWorkout}
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

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Week Navigation */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setWeekOffset(weekOffset - 1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              <span className="font-medium text-gray-900">{getWeekRange()}</span>
              {weekOffset === 0 && (
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  This Week
                </span>
              )}
            </div>
            <button
              onClick={() => setWeekOffset(weekOffset + 1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Generate Button */}
        {!weeklyPlan && !loading && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Dumbbell className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Weekly Workout Plan</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Get a safe, personalized workout routine for each day, designed for month {profile?.pregnancyMonth || 6} of pregnancy.
            </p>
            <button
              onClick={generateWeeklyWorkout}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow flex items-center gap-2 mx-auto"
            >
              <Sparkles className="w-5 h-5" />
              Generate Weekly Plan
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
            <Loader2 className="w-12 h-12 text-purple-500 mx-auto animate-spin" />
            <p className="mt-4 text-gray-600">Creating your weekly workout plan...</p>
            <p className="text-sm text-gray-400 mt-2">This may take a moment</p>
          </div>
        )}

        {/* Weekly Grid */}
        {weeklyPlan && !loading && (
          <>
            {/* Desktop Grid */}
            <div className="hidden md:grid grid-cols-7 gap-3 mb-6">
              {DAYS.map((day, index) => {
                const workout = weeklyPlan[day] as DayWorkout | undefined;
                const dateInfo = weekDates[index];
                const typeInfo = workout ? WORKOUT_TYPES[workout.type] || WORKOUT_TYPES.rest : WORKOUT_TYPES.rest;
                const Icon = typeInfo.icon;
                const progress = getDayProgress(day);
                const isRestDay = workout?.restDay || workout?.isRestDay;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all ${
                      selectedDay === day ? 'ring-2 ring-purple-500' : ''
                    } ${dateInfo.isToday ? 'ring-2 ring-pink-400' : ''}`}
                  >
                    <div className="text-center mb-3">
                      <p className="text-xs text-gray-500 uppercase">{DAY_LABELS[day]}</p>
                      <p className={`text-lg font-bold ${dateInfo.isToday ? 'text-pink-500' : 'text-gray-900'}`}>
                        {dateInfo.day}
                      </p>
                    </div>

                    <div className={`w-12 h-12 rounded-xl ${typeInfo.bgColor} flex items-center justify-center mx-auto mb-2`}>
                      <Icon className={`w-6 h-6 ${typeInfo.color}`} />
                    </div>
                    <p className="text-sm font-medium text-gray-900 text-center">{typeInfo.label}</p>

                    {workout && !isRestDay && (
                      <>
                        <p className="text-xs text-gray-500 text-center mt-1">{workout.duration}</p>
                        <div className="mt-3">
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          {progress > 0 && (
                            <p className="text-xs text-center text-purple-600 mt-1">{progress}%</p>
                          )}
                        </div>
                      </>
                    )}
                    {isRestDay && (
                      <p className="text-xs text-gray-400 text-center mt-1">Rest & recover</p>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {DAYS.map((day, index) => {
                const workout = weeklyPlan[day] as DayWorkout | undefined;
                const dateInfo = weekDates[index];
                const typeInfo = workout ? WORKOUT_TYPES[workout.type] || WORKOUT_TYPES.rest : WORKOUT_TYPES.rest;
                const Icon = typeInfo.icon;
                const progress = getDayProgress(day);
                const isRestDay = workout?.restDay || workout?.isRestDay;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`w-full bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 ${
                      dateInfo.isToday ? 'ring-2 ring-pink-400' : ''
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center ${
                      dateInfo.isToday ? 'bg-pink-100' : 'bg-gray-100'
                    }`}>
                      <p className="text-xs text-gray-500 uppercase">{DAY_LABELS[day]}</p>
                      <p className={`text-lg font-bold ${dateInfo.isToday ? 'text-pink-500' : 'text-gray-900'}`}>
                        {dateInfo.day}
                      </p>
                    </div>

                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg ${typeInfo.bgColor} flex items-center justify-center`}>
                          <Icon className={`w-4 h-4 ${typeInfo.color}`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{typeInfo.label}</p>
                          <p className="text-xs text-gray-500">
                            {isRestDay ? 'Rest & recover' : workout?.duration}
                          </p>
                        </div>
                      </div>
                      {workout && !isRestDay && progress > 0 && (
                        <div className="mt-2">
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                );
              })}
            </div>

            {/* Safety Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">Safety First</p>
                <p className="text-sm text-amber-700 mt-1">
                  Always listen to your body. Stop if you feel pain, dizziness, or shortness of breath.
                  Stay hydrated and avoid overheating.
                </p>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Workout Detail Modal */}
      {selectedDay && selectedWorkout && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                {(() => {
                  const typeInfo = WORKOUT_TYPES[selectedWorkout.type] || WORKOUT_TYPES.rest;
                  const Icon = typeInfo.icon;
                  return (
                    <>
                      <div className={`w-10 h-10 rounded-xl ${typeInfo.bgColor} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${typeInfo.color}`} />
                      </div>
                      <div>
                        <h2 className="font-semibold text-gray-900">
                          {DAY_LABELS[selectedDay]} - {typeInfo.label}
                        </h2>
                        <p className="text-sm text-gray-500">{selectedWorkout.focus}</p>
                      </div>
                    </>
                  );
                })()}
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-4">
              {(selectedWorkout.restDay || selectedWorkout.isRestDay) ? (
                <div className="text-center py-8">
                  <Moon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Rest Day</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Your body needs rest to recover. Take it easy today!
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-center gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-1">
                        <Timer className="w-6 h-6 text-purple-600" />
                      </div>
                      <p className="text-sm text-gray-600">{selectedWorkout.duration}</p>
                    </div>
                    {selectedWorkout.calories && (
                      <div className="text-center">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-1">
                          <Flame className="w-6 h-6 text-orange-600" />
                        </div>
                        <p className="text-sm text-gray-600">~{selectedWorkout.calories} cal</p>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-1">
                        <Target className="w-6 h-6 text-green-600" />
                      </div>
                      <p className="text-sm text-gray-600">{getDayProgress(selectedDay)}% done</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Exercises</h3>
                    <div className="space-y-2">
                      {(selectedWorkout.exercises || []).map((exercise, i) => (
                        <button
                          key={i}
                          onClick={() => toggleExercise(selectedDay, i)}
                          className={`w-full p-3 rounded-xl border transition-colors text-left ${
                            completedExercises.has(`${selectedDay}-${i}`)
                              ? 'bg-green-50 border-green-200'
                              : 'bg-gray-50 border-gray-100 hover:border-purple-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-900">{exercise.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">
                                {exercise.reps || exercise.duration}
                              </span>
                              {completedExercises.has(`${selectedDay}-${i}`) && (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{exercise.instructions}</p>
                          {exercise.modification && (
                            <p className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded mt-2 inline-block">
                              Modification: {exercise.modification}
                            </p>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-4 text-white text-center">
                    <Sparkles className="w-6 h-6 mx-auto mb-2" />
                    <p>You're doing amazing! Every movement counts for you and baby.</p>
                  </div>
                </div>
              )}
            </div>
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
                <h3 className="font-semibold text-gray-900">Workout Plan History</h3>
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
                <p className="text-center text-gray-500 py-8">No workout plans generated yet</p>
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
    </div>
  );
}
