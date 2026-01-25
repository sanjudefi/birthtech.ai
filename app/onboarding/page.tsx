'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Loader2, ChevronRight, ChevronLeft, X } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [allergyInput, setAllergyInput] = useState('');

  const [formData, setFormData] = useState({
    pregnancyMonth: 0,
    dueDate: '',
    heightCm: '',
    weightKg: '',
    dietPreference: 'non-veg',
    allergies: [] as string[],
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);

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

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/profile', {
        method: 'POST',
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
        throw new Error(data.error || 'Failed to save profile');
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Heart className="w-8 h-8 text-pink-500" fill="#ec4899" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              BirthTech.ai
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Let's Get to Know You</h1>
          <p className="text-gray-600 mt-2">
            Tell us about your pregnancy so we can personalize your care
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full ${
                s === step ? 'bg-purple-500' : s < step ? 'bg-purple-300' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <div className="card">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Pregnancy Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Pregnancy Information</h2>

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

              <button
                onClick={() => setStep(2)}
                disabled={!formData.pregnancyMonth || !formData.dueDate}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Step 2: Physical Info */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Your Details</h2>

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

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="btn-secondary flex-1 flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Allergies */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Food Allergies (Optional)</h2>
              <p className="text-sm text-gray-600">
                Add any food allergies so we can customize your meal recommendations
              </p>

              <div>
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
                  <div className="flex flex-wrap gap-2 mt-4">
                    {formData.allergies.map((allergy) => (
                      <span
                        key={allergy}
                        className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                      >
                        {allergy}
                        <button onClick={() => removeAllergy(allergy)}>
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="btn-secondary flex-1 flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Start My Journey'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
