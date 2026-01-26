'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ArrowLeft,
  Pill,
  Plus,
  Check,
  Clock,
  Sun,
  Moon,
  Sunset,
  X,
  Loader2,
} from 'lucide-react';

interface Supplement {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: string[];
  notes?: string;
  isActive: boolean;
}

const timeIcons: Record<string, any> = {
  morning: Sun,
  afternoon: Sunset,
  evening: Moon,
  night: Moon,
};

const defaultSupplements = [
  { name: 'Prenatal Vitamin', dosage: '1 tablet', frequency: 'daily', timeOfDay: ['morning'] },
  { name: 'Folic Acid', dosage: '400mcg', frequency: 'daily', timeOfDay: ['morning'] },
  { name: 'Iron', dosage: '27mg', frequency: 'daily', timeOfDay: ['morning'] },
  { name: 'DHA/Omega-3', dosage: '200mg', frequency: 'daily', timeOfDay: ['evening'] },
  { name: 'Vitamin D', dosage: '600 IU', frequency: 'daily', timeOfDay: ['morning'] },
];

export default function SupplementsPage() {
  const router = useRouter();
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [takenToday, setTakenToday] = useState<Set<string>>(new Set());

  // New supplement form
  const [newSupplement, setNewSupplement] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    timeOfDay: ['morning'] as string[],
    notes: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchSupplements(token);

    // Load taken status from localStorage
    const today = new Date().toDateString();
    const savedTaken = localStorage.getItem(`supplements-taken-${today}`);
    if (savedTaken) {
      setTakenToday(new Set(JSON.parse(savedTaken)));
    }
  }, [router]);

  const fetchSupplements = async (token: string) => {
    try {
      const res = await fetch('/api/supplements', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setSupplements(data.supplements || []);
      } else if (res.status === 404) {
        // No supplements yet, show defaults
        setSupplements([]);
      }
    } catch (error) {
      console.error('Error fetching supplements:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSupplement = async () => {
    if (!newSupplement.name) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('/api/supplements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSupplement),
      });

      if (res.ok) {
        const data = await res.json();
        setSupplements((prev) => [...prev, data.supplement]);
        setNewSupplement({
          name: '',
          dosage: '',
          frequency: 'daily',
          timeOfDay: ['morning'],
          notes: '',
        });
        setShowAdd(false);
      }
    } catch (error) {
      console.error('Error adding supplement:', error);
    }
  };

  const toggleTaken = (supplementId: string) => {
    const newTaken = new Set(takenToday);
    if (newTaken.has(supplementId)) {
      newTaken.delete(supplementId);
    } else {
      newTaken.add(supplementId);
    }
    setTakenToday(newTaken);

    // Save to localStorage
    const today = new Date().toDateString();
    localStorage.setItem(`supplements-taken-${today}`, JSON.stringify(Array.from(newTaken)));
  };

  const toggleTimeOfDay = (time: string) => {
    setNewSupplement((prev) => ({
      ...prev,
      timeOfDay: prev.timeOfDay.includes(time)
        ? prev.timeOfDay.filter((t) => t !== time)
        : [...prev.timeOfDay, time],
    }));
  };

  const addDefaultSupplement = async (supp: typeof defaultSupplements[0]) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('/api/supplements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(supp),
      });

      if (res.ok) {
        const data = await res.json();
        setSupplements((prev) => [...prev, data.supplement]);
      }
    } catch (error) {
      console.error('Error adding supplement:', error);
    }
  };

  const progress = supplements.length > 0
    ? (takenToday.size / supplements.length) * 100
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <Heart className="w-12 h-12 text-pink-500 mx-auto animate-pulse" fill="#ec4899" />
          <p className="mt-4 text-gray-600">Loading supplements...</p>
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
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
              <Pill className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">Supplements</h1>
              <p className="text-xs text-gray-500">Track vitamins & medications</p>
            </div>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="p-2 text-orange-600 hover:bg-orange-50 rounded-full"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Progress */}
        {supplements.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Today's Progress</span>
              <span className="text-sm font-medium text-gray-900">
                {takenToday.size}/{supplements.length} taken
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Empty State */}
        {supplements.length === 0 && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Pill className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Track Your Supplements</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Add your prenatal vitamins and supplements to track daily intake.
            </p>

            {/* Quick Add Defaults */}
            <div className="text-left bg-white rounded-2xl p-5 shadow-sm">
              <p className="font-medium text-gray-900 mb-4">Recommended for Pregnancy:</p>
              <div className="space-y-2">
                {defaultSupplements.map((supp, i) => (
                  <button
                    key={i}
                    onClick={() => addDefaultSupplement(supp)}
                    className="w-full p-3 bg-gray-50 rounded-xl flex items-center justify-between hover:bg-orange-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Pill className="w-5 h-5 text-orange-500" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{supp.name}</p>
                        <p className="text-sm text-gray-500">{supp.dosage}</p>
                      </div>
                    </div>
                    <Plus className="w-5 h-5 text-orange-500" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Supplement List */}
        {supplements.length > 0 && (
          <div className="space-y-3">
            {supplements.map((supplement) => {
              const TimeIcon = timeIcons[supplement.timeOfDay[0]] || Clock;
              const isTaken = takenToday.has(supplement.id);

              return (
                <div
                  key={supplement.id}
                  className={`bg-white rounded-2xl p-4 shadow-sm transition-colors ${
                    isTaken ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleTaken(supplement.id)}
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isTaken
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-300 hover:border-orange-500'
                      }`}
                    >
                      {isTaken && <Check className="w-5 h-5 text-white" />}
                    </button>
                    <div className="flex-1">
                      <h3 className={`font-medium ${isTaken ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                        {supplement.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {supplement.dosage} • {supplement.frequency}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {supplement.timeOfDay.map((time) => {
                        const Icon = timeIcons[time] || Clock;
                        return (
                          <div
                            key={time}
                            className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center"
                            title={time}
                          >
                            <Icon className="w-4 h-4 text-orange-600" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {supplement.notes && (
                    <p className="mt-2 text-sm text-gray-500 pl-14">{supplement.notes}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Add Supplement Modal */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Add Supplement</h2>
                <button
                  onClick={() => setShowAdd(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={newSupplement.name}
                    onChange={(e) => setNewSupplement({ ...newSupplement, name: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Prenatal Vitamin"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                  <input
                    type="text"
                    value={newSupplement.dosage}
                    onChange={(e) => setNewSupplement({ ...newSupplement, dosage: e.target.value })}
                    className="input-field"
                    placeholder="e.g., 1 tablet, 500mg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time of Day</label>
                  <div className="flex gap-2">
                    {['morning', 'afternoon', 'evening', 'night'].map((time) => {
                      const Icon = timeIcons[time];
                      return (
                        <button
                          key={time}
                          onClick={() => toggleTimeOfDay(time)}
                          className={`flex-1 p-2 rounded-xl flex flex-col items-center gap-1 transition-colors ${
                            newSupplement.timeOfDay.includes(time)
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-xs capitalize">{time}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                  <input
                    type="text"
                    value={newSupplement.notes}
                    onChange={(e) => setNewSupplement({ ...newSupplement, notes: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Take with food"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAdd(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={addSupplement}
                  disabled={!newSupplement.name}
                  className="btn-primary flex-1"
                >
                  Add Supplement
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
