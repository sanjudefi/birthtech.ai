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
  MapPin,
  Globe,
  Users,
  Droplets,
  Bone,
  Brain,
  Sun,
  Egg,
  Leaf,
  HelpCircle,
} from 'lucide-react';

const STEPS = [
  { number: 1, title: 'About You', icon: UserRound },
  { number: 2, title: 'Pregnancy', icon: Baby },
  { number: 3, title: 'Physical', icon: Scale },
  { number: 4, title: 'Diet', icon: Utensils },
  { number: 5, title: 'Health Support', icon: Stethoscope },
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

const countries = [
  'Canada', 'United States', 'United Kingdom', 'India', 'Australia',
  'Germany', 'France', 'UAE', 'Singapore', 'Other'
];

const languages = ['English', 'French', 'Hindi', 'Spanish', 'Arabic', 'Mandarin', 'Tamil', 'Punjabi'];

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', "Don't know"];

const deficiencyOptions = [
  { id: 'iron', label: 'Iron', icon: Droplets, color: 'red', hint: 'Low energy, dizziness, pale skin' },
  { id: 'calcium', label: 'Calcium', icon: Bone, color: 'blue', hint: 'Bone & teeth support for baby' },
  { id: 'b12', label: 'Vitamin B12', icon: Brain, color: 'purple', hint: 'Fatigue, weakness' },
  { id: 'vitamin_d', label: 'Vitamin D', icon: Sun, color: 'amber', hint: 'Muscle weakness, bone pain' },
  { id: 'protein', label: 'Protein', icon: Egg, color: 'orange', hint: 'Baby growth & development' },
  { id: 'folate', label: 'Folate', icon: Leaf, color: 'green', hint: 'Neural tube development' },
  { id: 'not_sure', label: "Not Sure", icon: HelpCircle, color: 'gray', hint: "We'll create a balanced plan" },
];

const commonAllergies = ['Peanuts', 'Tree Nuts', 'Dairy', 'Eggs', 'Shellfish', 'Soy', 'Wheat/Gluten', 'Fish'];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [allergyInput, setAllergyInput] = useState('');

  const [formData, setFormData] = useState({
    // Step 1: About You
    fullName: '',
    motherAge: '',
    country: 'Canada',
    city: '',
    preferredLanguages: ['English'] as string[],

    // Step 2: Pregnancy Info
    pregnancyMonth: 0,
    dueDate: '',
    pregnancyType: 'single',
    pregnancyCount: 1,

    // Step 3: Physical Details
    heightCm: '',
    weightKg: '',
    prePregnancyWeight: '',
    bloodType: '',

    // Step 4: Diet
    dietPreference: 'non-veg',
    allergies: [] as string[],
    foodAversions: [] as string[],

    // Step 5: Health Support (Deficiencies)
    deficiencies: [] as string[],
    existingConditions: [] as string[],
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);

  const toggleLanguage = (lang: string) => {
    if (formData.preferredLanguages.includes(lang)) {
      if (formData.preferredLanguages.length > 1) {
        setFormData({
          ...formData,
          preferredLanguages: formData.preferredLanguages.filter((l) => l !== lang),
        });
      }
    } else {
      setFormData({
        ...formData,
        preferredLanguages: [...formData.preferredLanguages, lang],
      });
    }
  };

  const toggleDeficiency = (defId: string) => {
    if (defId === 'not_sure') {
      setFormData({ ...formData, deficiencies: ['not_sure'] });
      return;
    }

    let newDeficiencies = formData.deficiencies.filter(d => d !== 'not_sure');

    if (newDeficiencies.includes(defId)) {
      newDeficiencies = newDeficiencies.filter((d) => d !== defId);
    } else {
      newDeficiencies = [...newDeficiencies, defId];
    }

    setFormData({ ...formData, deficiencies: newDeficiencies });
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

  const addCustomAllergy = () => {
    if (allergyInput.trim() && !formData.allergies.includes(allergyInput.trim())) {
      setFormData({
        ...formData,
        allergies: [...formData.allergies, allergyInput.trim()],
      });
      setAllergyInput('');
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.fullName && formData.country;
      case 2:
        return formData.pregnancyMonth > 0 && formData.dueDate;
      case 3:
        return true;
      case 4:
        return true;
      case 5:
        return true;
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
          motherAge: formData.motherAge ? parseInt(formData.motherAge) : null,
          heightCm: formData.heightCm ? parseFloat(formData.heightCm) : null,
          weightKg: formData.weightKg ? parseFloat(formData.weightKg) : null,
          prePregnancyWeight: formData.prePregnancyWeight ? parseFloat(formData.prePregnancyWeight) : null,
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

  const getDeficiencyColor = (color: string) => {
    const colors: Record<string, string> = {
      red: 'from-red-500 to-rose-500',
      blue: 'from-blue-500 to-cyan-500',
      purple: 'from-purple-500 to-violet-500',
      amber: 'from-amber-500 to-yellow-500',
      orange: 'from-orange-500 to-amber-500',
      green: 'from-green-500 to-emerald-500',
      gray: 'from-gray-500 to-slate-500',
    };
    return colors[color] || colors.gray;
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
          <h1 className="text-2xl font-bold text-gray-900">Welcome, Mama!</h1>
          <p className="text-gray-600 mt-2">
            Let's create your personalized care plan together.
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

          {/* Step 1: About You */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                  <UserRound className="w-6 h-6 text-pink-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Tell us about yourself</h2>
                  <p className="text-gray-500 text-sm">We're here to support you</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Sarah Johnson"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Age
                </label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="28"
                  value={formData.motherAge}
                  onChange={(e) => setFormData({ ...formData, motherAge: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Country *
                  </label>
                  <select
                    className="input-field"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  >
                    {countries.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Toronto"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Globe className="w-4 h-4 inline mr-1" />
                  Preferred Languages
                </label>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      className={`px-4 py-2 rounded-full text-sm transition-all ${
                        formData.preferredLanguages.includes(lang)
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Pregnancy Info */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Baby className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Your Pregnancy Journey</h2>
                  <p className="text-gray-500 text-sm">Every journey is beautiful</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Users className="w-4 h-4 inline mr-1" />
                  Pregnancy Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'single', label: 'Single Baby' },
                    { value: 'twins', label: 'Twins' },
                    { value: 'triplets', label: 'Triplets+' },
                  ].map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, pregnancyType: type.value })}
                      className={`p-3 rounded-xl text-center transition-all ${
                        formData.pregnancyType === type.value
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Which pregnancy is this?
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData({ ...formData, pregnancyCount: num })}
                      className={`w-14 h-14 rounded-xl font-medium transition-all ${
                        formData.pregnancyCount === num
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {num === 4 ? '4th+' : `${num}${num === 1 ? 'st' : num === 2 ? 'nd' : 'rd'}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Physical Details */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Scale className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Physical Details</h2>
                  <p className="text-gray-500 text-sm">Helps us personalize your nutrition</p>
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

          {/* Step 4: Diet */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Utensils className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Diet Preferences</h2>
                  <p className="text-gray-500 text-sm">We'll customize your meal plans</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Diet Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'veg', label: 'Vegetarian', desc: 'No meat or fish' },
                    { value: 'egg', label: 'Eggetarian', desc: 'Veg + Eggs' },
                    { value: 'non-veg', label: 'Non-Veg', desc: 'All foods' },
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
                      <div className="font-medium">{diet.label}</div>
                      <div className="text-xs opacity-75 mt-1">{diet.desc}</div>
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
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomAllergy())}
                  />
                  <button
                    type="button"
                    onClick={addCustomAllergy}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
                  >
                    Add
                  </button>
                </div>
                {formData.allergies.filter(a => !commonAllergies.includes(a)).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.allergies.filter(a => !commonAllergies.includes(a)).map((allergy) => (
                      <span
                        key={allergy}
                        className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
                      >
                        {allergy}
                        <button onClick={() => toggleAllergy(allergy)}>
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Health Support (Deficiencies) */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Health Support</h2>
                  <p className="text-gray-500 text-sm">Let us know how we can help</p>
                </div>
              </div>

              {/* Deficiencies Section */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Common Pregnancy Deficiencies
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Select if you've been told you're low in any of these, or if you experience related symptoms.
                  This helps us create better meal plans for you.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {deficiencyOptions.map((def) => {
                    const Icon = def.icon;
                    const isSelected = formData.deficiencies.includes(def.id);

                    return (
                      <button
                        key={def.id}
                        type="button"
                        onClick={() => toggleDeficiency(def.id)}
                        className={`p-4 rounded-xl text-left transition-all border-2 ${
                          isSelected
                            ? `border-transparent bg-gradient-to-r ${getDeficiencyColor(def.color)} text-white shadow-lg`
                            : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-white/20' : 'bg-gray-100'
                          }`}>
                            <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium flex items-center gap-2">
                              {def.label}
                              {isSelected && <Check className="w-4 h-4" />}
                            </div>
                            <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                              {def.hint}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  You can update this anytime in your profile settings
                </p>
              </div>

              {/* Summary Preview */}
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-semibold">Your Personalized Care Plan</h3>
                </div>
                <p className="text-sm text-purple-100 mb-4">
                  Based on your profile, we'll create:
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Daily meal plans for Month {formData.pregnancyMonth || '?'}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    {formData.deficiencies.length > 0
                      ? `Nutrition focused on ${formData.deficiencies.filter(d => d !== 'not_sure').join(', ') || 'balanced nutrition'}`
                      : 'Balanced nutrition for your needs'}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    {formData.dietPreference === 'veg' ? 'Vegetarian' : formData.dietPreference === 'egg' ? 'Eggetarian' : 'Non-veg'} recipes
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    AI companion available 24/7
                  </li>
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
            - You can update later
          </p>
        )}
      </div>
    </div>
  );
}
