'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, AlertTriangle, Heart } from 'lucide-react';

export default function DisclaimerPage() {
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
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Medical Disclaimer</h1>
              <p className="text-gray-500">Important Information About Our Service</p>
            </div>
          </div>

          {/* Main Disclaimer Box */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <Heart className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-bold text-amber-800 mb-2">
                  This Platform Provides Wellness and Lifestyle Guidance Only
                </h2>
                <p className="text-amber-700">
                  BirthTech.ai does not provide medical advice, diagnosis, or treatment. The content and
                  recommendations provided through our platform are for general informational and wellness purposes
                  only. They should not be construed as professional medical advice.
                </p>
              </div>
            </div>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2>Important Points to Understand</h2>

            <h3>1. Not a Substitute for Medical Care</h3>
            <p>
              The information provided by BirthTech.ai, including but not limited to meal plans, exercise
              recommendations, and wellness tips, is intended to support your pregnancy journey but should never
              replace the advice, diagnosis, or treatment from qualified healthcare professionals.
            </p>

            <h3>2. Always Consult Your Healthcare Provider</h3>
            <p>
              Before making any decisions about your health or pregnancy care based on information from our platform:
            </p>
            <ul>
              <li>Consult with your obstetrician, midwife, or healthcare provider</li>
              <li>Discuss any dietary changes with your doctor, especially if you have gestational diabetes or other conditions</li>
              <li>Get approval before starting any exercise program during pregnancy</li>
              <li>Seek immediate medical attention for any concerning symptoms</li>
            </ul>

            <h3>3. Individual Variations</h3>
            <p>
              Every pregnancy is unique. Recommendations provided by our AI system are based on general guidelines
              and the information you provide. They may not be appropriate for your specific medical situation,
              health conditions, or pregnancy complications.
            </p>

            <h3>4. Emergency Situations</h3>
            <p className="bg-red-50 p-4 rounded-xl border border-red-200">
              <strong>If you experience any emergency symptoms during pregnancy, including but not limited to:</strong>
              <br />
              Severe abdominal pain, heavy bleeding, severe headaches, vision changes, decreased fetal movement,
              or any other concerning symptoms — <strong>contact your healthcare provider immediately or call
              emergency services (911)</strong>.
            </p>

            <h3>5. Nutritional Information</h3>
            <p>
              While our meal plans are designed to support a healthy pregnancy, nutritional needs vary based on
              individual factors. Our recommendations should be reviewed and approved by your healthcare provider,
              particularly if you have:
            </p>
            <ul>
              <li>Food allergies or intolerances</li>
              <li>Gestational diabetes</li>
              <li>High blood pressure or preeclampsia</li>
              <li>Any other medical conditions</li>
            </ul>

            <h3>6. Exercise Recommendations</h3>
            <p>
              Our exercise suggestions are designed to be safe for typical pregnancies. However, you should:
            </p>
            <ul>
              <li>Get clearance from your healthcare provider before exercising</li>
              <li>Stop immediately if you experience pain, dizziness, or shortness of breath</li>
              <li>Modify or skip exercises if you have a high-risk pregnancy</li>
              <li>Stay hydrated and avoid overheating</li>
            </ul>

            <h3>7. Limitation of Liability</h3>
            <p>
              BirthTech and its affiliates shall not be held responsible or liable for any damages arising from
              the use or inability to use our services, or from any actions taken based on the information
              provided through our platform.
            </p>

            <h3>8. Questions or Concerns</h3>
            <p>
              If you have any questions about this disclaimer or how our service should be used alongside your
              medical care, please{' '}
              <a href="https://thebirthtech.com/pages/contact-us/" target="_blank" rel="noopener noreferrer">
                contact us
              </a>
              {' '}or speak with your healthcare provider.
            </p>
          </div>

          {/* Acknowledgment Box */}
          <div className="mt-8 bg-purple-50 rounded-xl p-6">
            <h3 className="font-semibold text-purple-900 mb-2">By Using BirthTech.ai, You Acknowledge That:</h3>
            <ul className="space-y-2 text-purple-800">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>You understand this service provides wellness guidance, not medical advice</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>You will consult healthcare professionals for medical decisions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>You take responsibility for decisions made based on information from our platform</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>You will seek emergency care when needed</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
