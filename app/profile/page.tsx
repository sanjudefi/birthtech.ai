'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ArrowLeft, Loader2, X, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [allergyInput, setAllergyInput] = useState('');

  const [formData, setFormData] = useState({
    pregnancyMonth: 0,
    dueDate: '',
    heightCm: '',
    weightKg: '',
    dietPreference: 'non-veg',
    allergies: [] as string[],
  });

  const months = [
    { value: 1, label: 'Month 1', weeks: 'Weeks 1-4' },
    { value: 2, label: 'Month 2', weeks: 'Weeks 5-8' },
    { value: 3, label: 'Month 3', weeks: 'Weeks 9-13' },
    { value: 4, label: 'Month 4', weeks: 'Weeks 14-17' },
    { value: 5, label: 'Month 5', weeks: 'Weeks 18-22' },
    { value: 6, label: 'Month 6', weeks: 'Weeks 23-27' },
    { value: 7, label: 'Month 7', weeks: 'Weeks 28-31' },
    { value: 8, label: 'Month 8', weeks: 'Weeks 32-35' },
    { value: 9, label: 'Month 9', weeks: 'Weeks 36-40' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // Fetch profile
    fetch('/api/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          router.push('/onboarding');
          return;
        }
        setFormData({
          pregnancyMonth: data.pregnancyMonth,
          dueDate: data.dueDate?.split('T')[0] || '',
          heightCm: data.heightCm?.toString() || '',
          weightKg: data.weightKg?.toString() || '',
          dietPreference: data.dietPreference || 'non-veg',
          allergies: data.allergies || [],
        });
        setLoading(false);
      })
      .catch(() => {
        router.push('/onboarding');
      });
  }, [router]);

  const addAllergy = () => {
    if (allergyInput.trim() && !formData.allergies.includes(allergyInput.trim())) {
      setFormData({
        ...formData,
        allergies: [...formData.allergies, allergyInput.trim()],
      });
      setAllergyInput('');
    }
  };

  const removeAllergy = (allergy: string) => {
    setFormData({
      ...formData,
      allergies: formData.allergies.filter((a) => a !== allergy),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          heightCm: formData.heightCm ? parseFloat(formData.heightCm) : null,
          weightKg: formData.weightKg ? parseFloat(formData.weightKg) : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-white rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
            <p className="text-gray-600">Update your pregnancy information</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 p-4 rounded-xl mb-6 text-sm flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="card space-y-6">
          {/* Pregnancy Month */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Current Pregnancy Month
            </label>
            <div className="grid grid-cols-3 gap-2">
              {months.map((month) => (
                <button
                  key={month.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, pregnancyMonth: month.value })}
                  className={`p-3 rounded-xl text-center transition-all ${
                    formData.pregnancyMonth === month.value
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium">{month.label}</div>
                  <div className="text-xs opacity-75">{month.weeks}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Due Date
            </label>
            <input
              type="date"
              className="input-field"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          {/* Height & Weight */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                className="input-field"
                placeholder="165"
                value={formData.heightCm}
                onChange={(e) => setFormData({ ...formData, heightCm: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                className="input-field"
                placeholder="60"
                value={formData.weightKg}
                onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
              />
            </div>
          </div>

          {/* Diet Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Diet Preference
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'non-veg', label: 'Non-Veg' },
                { value: 'veg', label: 'Vegetarian' },
                { value: 'vegan', label: 'Vegan' },
              ].map((diet) => (
                <button
                  key={diet.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, dietPreference: diet.value })}
                  className={`p-3 rounded-xl text-center transition-all ${
                    formData.dietPreference === diet.value
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {diet.label}
                </button>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Food Allergies
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                className="input-field flex-1"
                placeholder="e.g., Peanuts, Shellfish"
                value={allergyInput}
                onChange={(e) => setAllergyInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
              />
              <button
                type="button"
                onClick={addAllergy}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
              >
                Add
              </button>
            </div>

            {formData.allergies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.allergies.map((allergy) => (
                  <span
                    key={allergy}
                    className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                  >
                    {allergy}
                    <button type="button" onClick={() => removeAllergy(allergy)}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Link
              href="/dashboard"
              className="btn-secondary flex-1 text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
