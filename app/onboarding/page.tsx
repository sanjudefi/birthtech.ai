'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  Loader2,
  ChevronRight,
  ChevronLeft,
  X,
  Baby,
  Scale,
  Stethoscope,
  Utensils,
  UserRound,
  Check,
  Sparkles,
} from 'lucide-react';

const STEPS = [
  { number: 1, title: 'Pregnancy Info', icon: Baby },
  { number: 2, title: 'Physical Details', icon: Scale },
  { number: 3, title: 'Health History', icon: Stethoscope },
  { number: 4, title: 'Diet & Lifestyle', icon: Utensils },
  { number: 5, title: 'Doctor Info', icon: UserRound },
];

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

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', "Don't know"];

const commonConditions = [
  'Gestational Diabetes',
  'Hypertension',
  'Thyroid Issues',
  'Anemia',
  'Asthma',
  'Heart Condition',
  'Kidney Issues',
  'None',
];

const commonAllergies = ['Peanuts', 'Tree Nuts', 'Dairy', 'Eggs', 'Shellfish', 'Soy', 'Wheat/Gluten', 'Fish'];

const exerciseLevels = [
  { value: 'none', label: 'None', desc: 'No regular exercise' },
  { value: 'light', label: 'Light', desc: '1-2 times/week' },
  { value: 'moderate', label: 'Moderate', desc: '3-4 times/week' },
  { value: 'active', label: 'Active', desc: '5+ times/week' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Input helpers
  const [allergyInput, setAllergyInput] = useState('');
  const [aversionInput, setAversionInput] = useState('');
  const [medicationInput, setMedicationInput] = useState('');

  const [formData, setFormData] = useState({
    // Step 1: Pregnancy Info
    pregnancyMonth: 0,
    dueDate: '',
    lastPeriodDate: '',
    previousPregnancies: 0,

    // Step 2: Physical Details
    heightCm: '',
    weightKg: '',
    prePregnancyWeight: '',
    bloodType: '',

    // Step 3: Health History
    existingConditions: [] as string[],
    currentMedications: [] as string[],
    complications: [] as string[],

    // Step 4: Diet & Lifestyle
    dietPreference: 'non-veg',
    allergies: [] as string[],
    foodAversions: [] as string[],
    exerciseLevel: 'moderate',
    sleepHours: '',
    waterIntakeGoal: 8,

    // Step 5: Doctor Info
    doctorName: '',
    doctorPhone: '',
    hospitalName: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);

  const addToList = (field: 'allergies' | 'foodAversions' | 'currentMedications', value: string) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData({
        ...formData,
        [field]: [...formData[field], value.trim()],
      });
    }
  };

  const removeFromList = (field: 'allergies' | 'foodAversions' | 'currentMedications' | 'existingConditions', value: string) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((item) => item !== value),
    });
  };

  const toggleCondition = (condition: string) => {
    if (condition === 'None') {
      setFormData({ ...formData, existingConditions: [] });
      return;
    }
    if (formData.existingConditions.includes(condition)) {
      setFormData({
        ...formData,
        existingConditions: formData.existingConditions.filter((c) => c !== condition),
      });
    } else {
      setFormData({
        ...formData,
        existingConditions: [...formData.existingConditions.filter((c) => c !== 'None'), condition],
      });
    }
  };

  const toggleAllergy = (allergy: string) => {
    if (formData.allergies.includes(allergy)) {
      setFormData({
        ...formData,
        allergies: formData.allergies.filter((a) => a !== allergy),
      });
    } else {
      setFormData({
        ...formData,
        allergies: [...formData.allergies, allergy],
      });
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.pregnancyMonth > 0 && formData.dueDate;
      case 2:
        return true; // Physical details are optional
      case 3:
        return true; // Health history is optional
      case 4:
        return true; // Diet info has defaults
      case 5:
        return true; // Doctor info is optional
      default:
        return true;
    }
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
          prePregnancyWeight: formData.prePregnancyWeight ? parseFloat(formData.prePregnancyWeight) : null,
          sleepHours: formData.sleepHours ? parseFloat(formData.sleepHours) : null,
          bloodType: formData.bloodType === "Don't know" ? null : formData.bloodType,
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
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-pink-500" fill="#ec4899" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              BirthTech.ai
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to Your Pregnancy Journey</h1>
          <p className="text-gray-600 mt-2">
            Let's personalize your care plan. This only takes a few minutes.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 px-2">
          {STEPS.map((s, index) => {
            const Icon = s.icon;
            const isCompleted = step > s.number;
            const isCurrent = step === s.number;

            return (
              <div key={s.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isCurrent
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span
                    className={`text-xs mt-1 hidden sm:block ${
                      isCurrent ? 'text-purple-600 font-medium' : 'text-gray-400'
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-8 sm:w-16 h-0.5 mx-1 ${
                      step > s.number ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Pregnancy Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                  <Baby className="w-6 h-6 text-pink-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Pregnancy Information</h2>
                  <p className="text-gray-500 text-sm">Tell us about your pregnancy</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Current Pregnancy Month *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {months.map((month) => (
                    <button
                      key={month.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, pregnancyMonth: month.value })}
                      className={`p-3 rounded-xl text-center transition-all ${
                        formData.pregnancyMonth === month.value
                          ? 'bg-purple-500 text-white shadow-md'
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
                  Expected Due Date *
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Menstrual Period (LMP)
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={formData.lastPeriodDate}
                  onChange={(e) => setFormData({ ...formData, lastPeriodDate: e.target.value })}
                />
                <p className="text-xs text-gray-400 mt-1">Optional - helps us calculate more accurate dates</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Previous Pregnancies
                </label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData({ ...formData, previousPregnancies: num })}
                      className={`w-12 h-12 rounded-xl font-medium transition-all ${
                        formData.previousPregnancies === num
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {num === 4 ? '4+' : num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Physical Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Scale className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Physical Details</h2>
                  <p className="text-gray-500 text-sm">Helps us personalize nutrition recommendations</p>
                </div>
              </div>

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
                    Current Weight (kg)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="62"
                    value={formData.weightKg}
                    onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pre-Pregnancy Weight (kg)
                </label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="58"
                  value={formData.prePregnancyWeight}
                  onChange={(e) => setFormData({ ...formData, prePregnancyWeight: e.target.value })}
                />
                <p className="text-xs text-gray-400 mt-1">Optional - helps track healthy weight gain</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Blood Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {bloodTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, bloodType: type })}
                      className={`p-3 rounded-xl text-center transition-all ${
                        formData.bloodType === type
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Health History */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Health History</h2>
                  <p className="text-gray-500 text-sm">Helps us provide safe recommendations</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Existing Health Conditions
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {commonConditions.map((condition) => (
                    <button
                      key={condition}
                      type="button"
                      onClick={() => toggleCondition(condition)}
                      className={`p-3 rounded-xl text-sm text-left flex items-center gap-2 transition-all ${
                        (condition === 'None' && formData.existingConditions.length === 0) ||
                        formData.existingConditions.includes(condition)
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center ${
                          (condition === 'None' && formData.existingConditions.length === 0) ||
                          formData.existingConditions.includes(condition)
                            ? 'border-white bg-white/20'
                            : 'border-gray-300'
                        }`}
                      >
                        {((condition === 'None' && formData.existingConditions.length === 0) ||
                          formData.existingConditions.includes(condition)) && (
                          <Check className="w-3 h-3" />
                        )}
                      </div>
                      {condition}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Medications
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="input-field flex-1"
                    placeholder="e.g., Prenatal vitamins, Iron supplements"
                    value={medicationInput}
                    onChange={(e) => setMedicationInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToList('currentMedications', medicationInput);
                        setMedicationInput('');
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addToList('currentMedications', medicationInput);
                      setMedicationInput('');
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
                  >
                    Add
                  </button>
                </div>
                {formData.currentMedications.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.currentMedications.map((med) => (
                      <span
                        key={med}
                        className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                      >
                        {med}
                        <button onClick={() => removeFromList('currentMedications', med)}>
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Diet & Lifestyle */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Utensils className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Diet & Lifestyle</h2>
                  <p className="text-gray-500 text-sm">Customize your meal plans and recommendations</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Diet Preference
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'non-veg', label: 'Non-Veg', emoji: '' },
                    { value: 'veg', label: 'Vegetarian', emoji: '' },
                    { value: 'vegan', label: 'Vegan', emoji: '' },
                  ].map((diet) => (
                    <button
                      key={diet.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, dietPreference: diet.value })}
                      className={`p-4 rounded-xl text-center transition-all ${
                        formData.dietPreference === diet.value
                          ? 'bg-purple-500 text-white shadow-md'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-2xl mb-1">{diet.emoji}</span>
                      <div className="font-medium">{diet.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Food Allergies
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {commonAllergies.map((allergy) => (
                    <button
                      key={allergy}
                      type="button"
                      onClick={() => toggleAllergy(allergy)}
                      className={`px-3 py-2 rounded-full text-sm transition-all ${
                        formData.allergies.includes(allergy)
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {allergy}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="input-field flex-1"
                    placeholder="Add other allergies..."
                    value={allergyInput}
                    onChange={(e) => setAllergyInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToList('allergies', allergyInput);
                        setAllergyInput('');
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addToList('allergies', allergyInput);
                      setAllergyInput('');
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Food Aversions
                </label>
                <p className="text-xs text-gray-400 mb-2">Foods you can't stand right now</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="input-field flex-1"
                    placeholder="e.g., Eggs, Coffee, Fish..."
                    value={aversionInput}
                    onChange={(e) => setAversionInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToList('foodAversions', aversionInput);
                        setAversionInput('');
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addToList('foodAversions', aversionInput);
                      setAversionInput('');
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
                  >
                    Add
                  </button>
                </div>
                {formData.foodAversions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.foodAversions.map((aversion) => (
                      <span
                        key={aversion}
                        className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm"
                      >
                        {aversion}
                        <button onClick={() => removeFromList('foodAversions', aversion)}>
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Exercise Level
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {exerciseLevels.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, exerciseLevel: level.value })}
                      className={`p-3 rounded-xl text-left transition-all ${
                        formData.exerciseLevel === level.value
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-medium">{level.label}</div>
                      <div className="text-xs opacity-75">{level.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sleep (hours/night)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="8"
                    value={formData.sleepHours}
                    onChange={(e) => setFormData({ ...formData, sleepHours: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Water Goal (glasses/day)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="8"
                    value={formData.waterIntakeGoal}
                    onChange={(e) => setFormData({ ...formData, waterIntakeGoal: parseInt(e.target.value) || 8 })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Doctor Info */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <UserRound className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Your Care Team</h2>
                  <p className="text-gray-500 text-sm">Optional - for your reference</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor/Midwife Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Dr. Smith"
                  value={formData.doctorName}
                  onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor's Phone
                </label>
                <input
                  type="tel"
                  className="input-field"
                  placeholder="+1 (555) 123-4567"
                  value={formData.doctorPhone}
                  onChange={(e) => setFormData({ ...formData, doctorPhone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hospital/Clinic Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="City General Hospital"
                  value={formData.hospitalName}
                  onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                />
              </div>

              {/* Summary Preview */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <h3 className="font-semibold text-gray-900">Ready to Start!</h3>
                </div>
                <p className="text-sm text-gray-600">
                  We'll create a personalized care plan based on your profile:
                </p>
                <ul className="mt-2 text-sm text-gray-600 space-y-1">
                  <li>• Daily meal plans tailored to Month {formData.pregnancyMonth}</li>
                  <li>• Safe exercise routines for your fitness level</li>
                  <li>• Personalized nutrition tips for your diet ({formData.dietPreference})</li>
                  <li>• AI companion available 24/7 for questions</li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="btn-secondary flex-1 flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
            )}
            {step < 5 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Your Plan...
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5" />
                    Start My Journey
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Skip option */}
        {step < 5 && (
          <p className="text-center text-sm text-gray-500 mt-4">
            <button onClick={() => setStep(step + 1)} className="text-purple-600 hover:underline">
              Skip this step
            </button>{' '}
            • You can always update later
          </p>
        )}
      </div>
    </div>
  );
}
