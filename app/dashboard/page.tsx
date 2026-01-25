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
  Droplets,
  Moon,
  Leaf,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Calendar,
  CheckCircle,
  Shield,
} from 'lucide-react';

// Sample care data - in production, this comes from API
const sampleCareData = {
  greeting: 'Good morning',
  userName: 'Sarah',
  pregnancyInfo: {
    month: 6,
    week: 24,
    babySize: 'ear of corn',
    babySizeEmoji: '🌽',
  },
  todaysCare: {
    meals: {
      breakfast: { name: 'Oatmeal with Berries', description: 'Fiber-rich start with antioxidants' },
      lunch: { name: 'Grilled Salmon Salad', description: 'Omega-3 for baby brain development' },
      dinner: { name: 'Chicken Stir-fry', description: 'Lean protein with vegetables' },
      snacks: ['Greek yogurt', 'Almonds', 'Apple slices'],
    },
    exercise: { minutes: 20, type: 'Gentle prenatal yoga' },
    hydration: { target: 8, completed: 3 },
    sleepTip: 'Try sleeping on your left side with a pillow between your knees for better blood flow.',
    wellnessTip: 'Practice 5 minutes of deep breathing today to reduce stress and connect with baby.',
    safetyNote: 'Avoid heavy lifting and prolonged standing. Take breaks every 30 minutes.',
  },
};

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const groceryList = {
  proteins: [
    { item: 'Salmon', quantity: '500g' },
    { item: 'Eggs', quantity: '12' },
    { item: 'Chicken breast', quantity: '1 lb' },
  ],
  vegetables: [
    { item: 'Spinach', quantity: '2 bunches' },
    { item: 'Broccoli', quantity: '1 lb' },
    { item: 'Carrots', quantity: '1 lb' },
  ],
  fruits: [
    { item: 'Bananas', quantity: '6' },
    { item: 'Berries', quantity: '2 boxes' },
    { item: 'Oranges', quantity: '4' },
  ],
  dairy: [
    { item: 'Milk', quantity: '2L' },
    { item: 'Greek yogurt', quantity: '500g' },
  ],
  grains: [
    { item: 'Oats', quantity: '1 kg' },
    { item: 'Brown rice', quantity: '1 kg' },
  ],
};

const monthlyStaples = {
  ironRich: ['Lentils', 'Spinach', 'Red meat', 'Fortified cereals'],
  calciumSources: ['Fortified milk', 'Cheese', 'Yogurt', 'Almonds'],
  omega3: ['Salmon', 'Walnuts', 'Chia seeds', 'Flaxseed'],
  folate: ['Leafy greens', 'Beans', 'Citrus fruits', 'Fortified grains'],
};

