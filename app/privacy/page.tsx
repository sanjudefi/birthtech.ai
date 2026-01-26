'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Lock } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Image
            src="https://thebirthtech.com/wp-content/uploads/2017/06/birthtechlogo-2.png"
            alt="BirthTech Logo"
            width={120}
            height={35}
            className="h-8 w-auto"
            unoptimized
          />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
              <p className="text-gray-500">Last updated: January 2026</p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2>1. Introduction</h2>
            <p>
              BirthTech ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, disclose, and safeguard your information when you use our service.
            </p>

            <h2>2. Information We Collect</h2>
            <h3>Personal Information</h3>
            <ul>
              <li>Name and email address</li>
              <li>Phone number</li>
              <li>Pregnancy-related information (due date, pregnancy month, etc.)</li>
              <li>Health and dietary preferences</li>
              <li>Payment information (processed securely via Stripe)</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <ul>
              <li>Device information and browser type</li>
              <li>IP address and location data</li>
              <li>Usage patterns and interactions with the Service</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Provide personalized pregnancy wellness recommendations</li>
              <li>Create customized meal plans and exercise routines</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send important updates and notifications</li>
              <li>Improve our services and develop new features</li>
              <li>Respond to your inquiries and provide support</li>
            </ul>

            <h2>4. Data Protection</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data against
              unauthorized access, alteration, disclosure, or destruction. This includes:
            </p>
            <ul>
              <li>Encryption of data in transit and at rest</li>
              <li>Secure authentication mechanisms</li>
              <li>Regular security assessments</li>
              <li>Limited employee access to personal data</li>
            </ul>

            <h2>5. Data Sharing</h2>
            <p>We do not sell your personal information. We may share your data with:</p>
            <ul>
              <li>Service providers who assist in operating our platform (hosting, payment processing)</li>
              <li>Legal authorities when required by law</li>
              <li>Business partners with your explicit consent</li>
            </ul>

            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and associated data</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>

            <h2>7. Cookies</h2>
            <p>
              We use cookies and similar technologies to enhance your experience, analyze usage patterns, and
              personalize content. You can manage cookie preferences through your browser settings.
            </p>

            <h2>8. Data Retention</h2>
            <p>
              We retain your personal data for as long as your account is active or as needed to provide services.
              You may request deletion of your data at any time.
            </p>

            <h2>9. Children's Privacy</h2>
            <p>
              Our Service is intended for adults. We do not knowingly collect personal information from individuals
              under 18 years of age.
            </p>

            <h2>10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant changes via
              email or through the Service.
            </p>

            <h2>11. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or your personal data, please contact us at{' '}
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
