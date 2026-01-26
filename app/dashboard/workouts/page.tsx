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
  Play,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

interface Workout {
  warmup: {
    duration: string;
    exercises: Array<{
      name: string;
      duration: string;
      instructions: string;
    }>;
  };
  mainWorkout: {
    duration: string;
    exercises: Array<{
      name: string;
      duration: string;
      reps: string;
      instructions: string;
      modification: string;
    }>;
  };
  cooldown: {
    duration: string;
    exercises: Array<{
      name: string;
      duration: string;
      instructions: string;
    }>;
  };
  totalDuration: string;
  safetyNotes: string[];
  encouragement: string;
}

export default function WorkoutsPage() {
  const router = useRouter();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);

  const generateWorkout = async () => {
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
      });

      const data = await res.json();

      if (res.ok && data.workout) {
        setWorkout(data.workout);
        setCompletedExercises(new Set());
      } else {
        throw new Error(data.error || 'Failed to generate workout');
      }
    } catch (error: any) {
      console.error('Error generating workout:', error);
      alert('Failed to generate workout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExercise = (exerciseName: string) => {
    setCompletedExercises((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseName)) {
        newSet.delete(exerciseName);
      } else {
        newSet.add(exerciseName);
      }
      return newSet;
    });
  };

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
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">Workouts</h1>
              <p className="text-xs text-gray-500">Safe pregnancy exercises</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Generate Button */}
        {!workout && !loading && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Dumbbell className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Ready to Move?</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Get a safe, personalized workout routine designed for your pregnancy stage and fitness level.
            </p>
            <button
              onClick={generateWorkout}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow flex items-center gap-2 mx-auto"
            >
              <Sparkles className="w-5 h-5" />
              Generate My Workout
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 text-purple-500 mx-auto animate-spin" />
            <p className="mt-4 text-gray-600">Creating your safe workout...</p>
            <p className="text-sm text-gray-400 mt-2">This may take a moment</p>
          </div>
        )}

        {/* Workout Display */}
        {workout && !loading && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Total: {workout.totalDuration}</span>
              </div>
              <button
                onClick={generateWorkout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                New Workout
              </button>
            </div>

            {/* Safety Notes */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-amber-800">Safety First</h3>
              </div>
              <ul className="text-sm text-amber-700 space-y-1">
                {workout.safetyNotes.map((note, i) => (
                  <li key={i}>• {note}</li>
                ))}
              </ul>
            </div>

            {/* Warmup */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 bg-green-100 rounded-full text-green-600 text-xs flex items-center justify-center font-bold">1</span>
                  Warm-up
                </h3>
                <span className="text-sm text-gray-500">{workout.warmup.duration}</span>
              </div>
              <div className="space-y-3">
                {workout.warmup.exercises.map((exercise, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                      completedExercises.has(`warmup-${i}`)
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-100 hover:border-purple-200'
                    }`}
                    onClick={() => toggleExercise(`warmup-${i}`)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{exercise.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{exercise.duration}</span>
                        {completedExercises.has(`warmup-${i}`) && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{exercise.instructions}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Workout */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 bg-purple-100 rounded-full text-purple-600 text-xs flex items-center justify-center font-bold">2</span>
                  Main Workout
                </h3>
                <span className="text-sm text-gray-500">{workout.mainWorkout.duration}</span>
              </div>
              <div className="space-y-3">
                {workout.mainWorkout.exercises.map((exercise, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                      completedExercises.has(`main-${i}`)
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-100 hover:border-purple-200'
                    }`}
                    onClick={() => toggleExercise(`main-${i}`)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{exercise.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {exercise.reps || exercise.duration}
                        </span>
                        {completedExercises.has(`main-${i}`) && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{exercise.instructions}</p>
                    {exercise.modification && (
                      <p className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
                        <strong>Modification:</strong> {exercise.modification}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Cooldown */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-100 rounded-full text-blue-600 text-xs flex items-center justify-center font-bold">3</span>
                  Cool-down
                </h3>
                <span className="text-sm text-gray-500">{workout.cooldown.duration}</span>
              </div>
              <div className="space-y-3">
                {workout.cooldown.exercises.map((exercise, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                      completedExercises.has(`cooldown-${i}`)
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-100 hover:border-purple-200'
                    }`}
                    onClick={() => toggleExercise(`cooldown-${i}`)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{exercise.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{exercise.duration}</span>
                        {completedExercises.has(`cooldown-${i}`) && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{exercise.instructions}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Encouragement */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-5 text-white text-center">
              <Sparkles className="w-8 h-8 mx-auto mb-2" />
              <p className="text-lg">{workout.encouragement}</p>
            </div>

            {/* Disclaimer */}
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500">
                Always listen to your body. Stop immediately if you experience pain, dizziness, or shortness of breath.
                Consult your healthcare provider before starting any exercise routine.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