export default function DashboardPage() {
  const router = useRouter();
  const [hydrationCount, setHydrationCount] = useState(3);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [user, setUser] = useState<any>(null);

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
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const getWeekDates = () => {
    const dates = [];
    const start = new Date(currentWeekStart);
    start.setDate(start.getDate() - start.getDay() + 1); // Monday

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const care = sampleCareData;

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
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full"
            >
              <User className="w-5 h-5" />
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {care.greeting}, {user?.firstName || care.userName}! 💜
          </h1>
          <p className="text-gray-600 mt-1">
            You're in Week {care.pregnancyInfo.week} • Baby is the size of an{' '}
            {care.pregnancyInfo.babySize} {care.pregnancyInfo.babySizeEmoji}
          </p>
        </div>

        {/* Today's Care Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Care</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Meals Card */}
            <div className="care-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-pink-500" />
                </div>
                <h3 className="font-semibold text-gray-900">Meals</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900">Breakfast</p>
                  <p className="text-gray-600">{care.todaysCare.meals.breakfast.name}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Lunch</p>
                  <p className="text-gray-600">{care.todaysCare.meals.lunch.name}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Dinner</p>
                  <p className="text-gray-600">{care.todaysCare.meals.dinner.name}</p>
                </div>
              </div>
            </div>

            {/* Exercise Card */}
            <div className="care-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-purple-500" />
                </div>
                <h3 className="font-semibold text-gray-900">Exercise</h3>
              </div>
              <p className="text-3xl font-bold text-purple-600 mb-1">
                {care.todaysCare.exercise.minutes} min
              </p>
              <p className="text-gray-600 text-sm">{care.todaysCare.exercise.type}</p>
              <button className="mt-4 w-full py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors">
                Start Session
              </button>
            </div>

            {/* Hydration Card */}
            <div className="care-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="font-semibold text-gray-900">Hydration</h3>
              </div>
              <p className="text-3xl font-bold text-blue-600 mb-1">
                {hydrationCount}/{care.todaysCare.hydration.target}
              </p>
              <p className="text-gray-600 text-sm">glasses of water</p>
              <button
                onClick={() => setHydrationCount(Math.min(hydrationCount + 1, 12))}
                className="mt-4 w-full py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
              >
                + Add Glass
              </button>
            </div>

            {/* Sleep Tip Card */}
            <div className="care-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Moon className="w-5 h-5 text-indigo-500" />
                </div>
                <h3 className="font-semibold text-gray-900">Rest & Sleep</h3>
              </div>
              <p className="text-gray-600 text-sm">{care.todaysCare.sleepTip}</p>
            </div>

            {/* Wellness Tip Card */}
            <div className="care-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="font-semibold text-gray-900">Wellness</h3>
              </div>
              <p className="text-gray-600 text-sm">{care.todaysCare.wellnessTip}</p>
            </div>

            {/* Safety Note Card */}
            <div className="care-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="font-semibold text-gray-900">Safety</h3>
              </div>
              <p className="text-gray-600 text-sm">{care.todaysCare.safetyNote}</p>
            </div>
          </div>
        </section>

        {/* Weekly Calendar */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              This Week
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const newDate = new Date(currentWeekStart);
                  newDate.setDate(newDate.getDate() - 7);
                  setCurrentWeekStart(newDate);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  const newDate = new Date(currentWeekStart);
                  newDate.setDate(newDate.getDate() + 7);
                  setCurrentWeekStart(newDate);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="card">
            <div className="grid grid-cols-7 gap-2">
              {getWeekDates().map((date, i) => (
                <div
                  key={i}
                  className={`text-center p-3 rounded-xl ${
                    isToday(date)
                      ? 'bg-purple-500 text-white'
                      : isPast(date)
                      ? 'bg-gray-50 text-gray-400'
                      : 'bg-gray-50 text-gray-700'
                  }`}
                >
                  <p className="text-xs font-medium mb-1">{weekDays[i]}</p>
                  <p className="text-lg font-bold">{date.getDate()}</p>
                  {isPast(date) && !isToday(date) && (
                    <CheckCircle className="w-4 h-4 mx-auto mt-1 text-green-500" />
                  )}
                  {isToday(date) && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1" />}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Grocery List */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <ShoppingCart className="w-5 h-5" />
            Weekly Grocery List
          </h2>

          <div className="card">
            <p className="text-gray-600 mb-4">Based on your meal plan this week:</p>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Proteins</h4>
                <ul className="space-y-1">
                  {groceryList.proteins.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <input type="checkbox" className="rounded text-purple-600" />
                      {item.item} - {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Vegetables</h4>
                <ul className="space-y-1">
                  {groceryList.vegetables.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <input type="checkbox" className="rounded text-purple-600" />
                      {item.item} - {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Fruits</h4>
                <ul className="space-y-1">
                  {groceryList.fruits.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <input type="checkbox" className="rounded text-purple-600" />
                      {item.item} - {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Dairy</h4>
                <ul className="space-y-1">
                  {groceryList.dairy.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <input type="checkbox" className="rounded text-purple-600" />
                      {item.item} - {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Grains</h4>
                <ul className="space-y-1">
                  {groceryList.grains.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <input type="checkbox" className="rounded text-purple-600" />
                      {item.item} - {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <button className="mt-6 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
              📋 Copy List
            </button>
          </div>
        </section>

        {/* Monthly Staples */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Monthly Staples (Month {care.pregnancyInfo.month})
          </h2>

          <div className="card">
            <p className="text-gray-600 mb-4">Essential nutrients for your baby's development:</p>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  🥬 Iron-rich Foods
                </h4>
                <ul className="space-y-1">
                  {monthlyStaples.ironRich.map((item, i) => (
                    <li key={i} className="text-sm text-gray-600">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  🥛 Calcium Sources
                </h4>
                <ul className="space-y-1">
                  {monthlyStaples.calciumSources.map((item, i) => (
                    <li key={i} className="text-sm text-gray-600">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  🐟 Omega-3
                </h4>
                <ul className="space-y-1">
                  {monthlyStaples.omega3.map((item, i) => (
                    <li key={i} className="text-sm text-gray-600">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  🥗 Folate
                </h4>
                <ul className="space-y-1">
                  {monthlyStaples.folate.map((item, i) => (
                    <li key={i} className="text-sm text-gray-600">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            <strong>Disclaimer:</strong> This is guidance only, not medical advice. Always consult
            your healthcare provider.
          </p>
        </div>
      </main>
    </div>
  );
}
