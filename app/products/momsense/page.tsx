'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  Activity,
  Bell,
  Shield,
  Check,
  ChevronRight,
  Mail,
  Baby,
  Moon,
  Smartphone,
  HeartPulse,
  Wifi,
  Lock,
  Sparkles,
  ChevronLeft,
  ZoomIn,
  Users,
} from 'lucide-react';

// MomSense product images
const productImages = [
  { id: 1, src: '/images/momsense/6.png', alt: 'MomSense Smart Bands Overview' },
  { id: 2, src: '/images/momsense/7.png', alt: 'MomSense Mother Band' },
  { id: 3, src: '/images/momsense/8.png', alt: 'MomSense Baby Band' },
  { id: 4, src: '/images/momsense/9.png', alt: 'MomSense App Interface' },
  { id: 5, src: '/images/momsense/10.png', alt: 'MomSense Connected System' },
  { id: 6, src: '/images/momsense/11.png', alt: 'MomSense Health Monitoring' },
  { id: 7, src: '/images/momsense/12.png', alt: 'MomSense Family Care' },
];

const features = [
  {
    icon: HeartPulse,
    title: 'Mother Vital Monitoring',
    description: 'Gently tracks heart rate, temperature, and wellness indicators to help mothers stay informed about their health.',
  },
  {
    icon: Baby,
    title: 'Baby Vital Monitoring',
    description: 'Softly monitors your baby\'s heart rate, temperature, and movement patterns for added peace of mind.',
  },
  {
    icon: Sparkles,
    title: 'AI-Based Insights & Alerts',
    description: 'Smart AI learns your family\'s patterns and provides helpful insights and timely notifications when something needs attention.',
  },
  {
    icon: Moon,
    title: 'Sleep & Activity Tracking',
    description: 'Understand sleep patterns and activity levels for both mother and baby, helping you build healthy routines.',
  },
  {
    icon: Bell,
    title: 'Safety Alerts',
    description: 'Receive gentle notifications if anything unusual is detected, so you can respond with confidence.',
  },
  {
    icon: Shield,
    title: 'Comfortable & Skin-Safe',
    description: 'Made with hypoallergenic, medical-grade materials that are gentle on sensitive skin for all-day comfort.',
  },
  {
    icon: Lock,
    title: 'Secure Data & Privacy',
    description: 'Your family\'s health data is encrypted and protected. You control who sees your information.',
  },
  {
    icon: Wifi,
    title: 'Seamless Connectivity',
    description: 'Both bands stay connected through our secure app, keeping mother and baby\'s data in sync.',
  },
];

const specifications = [
  { label: 'Mother Band Weight', value: '28g (ultra-light)' },
  { label: 'Baby Band Weight', value: '15g (featherlight)' },
  { label: 'Battery Life', value: 'Up to 7 days' },
  { label: 'Water Resistance', value: 'Splash-proof (IPX5)' },
  { label: 'Materials', value: 'Medical-grade silicone' },
  { label: 'Connectivity', value: 'Bluetooth 5.0' },
  { label: 'App Compatibility', value: 'iOS & Android' },
  { label: 'Warranty', value: '2 years comprehensive' },
];

