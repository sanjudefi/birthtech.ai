'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ArrowLeft, Sparkles, Bell, Mail } from 'lucide-react';
import { useState } from 'react';

export default function ProductsPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo/BirthTech-V2_Final 2.png"
              alt="BirthTech Logo"
              width={140}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/#features" className="text-gray-600 hover:text-purple-600 font-medium">
              Features
            </Link>
            <Link href="/#pricing" className="text-gray-600 hover:text-purple-600 font-medium">
              Pricing
            </Link>
            <Link href="/auth/signup" className="text-gray-600 hover:text-purple-600 font-medium">
              Get Started
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-gray-600 hover:text-purple-600 font-medium">
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Coming Soon Section */}
          <div className="bg-white rounded-3xl shadow-xl p-12 mt-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-purple-600" />
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Products Coming Soon
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              We're working on exciting new products to support your pregnancy journey.
              Subscribe to our platform to get early access and exclusive offers when they launch!
            </p>

            {/* Current Offering */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Available Now: BirthTech Premium
              </h2>
              <p className="text-gray-600 mb-6">
                Get personalized AI-powered meal plans, workout routines, medical report analysis,
                and expert guidance throughout your pregnancy journey.
              </p>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                <Heart className="w-5 h-5" />
                Start Your Journey
              </Link>
            </div>

            {/* Notify Me */}
            <div className="border-t border-gray-100 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center gap-2">
                <Bell className="w-5 h-5 text-purple-600" />
                Get Notified About New Products
              </h3>

              {submitted ? (
                <div className="bg-green-50 text-green-700 rounded-xl p-4 max-w-md mx-auto">
                  <p className="font-medium">Thank you! We'll notify you when new products launch.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                  >
                    Notify Me
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-pink-500" fill="#ec4899" />
              <span className="font-semibold text-gray-900">BirthTech</span>
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} BirthTech. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
