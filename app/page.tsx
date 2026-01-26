'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  Calendar,
  Utensils,
  Shield,
  CheckCircle,
  Star,
  Users,
  Sparkles,
  Clock,
  Award,
  ChevronRight,
  X,
} from 'lucide-react';

// Cookie Consent Banner Component
function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-300">
          We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
        </p>
        <div className="flex items-center gap-3">
          <Link href="/privacy" className="text-sm text-purple-400 hover:text-purple-300 underline">
            Learn more
          </Link>
          <button
            onClick={acceptCookies}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://thebirthtech.com/wp-content/uploads/2017/06/birthtechlogo-2.png"
              alt="BirthTech Logo"
              width={140}
              height={40}
              className="h-10 w-auto"
              unoptimized
            />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-gray-600 hover:text-purple-600 font-medium">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-purple-600 font-medium">
              Pricing
            </Link>
            <Link href="/products" className="text-gray-600 hover:text-purple-600 font-medium">
              Products
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-gray-600 hover:text-purple-600 font-medium">
              Sign In
            </Link>
            <Link href="/auth/signup" className="btn-primary text-sm py-2 px-4">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-pink-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4" fill="#7c3aed" />
            Trusted by 1,000+ mothers
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Your AI Companion for a{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Healthy Pregnancy
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Personalized daily care plans, nutrition guidance, and wellness tips crafted just for you.
            Like having a caring partner and expert dietitian by your side, 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="btn-primary text-lg py-4 px-8 flex items-center justify-center gap-2">
              Start Your Journey – $9.99/month
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link href="#features" className="btn-secondary text-lg py-4 px-8">
              Learn More
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500" />
              <span>1,000+ mothers</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-500" />
              <span>Simple plans</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-500" />
              <span>Easy to follow</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" fill="#ef4444" />
              <span>Designed with care</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Everything You Need for a Healthy Pregnancy
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Personalized care plans based on your pregnancy stage, dietary preferences, and health goals.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="care-card text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-8 h-8 text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Daily Meal Plans</h3>
              <p className="text-gray-600">
                Personalized breakfast, lunch, dinner, and snack recommendations based on your pregnancy month and dietary needs.
              </p>
            </div>

            <div className="care-card text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Weekly Calendar</h3>
              <p className="text-gray-600">
                Track your daily progress, view upcoming care activities, and stay organized throughout your pregnancy journey.
              </p>
            </div>

            <div className="care-card text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Safety & Wellness</h3>
              <p className="text-gray-600">
                Daily safety reminders, exercise guidance, hydration tracking, and sleep tips tailored to your trimester.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Your Daily Care Includes
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'Personalized meal recommendations',
              'Safe exercise routines & yoga tips',
              'Hydration reminders (8 glasses/day)',
              'Sleep tips for better rest',
              'Daily wellness guidance',
              'Safety notes for your trimester',
              'Weekly grocery shopping list',
              'Nutrition tracking for deficiencies',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-600 text-center mb-12">
            Choose the plan that works best for you
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Monthly Plan */}
            <div className="card border-2 border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Monthly</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-gray-900">$9.99</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-6">
                {[
                  'Personalized daily meal plans',
                  'Weekly workout routines',
                  'Grocery list with PDF export',
                  'Supplement tracking',
                  'AI chat assistant',
                  'Calendar & progress tracking',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup?plan=monthly" className="btn-secondary w-full block text-center">
                Get Started
              </Link>
            </div>

            {/* Annual Plan */}
            <div className="card border-2 border-purple-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-medium px-4 py-1 rounded-full">
                Save 20%
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Annual</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold text-gray-900">$95.88</span>
                <span className="text-gray-500">/year</span>
              </div>
              <p className="text-sm text-green-600 mb-4">Only $7.99/month</p>
              <ul className="space-y-3 mb-6">
                {[
                  'Everything in Monthly plan',
                  '2 months FREE',
                  'Priority support',
                  'Early access to new features',
                  'Exclusive content',
                  'Family sharing (coming soon)',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup?plan=annual" className="btn-primary w-full block text-center">
                Get Annual Plan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gradient-to-b from-pink-50 to-purple-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What Mothers Are Saying
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "Like having a caring friend who knows exactly what I need during pregnancy.",
                name: "Sarah M.",
                location: "Toronto, ON"
              },
              {
                quote: "The meal plans are amazing! Easy to follow and my cravings are under control.",
                name: "Emily R.",
                location: "Vancouver, BC"
              },
              {
                quote: "Finally, an app that understands what expecting mothers actually need.",
                name: "Jessica L.",
                location: "Calgary, AB"
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-amber-400" fill="#fbbf24" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 px-4 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            <Shield className="w-4 h-4 inline-block mr-1" />
            <strong>Medical Disclaimer:</strong> This platform provides wellness and lifestyle guidance only and does not replace professional medical advice. Always consult your healthcare provider for medical decisions.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <Image
                src="https://thebirthtech.com/wp-content/uploads/2017/06/birthtechlogo-2.png"
                alt="BirthTech Logo"
                width={140}
                height={40}
                className="h-10 w-auto mb-4 brightness-0 invert"
                unoptimized
              />
              <p className="text-gray-400 text-sm max-w-md">
                Your trusted AI companion for a healthy pregnancy journey. Personalized care plans, nutrition guidance, and wellness tips.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#features" className="hover:text-white transition-colors">Features</Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-white transition-colors">Products</Link>
                </li>
                <li>
                  <Link href="/auth/login" className="hover:text-white transition-colors">Sign In</Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/disclaimer" className="hover:text-white transition-colors">Medical Disclaimer</Link>
                </li>
                <li>
                  <a
                    href="https://thebirthtech.com/pages/contact-us/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="https://thebirthtech.com/pages/about-us/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    About Us / Team
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © 2026 BirthTech. All rights reserved. Made with love in Canada.
            </p>
            <p className="text-gray-500 text-xs">
              This platform provides wellness guidance only and does not replace professional medical advice.
            </p>
          </div>
        </div>
      </footer>

      {/* Cookie Consent Banner */}
      <CookieConsent />
    </div>
  );
}
