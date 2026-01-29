'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  Target,
  Eye,
  Users,
  Shield,
  Sparkles,
  Baby,
  Globe,
  Award,
  Lightbulb,
} from 'lucide-react';

const teamMembers = [
  {
    name: 'Veena Venu',
    role: 'Co-Founder and Chief Executive Officer',
    description: 'Electronics Engineer with experience in startups, possessing extensive knowledge of product development and fundraising.',
    image: '/images/team/veena-venu.png',
    initials: 'VV',
    color: 'from-purple-400 to-purple-600',
  },
  {
    name: 'Sanjeeva Kumar Muddam',
    role: 'Co-Founder and Chief Executive Officer - Global Operations',
    description: 'Entrepreneur with 14 years of experience in C-level and managerial roles, specializing in product development and marketing.',
    image: '/images/team/sanjeeva-kumar.png',
    initials: 'SK',
    color: 'from-blue-400 to-blue-600',
  },
  {
    name: 'Janice Joseph',
    role: 'Co-Founder and Chief of Regulatory Affairs & Public Relations',
    description: 'Experienced and passionate professional in Public and Regulatory Affairs within the healthcare sector, with extensive experience across various verticals.',
    image: '/images/team/janice-joseph.png',
    initials: 'JJ',
    color: 'from-pink-400 to-pink-600',
  },
  {
    name: 'Ramakrishna Kiran',
    role: 'Co-Founder and Chief Technology Officer',
    description: 'Expert in full stack development with over 10 years of experience, specializing in building end-to-end systems.',
    image: '/images/team/ramakrishna-kiran.png',
    initials: 'RK',
    color: 'from-orange-400 to-red-500',
  },
];

const values = [
  {
    icon: Heart,
    title: 'Compassion',
    description: 'Every mother and child deserves the highest standard of care throughout their journey.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We continuously develop healthcare solutions that are both comfortable and affordable.',
  },
  {
    icon: Shield,
    title: 'Safety',
    description: 'Our solutions are designed with safety as the top priority for mother and baby.',
  },
  {
    icon: Globe,
    title: 'Accessibility',
    description: 'Making quality maternal healthcare accessible to families everywhere.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo/BirthTech-V2_Final 2.png"
              alt="BirthTech Logo"
              width={200}
              height={56}
              className="h-14 w-auto"
            />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/#features" className="text-gray-600 hover:text-purple-600 font-medium">
              Features
            </Link>
            <Link href="/#pricing" className="text-gray-600 hover:text-purple-600 font-medium">
              Pricing
            </Link>
            <Link href="/products" className="text-gray-600 hover:text-purple-600 font-medium">
              Products
            </Link>
            <Link href="/about" className="text-purple-600 font-medium">
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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 text-white py-20">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
              <Baby className="w-4 h-4" />
              <span>Because BIRTH matters</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About BirthTech
            </h1>
            <p className="text-xl text-purple-100 leading-relaxed">
              Welcome to BirthTech, where we revolutionize the birthing experience. Our team of
              passionate engineers with diverse expertise is dedicated to making childbirth safe,
              comfortable, and accessible for every mother and child.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Our mission is simple yet profound: <strong>to save lives during birth</strong>,
                fostering a better and brighter society and nation. By offering innovative healthcare
                solutions at affordable prices, we aim to transform maternal care globally.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                We are dedicated to providing every mother and child with the highest standard of
                care throughout the childbirth journey. Our innovative approach is centered on
                developing healthcare facilities that are both comfortable and affordable.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                We envision becoming a <strong>trusted partner</strong> for hospitals, institutions,
                and individual practitioners. By providing comfort and ensuring comprehensive
                antenatal and postnatal care, we aim to support pregnant mothers and their children
                through every step of the delivery journey.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                With our innovative solutions, we strive to lead the way in maternal healthcare,
                combining cutting-edge AI technology with compassionate care to create a better
                birthing experience for all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                BirthTech was founded with a singular vision: to revolutionize maternal healthcare
                through technology and innovation. Our journey began when our founding team witnessed
                firsthand the challenges faced by expecting mothers in accessing quality prenatal care.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Today, we combine AI-powered personalization with medical expertise to provide
                comprehensive pregnancy support. From personalized meal plans and safe workout
                routines to our flagship BirthChair product, every solution we create is designed
                with one goal: ensuring the health and happiness of mothers and babies.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our team of passionate engineers brings together a diverse range of skills, united
                by a mission to improve the birthing process and make quality maternal care
                accessible to families everywhere.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                    <div className="text-3xl font-bold text-purple-600">10K+</div>
                    <div className="text-gray-600 text-sm mt-1">Happy Mothers</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                    <div className="text-3xl font-bold text-pink-600">50+</div>
                    <div className="text-gray-600 text-sm mt-1">Healthcare Partners</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                    <div className="text-3xl font-bold text-blue-600">24/7</div>
                    <div className="text-gray-600 text-sm mt-1">AI Support</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                    <div className="text-3xl font-bold text-green-600">99%</div>
                    <div className="text-gray-600 text-sm mt-1">Satisfaction Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do at BirthTech, from product development
              to customer support.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Product */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm mb-4">
                  <Award className="w-4 h-4" />
                  <span>Flagship Product</span>
                </div>
                <h2 className="text-3xl font-bold mb-4">BirthChair</h2>
                <p className="text-purple-100 mb-6">
                  Our flagship product features a unique lightweight design, making it portable
                  and easy to carry. It supports multiple birthing postures, facilitating an
                  easier delivery process.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                    <span>Foldable mechanism - compact and suitable for space-constrained environments</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                    <span>Emergency apparatus for critical situations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                    <span>AI-powered monitoring for mother and baby safety</span>
                  </li>
                </ul>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-colors"
                >
                  Learn More
                </Link>
              </div>
              <div className="relative">
                <Image
                  src="/images/birth_chair/1.png"
                  alt="BirthChair"
                  width={500}
                  height={500}
                  className="rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full text-purple-700 text-sm font-medium mb-4">
              <Users className="w-4 h-4" />
              <span>Team</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Leadership</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A passionate team of entrepreneurs, engineers, and healthcare professionals
              united by a mission to transform maternal care globally.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center group">
                {/* Circular Photo/Avatar */}
                <div className="relative mx-auto mb-6">
                  <div className={`w-36 h-36 rounded-full bg-gradient-to-br ${member.color} p-1 mx-auto`}>
                    <div className="w-full h-full rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={144}
                        height={144}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<span class="text-3xl font-bold text-gray-500">${member.initials}</span>`;
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                {/* Info */}
                <h3 className="font-bold text-gray-900 text-lg mb-1">{member.name}</h3>
                <p className="text-purple-600 text-sm font-medium mb-3 px-2">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Join Us on This Journey
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're an expecting mother, healthcare provider, or investor, we'd love to
            connect with you and explore how we can work together to improve maternal care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="btn-primary px-8 py-3">
              Get Started Free
            </Link>
            <Link href="/products" className="btn-secondary px-8 py-3">
              Explore Products
            </Link>
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
                width={200}
                height={56}
                className="h-14 w-auto mb-4 brightness-0 invert"
              />
              <p className="text-sm text-gray-400">
                AI-powered pregnancy care platform for modern mothers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/products" className="hover:text-white transition-colors">Products</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
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
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>support@birthtech.ai</li>
                <li>Canada</li>
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
