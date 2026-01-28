'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  Baby,
  Armchair,
  Shield,
  Sparkles,
  ChevronRight,
  Activity,
  Wifi,
  Bell,
  Lock,
} from 'lucide-react';

const products = [
  {
    id: 'momsense',
    name: 'MomSense Smart Wearable',
    tagline: 'Caring connection for mother and baby, every moment of the day.',
    description:
      'AI-powered wearable system with two connected smart bands—one for mother, one for baby. Continuous health monitoring, gentle alerts, and peace of mind.',
    price: '$29.99',
    priceNote: 'for 2 bands (Mother + Baby)',
    image: '/images/momsense/6.png',
    badge: 'New',
    badgeColor: 'from-pink-500 to-purple-600',
    bgGradient: 'from-pink-50 to-purple-50',
    href: '/products/momsense',
    features: [
      { icon: Heart, text: 'Mother & Baby Monitoring' },
      { icon: Sparkles, text: 'AI-Powered Insights' },
      { icon: Bell, text: 'Safety Alerts' },
      { icon: Lock, text: 'Secure & Private' },
    ],
    status: 'coming-soon',
  },
  {
    id: 'birthchair',
    name: 'BirthChair',
    tagline: 'The future of safe, comfortable birthing support.',
    description:
      'AI-powered birthing chair with non-invasive monitoring, predictive risk analysis, and portable design for hospitals, birthing centers, or home use.',
    price: '$2,300',
    priceNote: 'Medical-grade device',
    image: '/images/birth_chair/1.png',
    badge: 'Flagship',
    badgeColor: 'from-purple-600 to-blue-600',
    bgGradient: 'from-purple-50 to-blue-50',
    href: '/products/birthchair',
    features: [
      { icon: Activity, text: 'Predictive Risk Analysis' },
      { icon: Armchair, text: 'Multiple Birthing Postures' },
      { icon: Wifi, text: 'AI Assistant Built-in' },
      { icon: Shield, text: 'Hospital-Grade Safety' },
    ],
    status: 'coming-soon',
  },
];

export default function ProductsPage() {
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

      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Innovative Healthcare Products</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Thoughtfully designed technology that supports mothers and babies through every step of their journey.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {products.map((product) => (
              <Link
                key={product.id}
                href={product.href}
                className="group block"
              >
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all h-full">
                  {/* Product Image */}
                  <div className={`relative bg-gradient-to-br ${product.bgGradient} aspect-[4/3] overflow-hidden`}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-8 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className={`absolute top-4 left-4 bg-gradient-to-r ${product.badgeColor} text-white px-4 py-1.5 rounded-full text-sm font-medium`}>
                      {product.badge}
                    </div>
                    {product.status === 'coming-soon' && (
                      <div className="absolute top-4 right-4 bg-white/90 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                        Coming Soon
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {product.name}
                    </h2>
                    <p className="text-purple-600 font-medium mb-3">{product.tagline}</p>
                    <p className="text-gray-600 mb-4">{product.description}</p>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="text-3xl font-bold text-gray-900">{product.price}</span>
                      <span className="text-sm text-gray-500">{product.priceNote}</span>
                    </div>

                    {/* Feature highlights */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {product.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <feature.icon className="w-4 h-4 text-purple-500 flex-shrink-0" />
                          {feature.text}
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center text-purple-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                      View Details
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MomSense Highlight Banner */}
      <section className="py-12 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-pink-100">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  <Heart className="w-4 h-4" />
                  Special Offer
                </span>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  MomSense Included with Your Plan
                </h3>
                <p className="text-gray-600 mb-4">
                  Subscribe to our monthly plan and receive 2 MomSense smart bands (Mother + Baby) free
                  after 3 months of subscription. Annual subscribers get them included from day one!
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/auth/signup?plan=monthly"
                    className="btn-primary text-center text-sm py-2.5 px-5"
                  >
                    Monthly - $9.99/mo (MomSense after 3 months)
                  </Link>
                  <Link
                    href="/auth/signup?plan=annual"
                    className="btn-secondary text-center text-sm py-2.5 px-5"
                  >
                    Annual - $95.88/yr (MomSense included)
                  </Link>
                </div>
              </div>
              <div className="relative h-64">
                <Image
                  src="/images/momsense/7.png"
                  alt="MomSense Smart Bands"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
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
                <li><Link href="/products/momsense" className="hover:text-white transition-colors">MomSense</Link></li>
                <li><Link href="/products/birthchair" className="hover:text-white transition-colors">BirthChair</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://thebirthtech.com/pages/about-us/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="https://thebirthtech.com/problem/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Problem</a></li>
                <li><a href="https://thebirthtech.com/our-approach/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Our Approach</a></li>
                <li><a href="https://thebirthtech.com/pages/contact-us/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Contact Us</a></li>
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
    </div>
  );
}
