'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ArrowLeft,
  ShoppingBag,
  Star,
  ExternalLink,
  Filter,
  Search,
  Pill,
  Baby,
  Sparkles,
  Leaf,
  Crown,
  Gift,
  BookOpen,
  CheckCircle,
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  rating: number;
  reviews: number;
  category: string;
  image: string;
  badge?: string;
  benefits: string[];
  featured?: boolean;
  affiliateLink?: string;
}

const categories = [
  { id: 'all', label: 'All Products', icon: ShoppingBag },
  { id: 'vitamins', label: 'Vitamins', icon: Pill },
  { id: 'skincare', label: 'Skincare', icon: Sparkles },
  { id: 'essentials', label: 'Essentials', icon: Baby },
  { id: 'nutrition', label: 'Nutrition', icon: Leaf },
  { id: 'books', label: 'Books', icon: BookOpen },
];

const products: Product[] = [
  {
    id: '1',
    name: 'Prenatal DHA + Omega-3',
    description: 'Essential fatty acids for baby brain development. High-quality fish oil with no fishy aftertaste.',
    price: '$34.99',
    rating: 4.8,
    reviews: 2847,
    category: 'vitamins',
    image: '🐟',
    badge: 'Best Seller',
    benefits: ['Brain development', 'Eye health', 'Heart support'],
    featured: true,
  },
  {
    id: '2',
    name: 'Iron + Folate Complex',
    description: 'Gentle iron supplement with folate for pregnancy. Easy on the stomach, highly absorbable.',
    price: '$28.99',
    rating: 4.7,
    reviews: 1923,
    category: 'vitamins',
    image: '💊',
    badge: 'Doctor Recommended',
    benefits: ['Prevents anemia', 'Supports baby growth', 'Energy boost'],
    featured: true,
  },
  {
    id: '3',
    name: 'Complete Prenatal Multivitamin',
    description: 'All-in-one prenatal vitamin with 25+ essential nutrients for you and baby.',
    price: '$42.99',
    rating: 4.9,
    reviews: 4521,
    category: 'vitamins',
    image: '✨',
    badge: 'Top Rated',
    benefits: ['Complete nutrition', 'Gummy form available', 'No nausea'],
    featured: true,
  },
  {
    id: '4',
    name: 'Stretch Mark Prevention Cream',
    description: 'Organic cocoa butter blend to prevent and reduce stretch marks. Safe for pregnancy.',
    price: '$24.99',
    rating: 4.6,
    reviews: 1456,
    category: 'skincare',
    image: '🧴',
    benefits: ['Moisturizes deeply', 'Prevents stretch marks', 'Natural ingredients'],
  },
  {
    id: '5',
    name: 'Pregnancy Belly Oil',
    description: 'Luxurious blend of vitamin E, almond, and jojoba oils for supple, nourished skin.',
    price: '$19.99',
    rating: 4.8,
    reviews: 892,
    category: 'skincare',
    image: '🫒',
    badge: 'Organic',
    benefits: ['100% natural', 'Fast absorbing', 'Light scent'],
  },
  {
    id: '6',
    name: 'Pregnancy Pillow',
    description: 'U-shaped full body support pillow for comfortable sleep during pregnancy.',
    price: '$59.99',
    rating: 4.7,
    reviews: 3241,
    category: 'essentials',
    image: '🛏️',
    badge: 'Customer Favorite',
    benefits: ['Back support', 'Hip alignment', 'Better sleep'],
    featured: true,
  },
  {
    id: '7',
    name: 'Compression Socks Set',
    description: 'Medical-grade compression socks to reduce swelling and improve circulation.',
    price: '$22.99',
    rating: 4.5,
    reviews: 1087,
    category: 'essentials',
    image: '🧦',
    benefits: ['Reduces swelling', 'Improves circulation', '3-pack included'],
  },
  {
    id: '8',
    name: 'Pregnancy Support Belt',
    description: 'Adjustable belly band for lower back and pelvic support during pregnancy.',
    price: '$32.99',
    rating: 4.6,
    reviews: 2156,
    category: 'essentials',
    image: '🎀',
    benefits: ['Back pain relief', 'Adjustable fit', 'Breathable material'],
  },
  {
    id: '9',
    name: 'Protein Powder for Pregnancy',
    description: 'Plant-based protein specifically formulated for pregnant women. Vanilla flavor.',
    price: '$38.99',
    rating: 4.4,
    reviews: 645,
    category: 'nutrition',
    image: '🥛',
    benefits: ['25g protein', 'No artificial sweeteners', 'Prenatal-safe'],
  },
  {
    id: '10',
    name: 'Ginger Chews for Nausea',
    description: 'Natural ginger candies to help relieve morning sickness and nausea.',
    price: '$12.99',
    rating: 4.8,
    reviews: 5672,
    category: 'nutrition',
    image: '🍬',
    badge: 'Morning Sickness Relief',
    benefits: ['Natural remedy', 'Portable', 'Great taste'],
  },
  {
    id: '11',
    name: 'Expecting: A Year-by-Year Guide',
    description: 'Comprehensive pregnancy guide covering all trimesters with expert advice.',
    price: '$18.99',
    rating: 4.9,
    reviews: 3421,
    category: 'books',
    image: '📖',
    badge: 'Bestseller',
    benefits: ['Week-by-week', 'Expert authors', 'Full color'],
  },
  {
    id: '12',
    name: 'Pregnancy Yoga & Meditation',
    description: 'Guided yoga and meditation specifically designed for each trimester.',
    price: '$14.99',
    rating: 4.7,
    reviews: 1234,
    category: 'books',
    image: '🧘‍♀️',
    benefits: ['Video access', 'All levels', 'Relaxation focus'],
  },
];

