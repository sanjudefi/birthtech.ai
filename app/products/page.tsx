'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  Armchair,
  Wifi,
  Activity,
  Bell,
  Shield,
  Check,
  ChevronRight,
  Mail,
  Brain,
  Baby,
  Wind,
  Smartphone,
  HeartPulse,
  Truck,
  Star,
  ShoppingCart,
  ChevronLeft,
  ZoomIn,
} from 'lucide-react';

// BirthChair product images - from public/images/birth_chair/
const productImages = [
  { id: 1, src: '/images/birth_chair/1.png', alt: 'BirthChair Main View' },
  { id: 2, src: '/images/birth_chair/2.png', alt: 'BirthChair Side View' },
  { id: 3, src: '/images/birth_chair/3.png', alt: 'BirthChair Features' },
  { id: 4, src: '/images/birth_chair/4.png', alt: 'BirthChair Detail View' },
  { id: 5, src: '/images/birth_chair/5.png', alt: 'BirthChair In Use' },
];

const features = [
  {
    icon: Brain,
    title: 'Predictive Risk Analysis',
    description: 'AI-powered monitoring detects potential complications early, alerting healthcare providers in real-time.',
  },
  {
    icon: HeartPulse,
    title: 'Non-Invasive Monitoring',
    description: 'Continuous vital sign tracking for mother and baby throughout all 9 months without discomfort.',
  },
  {
    icon: Wind,
    title: 'Inflatable Cushion Support',
    description: 'Adjustable air-filled cushions provide personalized comfort and optimal positioning during labor.',
  },
  {
    icon: Smartphone,
    title: 'AI Assistant Integration',
    description: 'Built-in AI assistant provides real-time guidance, breathing exercises, and contraction tracking.',
  },
  {
    icon: Truck,
    title: 'Portable Birthing Solution',
    description: 'Lightweight, foldable design allows for easy transport to hospitals, birthing centers, or home use.',
  },
  {
    icon: Shield,
    title: 'Hospital-Grade Safety',
    description: 'Medical-grade materials and safety certifications meet the highest healthcare standards.',
  },
];

const specifications = [
  { label: 'Weight Capacity', value: '300 lbs (136 kg)' },
  { label: 'Chair Weight', value: '45 lbs (20 kg)' },
  { label: 'Folded Dimensions', value: '24" x 18" x 8"' },
  { label: 'Material', value: 'Medical-grade antimicrobial fabric' },
  { label: 'Battery Life', value: '12 hours continuous monitoring' },
  { label: 'Connectivity', value: 'Bluetooth 5.0, Wi-Fi 6' },
  { label: 'Warranty', value: '3 years comprehensive' },
  { label: 'Certifications', value: 'FDA, CE, Health Canada' },
];

