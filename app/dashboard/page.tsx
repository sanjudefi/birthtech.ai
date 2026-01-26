'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  User,
  LogOut,
  Utensils,
  Dumbbell,
  ShoppingCart,
  Pill,
  FileText,
  MessageCircle,
  Calendar,
  Droplets,
  Sparkles,
  ChevronRight,
  Baby,
  Settings,
} from 'lucide-react';

// Baby size by month
const babySizes = [
  { month: 1, size: 'poppy seed', emoji: '.' },
  { month: 2, size: 'raspberry', emoji: '' },
  { month: 3, size: 'lime', emoji: '' },
  { month: 4, size: 'avocado', emoji: '' },
  { month: 5, size: 'mango', emoji: '' },
  { month: 6, size: 'ear of corn', emoji: '' },
  { month: 7, size: 'eggplant', emoji: '' },
  { month: 8, size: 'butternut squash', emoji: '' },
  { month: 9, size: 'watermelon', emoji: '' },
];

const mainTiles = [
  {
    id: 'meals',
    title: 'Meal Planner',
    description: 'AI-powered daily meals',
    icon: Utensils,
    color: 'from-pink-500 to-rose-500',
    bgLight: 'bg-pink-50',
    href: '/dashboard/meals',
  },
  {
    id: 'workouts',
    title: 'Workouts',
    description: 'Safe pregnancy exercises',
    icon: Dumbbell,
    color: 'from-purple-500 to-indigo-500',
    bgLight: 'bg-purple-50',
    href: '/dashboard/workouts',
  },
  {
    id: 'grocery',
    title: 'Grocery List',
    description: 'Weekly shopping list',
    icon: ShoppingCart,
    color: 'from-green-500 to-emerald-500',
    bgLight: 'bg-green-50',
    href: '/dashboard/grocery',
  },
  {
    id: 'supplements',
    title: 'Supplements',
    description: 'Track vitamins & meds',
    icon: Pill,
    color: 'from-orange-500 to-amber-500',
    bgLight: 'bg-orange-50',
    href: '/dashboard/supplements',
  },
  {
    id: 'reports',
    title: 'Reports',
    description: 'Upload & track reports',
    icon: FileText,
    color: 'from-blue-500 to-cyan-500',
    bgLight: 'bg-blue-50',
    href: '/dashboard/reports',
  },
  {
    id: 'chat',
    title: 'AI Helper',
    description: 'Ask anything',
    icon: MessageCircle,
    color: 'from-violet-500 to-purple-500',
    bgLight: 'bg-violet-50',
    href: '/dashboard/chat',
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [tipOfDay, setTipOfDay] = useState<string>('');
  const [hydrationCount, setHydrationCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      router.push('/auth/login');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Fetch profile and tip
    fetchProfile(token);
  }, [router]);

  const fetchProfile = async (token: string) => {
    try {
      const res = await fetch('/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 404) {
        // No profile - redirect to onboarding
        router.push('/onboarding');
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setProfile(data);

        // Get tip of day
        fetchTipOfDay(token);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTipOfDay = async (token: string) => {
    try {
      const res = await fetch('/api/ai/tip', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTipOfDay(data.tip);
      }
    } catch (error) {
      setTipOfDay("Stay hydrated and rest when you need to. You're doing amazing!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getWeekFromMonth = (month: number) => {
    const weekRanges = [
      [1, 4], [5, 8], [9, 13], [14, 17], [18, 22], [23, 27], [28, 31], [32, 35], [36, 40]
    ];
    const range = weekRanges[month - 1] || [1, 4];
    return Math.floor((range[0] + range[1]) / 2);
  };

  const getBabySize = (month: number) => {
    return babySizes[month - 1] || babySizes[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <Heart className="w-12 h-12 text-pink-500 mx-auto animate-pulse" fill="#ec4899" />
          <p className="mt-4 text-gray-600">Loading your care plan...</p>
        </div>
      </div>
    );
  }

  const babyInfo = getBabySize(profile?.pregnancyMonth || 6);
  const weekNum = getWeekFromMonth(profile?.pregnancyMonth || 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-7 h-7 text-pink-500" fill="#ec4899" />
            <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              BirthTech.ai
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/calendar"
              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full"
              title="Calendar"
            >
              <Calendar className="w-5 h-5" />
            </Link>
            <Link
              href="/dashboard/profile"
              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full"
              title="Profile"
            >
              <User className="w-5 h-5" />
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                {getGreeting()}, {user?.firstName || 'Mama'}!
              </h1>
              <p className="text-purple-100 text-sm">
                Week {weekNum} • Baby is the size of a {babyInfo.size} {babyInfo.emoji}
              </p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Baby className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{profile?.pregnancyMonth || 6}</p>
              <p className="text-xs text-purple-100">Month</p>
            </div>
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{Math.ceil((new Date(profile?.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}d</p>
              <p className="text-xs text-purple-100">To Go</p>
            </div>
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <button
                onClick={() => setHydrationCount(Math.min(hydrationCount + 1, 12))}
                className="w-full"
              >
                <p className="text-2xl font-bold">{hydrationCount}/{profile?.waterIntakeGoal || 8}</p>
                <p className="text-xs text-purple-100">Water</p>
              </button>
            </div>
          </div>
        </div>

        {/* Tip of the Day */}
        {tipOfDay && (
          <div className="bg-white rounded-2xl p-4 mb-6 flex items-start gap-3 shadow-sm">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Tip of the Day</p>
              <p className="text-sm text-gray-600 mt-1">{tipOfDay}</p>
            </div>
          </div>
        )}

        {/* Main Feature Tiles - 6 Big Icons */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Care Plan</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {mainTiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <Link
                key={tile.id}
                href={tile.href}
                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tile.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">{tile.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{tile.description}</p>
                <div className="flex items-center gap-1 text-purple-600 text-sm mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  Open <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Generate Today's Plan */}
          <Link
            href="/dashboard/meals?generate=true"
            className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-5 text-white flex items-center gap-4 hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold">Generate Today's Meal Plan</p>
              <p className="text-sm text-pink-100">AI-powered nutrition for you</p>
            </div>
            <ChevronRight className="w-6 h-6 ml-auto" />
          </Link>

          {/* Chat with AI */}
          <Link
            href="/dashboard/chat"
            className="bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl p-5 text-white flex items-center gap-4 hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold">Chat with Bloom</p>
              <p className="text-sm text-violet-100">Your AI pregnancy companion</p>
            </div>
            <ChevronRight className="w-6 h-6 ml-auto" />
          </Link>
        </div>

        {/* Hydration Tracker */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Droplets className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Hydration Tracker</h3>
                <p className="text-sm text-gray-500">
                  {hydrationCount}/{profile?.waterIntakeGoal || 8} glasses today
                </p>
              </div>
            </div>
            <button
              onClick={() => setHydrationCount(Math.min(hydrationCount + 1, 12))}
              className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              + Add Glass
            </button>
          </div>
          <div className="flex gap-2">
            {Array.from({ length: profile?.waterIntakeGoal || 8 }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-3 rounded-full transition-colors ${
                  i < hydrationCount ? 'bg-blue-500' : 'bg-gray-100'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500">
            <strong>Disclaimer:</strong> BirthTech.ai provides general wellness information, not medical advice.
            Always consult your healthcare provider for medical decisions.
          </p>
        </div>
      </main>
    </div>
  );
}