export default function ShopPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredProducts = products.filter((p) => p.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">Pregnancy Shop</h1>
              <p className="text-xs text-gray-500">Curated products for you</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Crown className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Premium Pregnancy Products</h2>
              <p className="text-purple-100 mt-1">
                Carefully curated items recommended by healthcare professionals
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-sm text-purple-100">
            <Gift className="w-4 h-4" />
            <span>Free shipping on orders over $50</span>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-purple-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Featured Products */}
        {selectedCategory === 'all' && searchQuery === '' && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Featured Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredProducts.slice(0, 3).map((product) => (
                <button
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-left group"
                >
                  <div className="relative">
                    <div className="w-full h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center text-5xl mb-3">
                      {product.image}
                    </div>
                    {product.badge && (
                      <span className="absolute top-2 left-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
                    <span className="text-sm font-medium text-gray-900">{product.rating}</span>
                    <span className="text-sm text-gray-500">({product.reviews.toLocaleString()})</span>
                  </div>
                  <p className="text-lg font-bold text-purple-600 mt-2">{product.price}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* All Products */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {selectedCategory === 'all' ? 'All Products' : categories.find(c => c.id === selectedCategory)?.label}
            <span className="text-sm font-normal text-gray-500 ml-2">({filteredProducts.length} items)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-left group"
              >
                <div className="relative">
                  <div className="w-full h-28 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center text-4xl mb-3">
                    {product.image}
                  </div>
                  {product.badge && (
                    <span className="absolute top-2 left-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                      {product.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
                    <span className="text-sm font-medium text-gray-900">{product.rating}</span>
                    <span className="text-xs text-gray-400">({product.reviews.toLocaleString()})</span>
                  </div>
                  <p className="text-lg font-bold text-purple-600">{product.price}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">No products found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500">
            <strong>Note:</strong> Product recommendations are for informational purposes only.
            Always consult your healthcare provider before taking any supplements or medications during pregnancy.
            Prices and availability may vary. Links may be affiliate links.
          </p>
        </div>
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden">
            {/* Close Button */}
            <div className="p-4 flex justify-end">
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            {/* Product Info */}
            <div className="px-6 pb-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Image */}
              <div className="w-full h-40 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center text-6xl mb-4">
                {selectedProduct.image}
              </div>

              {/* Badge */}
              {selectedProduct.badge && (
                <span className="inline-block bg-purple-100 text-purple-700 text-sm px-3 py-1 rounded-full mb-3">
                  {selectedProduct.badge}
                </span>
              )}

              {/* Name & Price */}
              <h2 className="text-xl font-bold text-gray-900">{selectedProduct.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-amber-400" fill="currentColor" />
                  <span className="font-medium text-gray-900">{selectedProduct.rating}</span>
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-gray-500">{selectedProduct.reviews.toLocaleString()} reviews</span>
              </div>
              <p className="text-2xl font-bold text-purple-600 mt-3">{selectedProduct.price}</p>

              {/* Description */}
              <p className="text-gray-600 mt-4">{selectedProduct.description}</p>

              {/* Benefits */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Key Benefits</h3>
                <div className="space-y-2">
                  {selectedProduct.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => {
                  // In production, this would link to affiliate or shopping page
                  alert('This is a demo. In production, this would link to the product page.');
                }}
                className="w-full mt-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
              >
                <ExternalLink className="w-5 h-5" />
                View Product
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                Opens in new tab. May be an affiliate link.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
