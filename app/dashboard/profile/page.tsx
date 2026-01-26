'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ArrowLeft,
  User,
  Save,
  Loader2,
  MapPin,
  Calendar,
  Scale,
  Utensils,
  AlertCircle,
  Check,
  Droplets,
  Bone,
  Brain,
  Sun,
  Egg,
  Leaf,
  HelpCircle,
} from 'lucide-react';

const deficiencyOptions = [
  { id: 'iron', label: 'Iron', icon: Droplets, color: 'red', hint: 'Low energy, pale skin' },
  { id: 'calcium', label: 'Calcium', icon: Bone, color: 'blue', hint: 'Bone & teeth support' },
  { id: 'b12', label: 'Vitamin B12', icon: Brain, color: 'purple', hint: 'Energy & nerves' },
  { id: 'vitamin_d', label: 'Vitamin D', icon: Sun, color: 'amber', hint: 'Bone health' },
  { id: 'protein', label: 'Protein', icon: Egg, color: 'orange', hint: 'Baby growth' },
  { id: 'folate', label: 'Folate', icon: Leaf, color: 'green', hint: 'Neural development' },
  { id: 'not_sure', label: "Not Sure", icon: HelpCircle, color: 'gray', hint: "We'll balance it" },
];

const dietOptions = [
  { value: 'omnivore', label: 'Omnivore (Eat everything)' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'pescatarian', label: 'Pescatarian' },
  { value: 'halal', label: 'Halal' },
  { value: 'kosher', label: 'Kosher' },
];

const pregnancyTypes = [
  { value: 'single', label: 'Single baby' },
  { value: 'twins', label: 'Twins' },
  { value: 'triplets', label: 'Triplets' },
];

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    motherAge: '',
    country: 'Canada',
    city: '',
    preferredLanguages: ['English'],
    pregnancyMonth: 6,
    pregnancyType: 'single',
    pregnancyCount: 1,
    dueDate: '',
    height: '',
    weight: '',
    dietPreference: 'omnivore',
    allergies: [] as string[],
    deficiencies: [] as string[],
    waterIntakeGoal: 8,
  });

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
        setFormData({
          fullName: data.fullName || '',
          motherAge: data.motherAge?.toString() || '',
          country: data.country || 'Canada',
          city: data.city || '',
          preferredLanguages: data.preferredLanguages || ['English'],
          pregnancyMonth: data.pregnancyMonth || 6,
          pregnancyType: data.pregnancyType || 'single',
          pregnancyCount: data.pregnancyCount || 1,
          dueDate: data.dueDate ? data.dueDate.split('T')[0] : '',
          height: data.height?.toString() || '',
          weight: data.weight?.toString() || '',
          dietPreference: data.dietPreference || 'omnivore',
          allergies: data.allergies || [],
          deficiencies: data.deficiencies || [],
          waterIntakeGoal: data.waterIntakeGoal || 8,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setSaving(true);
    setError('');
    setSaved(false);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          motherAge: formData.motherAge ? parseInt(formData.motherAge) : null,
          height: formData.height ? parseFloat(formData.height) : null,
          weight: formData.weight ? parseFloat(formData.weight) : null,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save profile');
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleDeficiency = (id: string) => {
    setFormData(prev => {
      let newDeficiencies = [...prev.deficiencies];

      if (id === 'not_sure') {
        // If selecting "not sure", clear others
        newDeficiencies = newDeficiencies.includes('not_sure') ? [] : ['not_sure'];
      } else {
        // Remove "not sure" if selecting specific deficiency
        newDeficiencies = newDeficiencies.filter(d => d !== 'not_sure');

        if (newDeficiencies.includes(id)) {
          newDeficiencies = newDeficiencies.filter(d => d !== id);
        } else {
          newDeficiencies.push(id);
        }
      }

      return { ...prev, deficiencies: newDeficiencies };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <Heart className="w-12 h-12 text-pink-500 mx-auto animate-pulse" fill="#ec4899" />
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">Profile Settings</h1>
                <p className="text-xs text-gray-500">Update your information</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : saved ? (
              <Check className="w-5 h-5" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Personal Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-purple-500" />
            Personal Information
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Jane Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <input
                type="number"
                value={formData.motherAge}
                onChange={(e) => setFormData({ ...formData, motherAge: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="28"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-500" />
            Location
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="Canada">Canada</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Toronto"
              />
            </div>
          </div>
        </div>

        {/* Pregnancy Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            Pregnancy Information
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pregnancy Month</label>
              <select
                value={formData.pregnancyMonth}
                onChange={(e) => setFormData({ ...formData, pregnancyMonth: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((month) => (
                  <option key={month} value={month}>Month {month}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pregnancy Type</label>
              <select
                value={formData.pregnancyType}
                onChange={(e) => setFormData({ ...formData, pregnancyType: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {pregnancyTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">This is pregnancy #</label>
              <select
                value={formData.pregnancyCount}
                onChange={(e) => setFormData({ ...formData, pregnancyCount: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value={1}>1st (First)</option>
                <option value={2}>2nd</option>
                <option value={3}>3rd</option>
                <option value={4}>4th or more</option>
              </select>
            </div>
          </div>
        </div>

        {/* Physical Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Scale className="w-5 h-5 text-purple-500" />
            Physical Information
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="165"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pre-pregnancy Weight (kg)</label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="60"
              />
            </div>
          </div>
        </div>

        {/* Diet Preferences */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-purple-500" />
            Diet Preferences
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Diet Type</label>
            <select
              value={formData.dietPreference}
              onChange={(e) => setFormData({ ...formData, dietPreference: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {dietOptions.map((diet) => (
                <option key={diet.value} value={diet.value}>{diet.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Nutritional Deficiencies */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Nutritional Focus Areas</h2>
          <p className="text-sm text-gray-500 mb-4">
            Select any deficiencies you're aware of, or choose "Not Sure" for a balanced approach.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {deficiencyOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = formData.deficiencies.includes(option.id);
              const colorClasses: Record<string, string> = {
                red: 'bg-red-100 border-red-300 text-red-700',
                blue: 'bg-blue-100 border-blue-300 text-blue-700',
                purple: 'bg-purple-100 border-purple-300 text-purple-700',
                amber: 'bg-amber-100 border-amber-300 text-amber-700',
                orange: 'bg-orange-100 border-orange-300 text-orange-700',
                green: 'bg-green-100 border-green-300 text-green-700',
                gray: 'bg-gray-100 border-gray-300 text-gray-700',
              };

              return (
                <button
                  key={option.id}
                  onClick={() => toggleDeficiency(option.id)}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    isSelected
                      ? colorClasses[option.color]
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{option.label}</span>
                  </div>
                  <p className="text-xs opacity-75">{option.hint}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Save Button (Mobile) */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 transition-all md:hidden"
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : saved ? (
            <Check className="w-5 h-5" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </main>
    </div>
  );
}
