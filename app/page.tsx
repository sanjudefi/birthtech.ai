'use client';

import Link from 'next/link';
import { Heart, Calendar, Utensils, Shield, CheckCircle, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-pink-500" fill="#ec4899" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              BirthTech.ai
            </span>
          </div>
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
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4" fill="#7c3aed" />
            Trusted by 10,000+ Canadian moms
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Your AI Companion for a{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Healthy Pregnancy
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Personalized daily care plans, nutrition guidance, and wellness tips crafted just for you.
            Like having a caring partner and expert dietitian by your side, 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="btn-primary text-lg py-4 px-8">
              Start Your Journey - $10/month
            </Link>
            <Link href="#features" className="btn-secondary text-lg py-4 px-8">
              Learn More
            </Link>
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
            Our AI creates personalized care plans based on your pregnancy stage, dietary preferences, and health goals.
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
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Your Daily Care Includes
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'Personalized meal recommendations',
              'Exercise minutes & gentle yoga tips',
              'Hydration reminders (8 glasses/day)',
              'Sleep tips for better rest',
              'Daily wellness guidance',
              'Safety notes for your trimester',
              'Weekly grocery shopping list',
              'Monthly essential nutrients guide',
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
            Simple, Affordable Pricing
          </h2>
          <p className="text-gray-600 text-center mb-12">
            Choose the plan that works best for you
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Basic Plan */}
            <div className="card border-2 border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Basic Care</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-gray-900">$10</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-6">
                {[
                  'Daily meal recommendations',
                  'Exercise & hydration reminders',
                  'Weekly calendar view',
                  'Basic wellness tips',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup?plan=basic" className="btn-secondary w-full block text-center">
                Get Started
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="card border-2 border-purple-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-medium px-4 py-1 rounded-full">
                Most Popular
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Care</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-gray-900">$20</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-6">
                {[
                  'Everything in Basic',
                  'Weekly grocery shopping list',
                  'Monthly essential nutrients guide',
                  'Personalized safety reminders',
                  'Priority support',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup?plan=premium" className="btn-primary w-full block text-center">
                Get Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            <Shield className="w-4 h-4 inline-block mr-1" />
            <strong>Disclaimer:</strong> BirthTech.ai provides general wellness guidance only, not medical advice.
            Always consult your healthcare provider for medical decisions.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-pink-500" fill="#ec4899" />
              <span className="font-bold">BirthTech.ai</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2026 BirthTech.ai. Made with love in Canada.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white">Privacy</Link>
              <Link href="/terms" className="hover:text-white">Terms</Link>
              <Link href="/contact" className="hover:text-white">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
