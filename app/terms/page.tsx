'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Shield } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Image
            src="/images/logo/BirthTech-V2_Final 2.png"
            alt="BirthTech Logo"
            width={200}
            height={56}
            className="h-14 w-auto"
          />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Terms & Conditions</h1>
              <p className="text-gray-500">Last updated: January 2026</p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using BirthTech.ai ("the Service"), you agree to be bound by these Terms and Conditions.
              If you do not agree to these terms, please do not use our service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              BirthTech.ai provides AI-powered pregnancy wellness guidance, including personalized meal plans, exercise
              recommendations, and general wellness tips. Our service is designed to support expecting mothers with
              lifestyle and wellness information.
            </p>

            <h2>3. Medical Disclaimer</h2>
            <p className="bg-amber-50 p-4 rounded-xl border border-amber-200">
              <strong>Important:</strong> BirthTech.ai is NOT a medical service and does NOT provide medical advice,
              diagnosis, or treatment. The information provided through our platform is for general informational and
              wellness purposes only. Always consult with qualified healthcare professionals for medical advice,
              especially during pregnancy.
            </p>

            <h2>4. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all activities
              that occur under your account. You must provide accurate and complete information when creating an account.
            </p>

            <h2>5. Subscription and Payments</h2>
            <ul>
              <li>Subscription fees are billed in advance on a monthly or annual basis</li>
              <li>All payments are processed securely through Stripe</li>
              <li>You may cancel your subscription at any time</li>
              <li>Refunds are provided in accordance with our refund policy</li>
            </ul>

            <h2>6. User Responsibilities</h2>
            <p>You agree to:</p>
            <ul>
              <li>Use the service only for lawful purposes</li>
              <li>Provide accurate health information for personalized recommendations</li>
              <li>Not share your account credentials with others</li>
              <li>Seek professional medical advice for health concerns</li>
            </ul>

            <h2>7. Intellectual Property</h2>
            <p>
              All content, features, and functionality of the Service are owned by BirthTech and are protected by
              international copyright, trademark, and other intellectual property laws.
            </p>

            <h2>8. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, BirthTech shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages resulting from your use of the Service.
            </p>

            <h2>9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of significant changes
              via email or through the Service.
            </p>

            <h2>10. Contact Information</h2>
            <p>
              For questions about these Terms, please contact us at{' '}
              <a href="https://thebirthtech.com/pages/contact-us/" target="_blank" rel="noopener noreferrer">
                our contact page
              </a>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
