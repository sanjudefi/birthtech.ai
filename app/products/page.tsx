'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  ArrowLeft,
  Watch,
  Armchair,
  Wifi,
  Activity,
  Bell,
  Smartphone,
  Shield,
  Star,
  Check,
  ChevronRight,
  Mail,
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: string;
  image: string;
  icon: any;
  color: string;
  features: string[];
  status: 'coming_soon' | 'available';
  badge?: string;
}

const products: Product[] = [
  {
    id: 'motherwatch',
    name: 'MotherWatch',
    tagline: 'Smart Wearable for Mother & Baby',
    description: 'Advanced wearable technology that monitors vital signs for both mother and baby during pregnancy. Syncs seamlessly with the BirthTech platform for real-time health insights and alerts.',
    price: '$299',
    image: '⌚',
    icon: Watch,
    color: 'from-purple-500 to-pink-500',
    status: 'coming_soon',
    badge: 'Coming Soon',
    features: [
      'Real-time heart rate monitoring',
      'Fetal movement tracking',
      'Sleep quality analysis',
      'Contraction timer',
      'Syncs with BirthTech app',
      'Water-resistant design',
      '7-day battery life',
      'Emergency alert system',
    ],
  },
  {
    id: 'birthchair',
    name: 'BirthChair',
    tagline: 'Hospital-Grade Delivery Support',
    description: 'Ergonomically designed delivery chair that provides optimal support and comfort during labor. Integrates with hospital systems and the BirthTech platform for comprehensive birth tracking.',
    price: '$1,499',
    image: '🪑',
    icon: Armchair,
    color: 'from-blue-500 to-cyan-500',
    status: 'coming_soon',
    badge: 'Coming Soon',
    features: [
      'Hospital-grade construction',
      'Multiple position adjustments',
      'Integrated vital monitoring',
      'Partner support design',
      'Syncs with BirthTech platform',
      'Easy to clean materials',
      'Compact folding design',
      'Safety certified',
    ],
  },
];

export default function ProductsPage() {
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleRequestInfo = (product: Product) => {
    setSelectedProduct(product);
    setShowInterestModal(true);
    setSubmitted(false);
    setEmail('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to a backend
    setSubmitted(true);
    setTimeout(() => {
      setShowInterestModal(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
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
            <Link href="/#features" className="text-gray-600 hover:text-purple-600 font-medium">
              Features
            </Link>
            <Link href="/#pricing" className="text-gray-600 hover:text-purple-600 font-medium">
              Pricing
            </Link>
            <Link href="/products" className="text-purple-600 font-medium">
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
      <section className="pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="w-4 h-4" fill="#7c3aed" />
            BirthTech Products
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Innovative Products for{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Modern Mothers
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our own line of pregnancy care products, designed to integrate seamlessly with the BirthTech platform for a complete care experience.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {products.map((product) => {
              const Icon = product.icon;
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Product Image Area */}
                  <div className={`bg-gradient-to-br ${product.color} p-8 relative`}>
                    {product.badge && (
                      <span className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-3 py-1 rounded-full">
                        {product.badge}
                      </span>
                    )}
                    <div className="w-32 h-32 bg-white/20 rounded-3xl flex items-center justify-center mx-auto">
                      <span className="text-6xl">{product.image}</span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 bg-gradient-to-br ${product.color} rounded-xl flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                        <p className="text-sm text-gray-500">{product.tagline}</p>
                      </div>
                    </div>

                    <p className="text-gray-600 my-4">{product.description}</p>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="text-3xl font-bold text-gray-900">{product.price}</span>
                      {product.status === 'coming_soon' && (
                        <span className="text-sm text-gray-500">estimated</span>
                      )}
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 mb-3">Key Features</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {product.features.slice(0, 6).map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Platform Integration */}
                    <div className="bg-purple-50 rounded-xl p-4 mb-6">
                      <div className="flex items-center gap-2 text-purple-700">
                        <Wifi className="w-5 h-5" />
                        <span className="font-medium">Syncs with BirthTech Platform</span>
                      </div>
                      <p className="text-sm text-purple-600 mt-1">
                        Real-time data syncing with your pregnancy dashboard
                      </p>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleRequestInfo(product)}
                      className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                        product.status === 'coming_soon'
                          ? 'bg-gray-900 text-white hover:bg-gray-800'
                          : `bg-gradient-to-r ${product.color} text-white hover:shadow-lg`
                      }`}
                    >
                      {product.status === 'coming_soon' ? (
                        <>
                          <Bell className="w-5 h-5" />
                          Request Info
                        </>
                      ) : (
                        <>
                          Pre-order Now
                          <ChevronRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why BirthTech Products */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose BirthTech Products?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Wifi className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Seamless Integration</h3>
              <p className="text-gray-600">
                All products sync directly with your BirthTech app for unified health tracking.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Safety Certified</h3>
              <p className="text-gray-600">
                Medical-grade quality and safety certifications for peace of mind.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Monitoring</h3>
              <p className="text-gray-600">
                Advanced sensors and AI-powered insights for mother and baby health.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Start Your Pregnancy Journey Today
            </h2>
            <p className="text-lg text-purple-100 mb-8 max-w-xl mx-auto">
              Get personalized care plans and be the first to know when our products launch.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Start Free Trial
              </Link>
              <Link
                href="/#pricing"
                className="bg-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/30 transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Image
              src="https://thebirthtech.com/wp-content/uploads/2017/06/birthtechlogo-2.png"
              alt="BirthTech Logo"
              width={120}
              height={35}
              className="h-8 w-auto brightness-0 invert"
              unoptimized
            />
            <p className="text-gray-400 text-sm">
              © 2026 BirthTech. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white">Privacy</Link>
              <Link href="/terms" className="hover:text-white">Terms</Link>
              <a
                href="https://thebirthtech.com/pages/contact-us/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Interest Modal */}
      {showInterestModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Get Notified About {selectedProduct.name}
              </h3>
              <button
                onClick={() => setShowInterestModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
              >
                ×
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Thank You!</h4>
                <p className="text-gray-600">
                  We'll notify you when {selectedProduct.name} becomes available.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <p className="text-gray-600 mb-4">
                  Be the first to know when {selectedProduct.name} launches. Enter your email below.
                </p>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
                >
                  Notify Me
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