export default function ProductsPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setShowInterestModal(false);
    }, 2000);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
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

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-purple-600">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-purple-600">Products</Link>
            <span>/</span>
            <span className="text-gray-900">BirthChair</span>
          </div>
        </div>
      </div>

      {/* Main Product Section - Amazon Style */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-gray-100 rounded-2xl aspect-square overflow-hidden group">
              <Image
                src={productImages[selectedImage].src}
                alt={productImages[selectedImage].alt}
                fill
                className="object-contain"
                priority
              />

              {/* Zoom Button */}
              <button
                onClick={() => setShowZoom(true)}
                className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
              >
                <ZoomIn className="w-5 h-5 text-gray-700" />
              </button>

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>

              {/* Coming Soon Badge */}
              <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Coming Soon
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {productImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-purple-500 ring-2 ring-purple-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Title & Rating */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-purple-600 font-medium">BirthTech Innovation</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                BirthChair Pro
              </h1>
              <p className="text-xl text-gray-600">
                AI-Powered Smart Birthing Chair with Non-Invasive Monitoring
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400" fill="#fbbf24" />
                  ))}
                </div>
                <span className="text-sm text-gray-500">(Pre-launch reviews pending)</span>
              </div>
            </div>

            {/* Price */}
            <div className="border-t border-b py-4">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-gray-900">$2,300</span>
                <span className="text-lg text-gray-500 line-through">$2,800</span>
                <span className="bg-red-100 text-red-700 text-sm font-medium px-2 py-1 rounded">
                  Save $500 (Pre-order)
                </span>
              </div>
              <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                <Check className="w-4 h-4" />
                Free shipping on pre-orders
              </p>
            </div>

            {/* Key Features Summary */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Key Features:</h3>
              <ul className="space-y-2">
                {[
                  'Predictive Risk Analysis - AI detects complications early',
                  'Non-Invasive Monitoring - Track vitals throughout pregnancy',
                  'Inflatable Cushion Support - Personalized comfort',
                  'AI Assistant - Real-time guidance & breathing exercises',
                  'Portable Design - Easy transport to any location',
                  'Hospital-Grade Safety - FDA, CE, Health Canada certified',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-600">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Platform Integration */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Wifi className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Syncs with BirthTech Platform</h4>
                  <p className="text-sm text-gray-600">
                    Real-time data syncing with your pregnancy dashboard and healthcare providers
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setShowInterestModal(true)}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
              >
                <Bell className="w-5 h-5" />
                Join Waitlist - Get Notified at Launch
              </button>
              <button
                onClick={() => setShowInterestModal(true)}
                className="w-full py-4 bg-gray-900 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all"
              >
                <ShoppingCart className="w-5 h-5" />
                Pre-Order Now
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6 pt-4 border-t">
              <div className="text-center">
                <Shield className="w-8 h-8 text-green-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">3-Year Warranty</p>
              </div>
              <div className="text-center">
                <Truck className="w-8 h-8 text-blue-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Free Shipping</p>
              </div>
              <div className="text-center">
                <Activity className="w-8 h-8 text-purple-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">FDA Certified</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Features Section */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Advanced Features for Modern Mothers
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            The BirthChair Pro combines cutting-edge technology with comfort-focused design
            to provide the safest and most supportive birthing experience.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Technical Specifications
          </h2>

          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <table className="w-full">
              <tbody>
                {specifications.map((spec, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-4 font-medium text-gray-900 border-r">{spec.label}</td>
                    <td className="px-6 py-4 text-gray-600">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How BirthChair Works
          </h2>

          <div className="space-y-8">
            {[
              {
                step: 1,
                title: 'Setup & Connect',
                description: 'Unfold your BirthChair and connect to the BirthTech app via Bluetooth. The chair automatically syncs with your pregnancy profile.',
              },
              {
                step: 2,
                title: 'Monitor Throughout Pregnancy',
                description: 'Use the chair for daily comfort sessions while the non-invasive sensors track your vitals and baby\'s movements.',
              },
              {
                step: 3,
                title: 'AI-Powered Insights',
                description: 'Receive real-time analysis and alerts. The AI assistant provides guidance, breathing exercises, and detects potential risks early.',
              },
              {
                step: 4,
                title: 'Labor Support',
                description: 'When labor begins, the chair provides optimal positioning, contraction tracking, and real-time guidance for you and your birth team.',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-8 md:p-12 text-center text-white">
            <Baby className="w-16 h-16 mx-auto mb-4 opacity-80" />
            <h2 className="text-3xl font-bold mb-4">
              Be the First to Experience BirthChair
            </h2>
            <p className="text-lg text-purple-100 mb-8 max-w-xl mx-auto">
              Join our waitlist for exclusive pre-launch pricing and early access to the future of birthing support.
            </p>
            <button
              onClick={() => setShowInterestModal(true)}
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
            >
              <Bell className="w-5 h-5" />
              Join Waitlist - Save $500
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Image
              src="/images/logo/BirthTech-V2_Final 2.png"
              alt="BirthTech Logo"
              width={120}
              height={35}
              className="h-8 w-auto brightness-0 invert"
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
      {showInterestModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Join BirthChair Waitlist
              </h3>
              <button
                onClick={() => setShowInterestModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">You're on the list!</h4>
                <p className="text-gray-600">
                  We'll notify you when BirthChair launches with your exclusive $500 discount.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <p className="text-gray-600 mb-4">
                  Be the first to know when BirthChair launches. Pre-order customers get $500 off!
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
                  Join Waitlist
                </button>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  No payment required. We'll only email you about BirthChair updates.
                </p>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Zoom Modal */}
      {showZoom && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowZoom(false)}
        >
          <div className="max-w-4xl w-full aspect-square bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <Armchair className="w-64 h-64 text-cyan-600 mx-auto" />
              <p className="text-gray-500 mt-4">{productImages[selectedImage].alt}</p>
            </div>
          </div>
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl"
            onClick={() => setShowZoom(false)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