export default function MomSensePage() {
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
            <Link href="/about" className="text-gray-600 hover:text-purple-600 font-medium">
              About Us
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
            <span className="text-gray-900">MomSense</span>
          </div>
        </div>
      </div>

      {/* Main Product Section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl aspect-square overflow-hidden group">
              <Image
                src={productImages[selectedImage].src}
                alt={productImages[selectedImage].alt}
                fill
                className="object-contain p-4"
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
              <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Coming Soon
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {productImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium">
                New Product
              </span>
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                AI-Powered
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              MomSense Smart Wearable
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-bold text-gray-900">$29.99</span>
              <span className="text-gray-500">for 2 bands (Mother + Baby)</span>
            </div>

            {/* Value Proposition */}
            <p className="text-xl text-purple-600 font-medium mb-6">
              Caring connection for mother and baby, every moment of the day.
            </p>

            {/* Short Description */}
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              MomSense is a gentle, AI-powered wearable system designed for mothers and newborn babies.
              With two connected smart bands—one for mom and one for baby—it helps families feel
              confident and connected during the precious early days and beyond.
            </p>

            {/* Detailed Description */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" />
                How MomSense Supports Your Family
              </h3>
              <p className="text-gray-600 leading-relaxed">
                MomSense brings mother and baby closer through thoughtful health monitoring.
                The AI learns your family's unique patterns and provides gentle insights about
                sleep, activity, and wellness. When something needs your attention, you'll
                receive a caring notification—giving you peace of mind whether you're at home,
                at work, or in the hospital. It's like having a trusted companion watching
                over your little one, so you can rest easier.
              </p>
            </div>

            {/* What's Included */}
            <div className="border border-gray-200 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">What's Included</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Mother Band</p>
                    <p className="text-sm text-gray-500">Comfortable fit</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Baby className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Baby Band</p>
                    <p className="text-sm text-gray-500">Ultra-soft design</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Mobile App</p>
                    <p className="text-sm text-gray-500">iOS & Android</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">2-Year Warranty</p>
                    <p className="text-sm text-gray-500">Full coverage</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setShowInterestModal(true)}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
              >
                <Bell className="w-5 h-5" />
                Notify Me When Available
              </button>
              <p className="text-center text-sm text-gray-500">
                Be the first to know when MomSense launches
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-white to-pink-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Thoughtfully designed features that help you care for your family with confidence
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How MomSense Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Simple setup, continuous care
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-pink-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Wear the Bands</h3>
              <p className="text-gray-600">
                Mother wears her band, and baby wears the gentle infant band. Both are comfortable for all-day use.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Stay Connected</h3>
              <p className="text-gray-600">
                The bands sync with your phone app, sharing health insights and keeping your family's data safe.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Rest Easy</h3>
              <p className="text-gray-600">
                Receive gentle notifications if anything needs attention. Enjoy peace of mind, day and night.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Specifications</h2>
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <table className="w-full">
              <tbody>
                {specifications.map((spec, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-4 font-medium text-gray-900">{spec.label}</td>
                    <td className="px-6 py-4 text-gray-600">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Be Part of the MomSense Family</h2>
          <p className="text-pink-100 mb-8 max-w-2xl mx-auto">
            Join thousands of parents waiting to experience the peace of mind that MomSense brings.
            Sign up to be notified when we launch.
          </p>
          <button
            onClick={() => setShowInterestModal(true)}
            className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-pink-50 transition-colors inline-flex items-center gap-2"
          >
            <Mail className="w-5 h-5" />
            Get Early Access
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Image
                src="/images/logo/BirthTech-V2_Final 2.png"
                alt="BirthTech Logo"
                width={120}
                height={35}
                className="h-8 w-auto mb-4 brightness-0 invert"
              />
              <p className="text-sm text-gray-400">
                AI-powered pregnancy care platform for modern mothers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Products</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/products" className="hover:text-white transition-colors">BirthChair</Link></li>
                <li><Link href="/products/momsense" className="hover:text-white transition-colors">MomSense</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://thebirthtech.com/pages/about-us/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">About Us</a>
                </li>
                <li>
                  <a href="https://thebirthtech.com/problem/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Problem</a>
                </li>
                <li>
                  <a href="https://thebirthtech.com/our-approach/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Our Approach</a>
                </li>
                <li>
                  <a href="https://thebirthtech.com/pages/contact-us/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Contact Us</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} BirthTech. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Interest Modal */}
      {showInterestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            {!submitted ? (
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Get Notified</h3>
                <p className="text-gray-600 mb-6">
                  Be the first to know when MomSense becomes available. We'll send you exclusive early access.
                </p>
                <form onSubmit={handleSubmit}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700"
                  >
                    Notify Me
                  </button>
                </form>
                <button
                  onClick={() => setShowInterestModal(false)}
                  className="w-full mt-3 text-gray-500 hover:text-gray-700"
                >
                  Maybe later
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">You're on the list!</h3>
                <p className="text-gray-600">
                  We'll notify you as soon as MomSense is available.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Zoom Modal */}
      {showZoom && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setShowZoom(false)}
        >
          <div className="relative max-w-4xl w-full aspect-square">
            <Image
              src={productImages[selectedImage].src}
              alt={productImages[selectedImage].alt}
              fill
              className="object-contain"
            />
            <button
              onClick={() => setShowZoom(false)}
              className="absolute top-4 right-4 bg-white p-2 rounded-full"
            >
              <ChevronRight className="w-6 h-6 rotate-45" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
