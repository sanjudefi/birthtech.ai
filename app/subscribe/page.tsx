'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Heart, CheckCircle, Loader2, Shield } from 'lucide-react';

const plans = [
  {
    id: 'basic',
    name: 'Basic Care',
    price: 10,
    features: [
      'Daily meal recommendations',
      'Exercise & hydration reminders',
      'Weekly calendar view',
      'Basic wellness tips',
    ],
  },
  {
    id: 'premium',
    name: 'Premium Care',
    price: 20,
    popular: true,
    features: [
      'Everything in Basic',
      'Weekly grocery shopping list',
      'Monthly essential nutrients guide',
      'Personalized safety reminders',
      'Priority support',
    ],
  },
];

function SubscribeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPlan = searchParams.get('plan') || 'premium';

  const [selectedPlan, setSelectedPlan] = useState(preselectedPlan);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);

  const handleSubscribe = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/subscription/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planType: selectedPlan }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        // For demo, redirect to onboarding
        router.push('/onboarding');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm text-center max-w-md mx-auto">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className={`card cursor-pointer transition-all ${
              selectedPlan === plan.id
                ? 'border-2 border-purple-500 ring-4 ring-purple-100'
                : 'border-2 border-transparent hover:border-gray-200'
            } ${plan.popular ? 'relative' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-medium px-4 py-1 rounded-full">
                Most Popular
              </div>
            )}

            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === plan.id
                    ? 'border-purple-500 bg-purple-500'
                    : 'border-gray-300'
                }`}
              >
                {selectedPlan === plan.id && (
                  <CheckCircle className="w-4 h-4 text-white" />
                )}
              </div>
            </div>

            <ul className="space-y-3">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="btn-primary text-lg py-4 px-12 inline-flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            `Subscribe to ${selectedPlan === 'basic' ? 'Basic' : 'Premium'} - $${
              selectedPlan === 'basic' ? '10' : '20'
            }/month`
          )}
        </button>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
          <Shield className="w-4 h-4" />
          Secure payment powered by Stripe. Cancel anytime.
        </div>
      </div>
    </>
  );
}

export default function SubscribePage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Heart className="w-8 h-8 text-pink-500" fill="#ec4899" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              BirthTech.ai
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Plan</h1>
          <p className="text-gray-600">
            Select the plan that works best for your pregnancy journey
          </p>
        </div>

        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        }>
          <SubscribeContent />
        </Suspense>
      </div>
    </div>
  );
}
