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
  type: string; // strength, cardio, flexibility, rest, prenatal_yoga
  duration: string;
  calories?: string;
  warmup: Exercise[];
  main: Exercise[];
  cooldown: Exercise[];
  focus: string;
  isRestDay?: boolean;
}

interface WeeklyWorkoutPlan {
  [key: string]: DayWorkout;
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
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchProfile(token);
    fetchWeeklyWorkout(token);
  }, [router, weekOffset]);

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

  const fetchWeeklyWorkout = async (token: string) => {
    try {
      const res = await fetch(`/api/ai/workout?weekOffset=${weekOffset}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.weeklyPlan) {
          setWeeklyPlan(data.weeklyPlan);
        }
      }
    } catch (error) {
      console.error('Error fetching weekly workout:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const generateWeeklyWorkout = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch('/api/ai/workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ weekOffset, type: 'weekly' }),
      });

      const data = await res.json();

      if (res.ok && data.weeklyPlan) {
        setWeeklyPlan(data.weeklyPlan);
      } else {
        // Generate sample data
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
    const exerciseLevel = profile?.exerciseLevel || 'moderate';
    const pregnancyMonth = profile?.pregnancyMonth || 6;

    // Adjust intensity based on trimester and exercise level
    const isThirdTrimester = pregnancyMonth >= 7;
    const baseIntensity = exerciseLevel === 'none' ? 'gentle' : exerciseLevel === 'light' ? 'light' : 'moderate';

    const samplePlan: WeeklyWorkoutPlan = {
      monday: {
        type: 'prenatal_yoga',
        duration: '30 min',
        calories: '150',
        focus: 'Flexibility & Relaxation',
        warmup: [
          { name: 'Gentle Neck Rolls', duration: '2 min', instructions: 'Slowly roll your head in circles, 5 times each direction' },
          { name: 'Shoulder Shrugs', duration: '2 min', instructions: 'Lift shoulders to ears, hold, then release' },
        ],
        main: [
          { name: 'Cat-Cow Stretch', duration: '3 min', instructions: 'On all fours, alternate between arching and rounding your back', modification: 'Use a pillow under knees for comfort' },
          { name: 'Modified Child\'s Pose', duration: '2 min', instructions: 'Kneel with knees wide apart, stretch arms forward', modification: 'Keep knees wide to accommodate belly' },
          { name: 'Seated Side Stretch', duration: '3 min', instructions: 'Sit cross-legged, reach one arm overhead and lean', modification: 'Sit on cushion for comfort' },
          { name: 'Butterfly Stretch', duration: '3 min', instructions: 'Sit with soles of feet together, gently press knees down' },
          { name: 'Prenatal Pigeon Pose', duration: '4 min', instructions: 'Modified pigeon with props for hip opening' },
        ],
        cooldown: [
          { name: 'Deep Breathing', duration: '3 min', instructions: 'Belly breathing, inhale for 4, hold for 4, exhale for 6' },
          { name: 'Savasana (Side-lying)', duration: '5 min', instructions: 'Lie on your left side with pillow between knees' },
        ],
      },
      tuesday: {
        type: 'walking',
        duration: '25 min',
        calories: '120',
        focus: 'Light Cardio',
        warmup: [
          { name: 'Gentle Marching', duration: '2 min', instructions: 'March in place, lifting knees gently' },
          { name: 'Arm Circles', duration: '2 min', instructions: 'Small to large circles with arms extended' },
        ],
        main: [
          { name: 'Brisk Walk', duration: '15 min', instructions: 'Maintain a pace where you can still hold a conversation', modification: 'Walk indoors or on flat terrain' },
        ],
        cooldown: [
          { name: 'Slow Walk', duration: '3 min', instructions: 'Gradually slow your pace' },
          { name: 'Standing Calf Stretch', duration: '3 min', instructions: 'Hold onto wall, step one foot back, press heel down' },
        ],
      },
      wednesday: {
        type: 'strength',
        duration: '25 min',
        calories: '130',
        focus: 'Upper Body & Core Stability',
        warmup: [
          { name: 'Arm Swings', duration: '2 min', instructions: 'Gentle arm swings across body' },
          { name: 'Wrist Circles', duration: '1 min', instructions: 'Circle wrists in both directions' },
        ],
        main: [
          { name: 'Wall Push-ups', duration: '3 min', reps: '2 sets of 10', instructions: 'Stand arm\'s length from wall, lower chest toward wall', modification: 'Step closer to wall to make easier' },
          { name: 'Seated Bicep Curls', duration: '3 min', reps: '2 sets of 12', instructions: 'Use light weights (2-5 lbs) or water bottles', modification: 'Do without weights if needed' },
          { name: 'Bird Dog', duration: '4 min', reps: '10 each side', instructions: 'On all fours, extend opposite arm and leg', modification: 'Just lift arm OR leg, not both' },
          { name: 'Seated Shoulder Press', duration: '3 min', reps: '2 sets of 10', instructions: 'Press light weights overhead while seated' },
        ],
        cooldown: [
          { name: 'Chest Opener', duration: '2 min', instructions: 'Clasp hands behind back, squeeze shoulder blades' },
          { name: 'Tricep Stretch', duration: '2 min', instructions: 'Reach one arm overhead, bend elbow, gentle push with other hand' },
        ],
      },
      thursday: {
        type: 'rest',
        duration: '0 min',
        focus: 'Recovery & Self-Care',
        isRestDay: true,
        warmup: [],
        main: [
          { name: 'Gentle Stretching', duration: '10 min', instructions: 'Optional light stretching if you feel like it' },
          { name: 'Self-Care Time', duration: '20 min', instructions: 'Take a warm bath, read a book, or nap' },
        ],
        cooldown: [],
      },
      friday: {
        type: 'cardio',
        duration: '20 min',
        calories: '100',
        focus: 'Low-Impact Cardio',
        warmup: [
          { name: 'Marching in Place', duration: '3 min', instructions: 'Lift knees to comfortable height' },
        ],
        main: [
          { name: 'Side Steps', duration: '3 min', instructions: 'Step side to side, adding arm movements' },
          { name: 'Gentle Squats', duration: '4 min', reps: '2 sets of 10', instructions: 'Feet wide, squat to comfortable depth', modification: 'Hold onto chair for balance' },
          { name: 'Standing Leg Lifts', duration: '4 min', reps: '10 each side', instructions: 'Hold chair, lift leg to side', modification: 'Smaller range of motion' },
        ],
        cooldown: [
          { name: 'Hip Circles', duration: '2 min', instructions: 'Hands on hips, circle hips gently' },
          { name: 'Standing Forward Fold', duration: '2 min', instructions: 'Feet wide, fold forward with bent knees' },
        ],
      },
      saturday: {
        type: 'flexibility',
        duration: '25 min',
        calories: '80',
        focus: 'Full Body Stretch',
        warmup: [
          { name: 'Gentle Breathing', duration: '2 min', instructions: 'Deep belly breaths to relax' },
        ],
        main: [
          { name: 'Neck & Shoulder Release', duration: '4 min', instructions: 'Ear to shoulder stretches, shoulder rolls' },
          { name: 'Seated Spinal Twist', duration: '4 min', instructions: 'Gentle twist to each side while seated', modification: 'Keep twist minimal in third trimester' },
          { name: 'Hip Flexor Stretch', duration: '4 min', instructions: 'Lunge position with back knee down' },
          { name: 'Hamstring Stretch', duration: '4 min', instructions: 'Seated with legs extended, reach for toes' },
          { name: 'Prenatal Goddess Squat', duration: '3 min', instructions: 'Wide stance, toes out, lower into squat' },
        ],
        cooldown: [
          { name: 'Legs Up the Wall', duration: '4 min', instructions: 'Lie near wall, legs resting up. Great for swelling!' },
        ],
      },
      sunday: {
        type: 'rest',
        duration: '0 min',
        focus: 'Rest & Rejuvenation',
        isRestDay: true,
        warmup: [],
        main: [
          { name: 'Leisurely Walk', duration: '15 min', instructions: 'Optional gentle walk if you feel like it' },
          { name: 'Meditation', duration: '10 min', instructions: 'Guided pregnancy meditation or quiet reflection' },
        ],
        cooldown: [],
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

  const toggleExercise = (day: string, phase: string, index: number) => {
    const key = `${day}-${phase}-${index}`;
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
    const workout = weeklyPlan[day];
    if (workout.isRestDay) return 100;

    const totalExercises = workout.warmup.length + workout.main.length + workout.cooldown.length;
    if (totalExercises === 0) return 0;

    let completed = 0;
    workout.warmup.forEach((_, i) => {
      if (completedExercises.has(`${day}-warmup-${i}`)) completed++;
    });
    workout.main.forEach((_, i) => {
      if (completedExercises.has(`${day}-main-${i}`)) completed++;
    });
    workout.cooldown.forEach((_, i) => {
      if (completedExercises.has(`${day}-cooldown-${i}`)) completed++;
    });

    return Math.round((completed / totalExercises) * 100);
  };

  const weekDates = getWeekDates();
  const selectedWorkout = selectedDay && weeklyPlan ? weeklyPlan[selectedDay] : null;

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
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
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
            {/* Regenerate Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={generateWeeklyWorkout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate Plan
              </button>
            </div>

            {/* Desktop Grid */}
            <div className="hidden md:grid grid-cols-7 gap-3 mb-6">
              {DAYS.map((day, index) => {
                const workout = weeklyPlan[day];
                const dateInfo = weekDates[index];
                const typeInfo = workout ? WORKOUT_TYPES[workout.type] || WORKOUT_TYPES.rest : WORKOUT_TYPES.rest;
                const Icon = typeInfo.icon;
                const progress = getDayProgress(day);

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all ${
                      selectedDay === day ? 'ring-2 ring-purple-500' : ''
                    } ${dateInfo.isToday ? 'ring-2 ring-pink-400' : ''}`}
                  >
                    {/* Date */}
                    <div className="text-center mb-3">
                      <p className="text-xs text-gray-500 uppercase">{DAY_LABELS[day]}</p>
                      <p className={`text-lg font-bold ${dateInfo.isToday ? 'text-pink-500' : 'text-gray-900'}`}>
                        {dateInfo.day}
                      </p>
                    </div>

                    {/* Workout Type */}
                    <div className={`w-12 h-12 rounded-xl ${typeInfo.bgColor} flex items-center justify-center mx-auto mb-2`}>
                      <Icon className={`w-6 h-6 ${typeInfo.color}`} />
                    </div>
                    <p className="text-sm font-medium text-gray-900 text-center">{typeInfo.label}</p>

                    {workout && !workout.isRestDay && (
                      <>
                        <p className="text-xs text-gray-500 text-center mt-1">{workout.duration}</p>
                        {/* Progress */}
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
                    {workout?.isRestDay && (
                      <p className="text-xs text-gray-400 text-center mt-1">Rest & recover</p>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {DAYS.map((day, index) => {
                const workout = weeklyPlan[day];
                const dateInfo = weekDates[index];
                const typeInfo = workout ? WORKOUT_TYPES[workout.type] || WORKOUT_TYPES.rest : WORKOUT_TYPES.rest;
                const Icon = typeInfo.icon;
                const progress = getDayProgress(day);

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`w-full bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 ${
                      dateInfo.isToday ? 'ring-2 ring-pink-400' : ''
                    }`}
                  >
                    {/* Date */}
                    <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center ${
                      dateInfo.isToday ? 'bg-pink-100' : 'bg-gray-100'
                    }`}>
                      <p className="text-xs text-gray-500 uppercase">{DAY_LABELS[day]}</p>
                      <p className={`text-lg font-bold ${dateInfo.isToday ? 'text-pink-500' : 'text-gray-900'}`}>
                        {dateInfo.day}
                      </p>
                    </div>

                    {/* Workout Info */}
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg ${typeInfo.bgColor} flex items-center justify-center`}>
                          <Icon className={`w-4 h-4 ${typeInfo.color}`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{typeInfo.label}</p>
                          <p className="text-xs text-gray-500">
                            {workout?.isRestDay ? 'Rest & recover' : workout?.duration}
                          </p>
                        </div>
                      </div>
                      {workout && !workout.isRestDay && progress > 0 && (
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
                  Stay hydrated and avoid overheating. Consult your healthcare provider before starting any exercise program.
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
            {/* Modal Header */}
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

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-4">
              {selectedWorkout.isRestDay ? (
                <div className="text-center py-8">
                  <Moon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Rest Day</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Your body needs rest to recover and grow stronger. Take it easy today - you've earned it!
                  </p>
                  {selectedWorkout.main.length > 0 && (
                    <div className="mt-6 space-y-3">
                      <p className="text-sm text-gray-500">Optional activities:</p>
                      {selectedWorkout.main.map((exercise, i) => (
                        <div key={i} className="bg-gray-50 rounded-xl p-4 text-left">
                          <p className="font-medium text-gray-900">{exercise.name}</p>
                          <p className="text-sm text-gray-600">{exercise.instructions}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Stats */}
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

                  {/* Warmup */}
                  {selectedWorkout.warmup.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                        <span className="w-6 h-6 bg-green-100 rounded-full text-green-600 text-xs flex items-center justify-center font-bold">1</span>
                        Warm-up
                      </h3>
                      <div className="space-y-2">
                        {selectedWorkout.warmup.map((exercise, i) => (
                          <button
                            key={i}
                            onClick={() => toggleExercise(selectedDay, 'warmup', i)}
                            className={`w-full p-3 rounded-xl border transition-colors text-left ${
                              completedExercises.has(`${selectedDay}-warmup-${i}`)
                                ? 'bg-green-50 border-green-200'
                                : 'bg-gray-50 border-gray-100 hover:border-purple-200'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-gray-900">{exercise.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">{exercise.duration}</span>
                                {completedExercises.has(`${selectedDay}-warmup-${i}`) && (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">{exercise.instructions}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Main Workout */}
                  {selectedWorkout.main.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                        <span className="w-6 h-6 bg-purple-100 rounded-full text-purple-600 text-xs flex items-center justify-center font-bold">2</span>
                        Main Workout
                      </h3>
                      <div className="space-y-2">
                        {selectedWorkout.main.map((exercise, i) => (
                          <button
                            key={i}
                            onClick={() => toggleExercise(selectedDay, 'main', i)}
                            className={`w-full p-3 rounded-xl border transition-colors text-left ${
                              completedExercises.has(`${selectedDay}-main-${i}`)
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
                                {completedExercises.has(`${selectedDay}-main-${i}`) && (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{exercise.instructions}</p>
                            {exercise.modification && (
                              <p className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded inline-block">
                                Modification: {exercise.modification}
                              </p>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cooldown */}
                  {selectedWorkout.cooldown.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                        <span className="w-6 h-6 bg-blue-100 rounded-full text-blue-600 text-xs flex items-center justify-center font-bold">3</span>
                        Cool-down
                      </h3>
                      <div className="space-y-2">
                        {selectedWorkout.cooldown.map((exercise, i) => (
                          <button
                            key={i}
                            onClick={() => toggleExercise(selectedDay, 'cooldown', i)}
                            className={`w-full p-3 rounded-xl border transition-colors text-left ${
                              completedExercises.has(`${selectedDay}-cooldown-${i}`)
                                ? 'bg-green-50 border-green-200'
                                : 'bg-gray-50 border-gray-100 hover:border-purple-200'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-gray-900">{exercise.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">{exercise.duration}</span>
                                {completedExercises.has(`${selectedDay}-cooldown-${i}`) && (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">{exercise.instructions}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Encouragement */}
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
    </div>
  );
}
