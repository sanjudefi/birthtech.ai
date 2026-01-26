'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ArrowLeft,
  ShoppingCart,
  Loader2,
  Sparkles,
  RefreshCw,
  Check,
  Download,
  ChevronDown,
  ChevronUp,
  Calendar,
  Info,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface GroceryItem {
  name: string;
  quantity: string;
  unit: string;
  category: string;
  checked: boolean;
  emoji?: string;
  reason?: string;
}

// Food emojis by item name keywords
const foodEmojis: Record<string, string> = {
  // Proteins
  salmon: '🐟',
  fish: '🐟',
  tuna: '🐟',
  chicken: '🍗',
  turkey: '🦃',
  beef: '🥩',
  lamb: '🥩',
  pork: '🥓',
  eggs: '🥚',
  egg: '🥚',
  tofu: '🧈',
  lentils: '🫘',
  beans: '🫘',
  chickpeas: '🫘',
  shrimp: '🦐',
  prawns: '🦐',
  // Dairy
  milk: '🥛',
  cheese: '🧀',
  yogurt: '🥛',
  butter: '🧈',
  cream: '🥛',
  paneer: '🧀',
  // Vegetables
  spinach: '🥬',
  kale: '🥬',
  lettuce: '🥬',
  broccoli: '🥦',
  carrot: '🥕',
  carrots: '🥕',
  tomato: '🍅',
  tomatoes: '🍅',
  potato: '🥔',
  potatoes: '🥔',
  sweet: '🍠',
  onion: '🧅',
  onions: '🧅',
  garlic: '🧄',
  pepper: '🫑',
  peppers: '🫑',
  cucumber: '🥒',
  corn: '🌽',
  mushroom: '🍄',
  mushrooms: '🍄',
  peas: '🫛',
  cabbage: '🥬',
  cauliflower: '🥦',
  celery: '🥬',
  asparagus: '🥬',
  zucchini: '🥒',
  eggplant: '🍆',
  beet: '🫒',
  avocado: '🥑',
  // Fruits
  apple: '🍎',
  apples: '🍎',
  banana: '🍌',
  bananas: '🍌',
  orange: '🍊',
  oranges: '🍊',
  lemon: '🍋',
  lemons: '🍋',
  lime: '🍋',
  grape: '🍇',
  grapes: '🍇',
  strawberry: '🍓',
  strawberries: '🍓',
  blueberry: '🫐',
  blueberries: '🫐',
  raspberry: '🍓',
  watermelon: '🍉',
  mango: '🥭',
  pineapple: '🍍',
  peach: '🍑',
  pear: '🍐',
  cherry: '🍒',
  cherries: '🍒',
  kiwi: '🥝',
  coconut: '🥥',
  papaya: '🥭',
  pomegranate: '🫐',
  fig: '🫐',
  dates: '🫐',
  // Grains
  rice: '🍚',
  bread: '🍞',
  oats: '🌾',
  oatmeal: '🌾',
  pasta: '🍝',
  quinoa: '🌾',
  wheat: '🌾',
  cereal: '🥣',
  noodles: '🍜',
  // Pantry
  oil: '🫒',
  olive: '🫒',
  honey: '🍯',
  sugar: '🍬',
  salt: '🧂',
  nuts: '🥜',
  almonds: '🥜',
  walnuts: '🥜',
  peanuts: '🥜',
  seeds: '🌻',
  chocolate: '🍫',
  coffee: '☕',
  tea: '🍵',
  juice: '🧃',
  water: '💧',
  // Default fallbacks
  protein: '🍖',
  vegetable: '🥗',
  fruit: '🍎',
  dairy: '🥛',
  grain: '🌾',
  pantry: '🏪',
};

const getEmoji = (itemName: string, category: string): string => {
  const lowerName = itemName.toLowerCase();

  // Check for exact matches first
  for (const [keyword, emoji] of Object.entries(foodEmojis)) {
    if (lowerName.includes(keyword)) {
      return emoji;
    }
  }

  // Fallback to category emoji
  const categoryEmojis: Record<string, string> = {
    proteins: '🍖',
    vegetables: '🥗',
    fruits: '🍎',
    dairy: '🥛',
    grains: '🌾',
    pantryStaples: '🏪',
  };

  return categoryEmojis[category] || '🛒';
};

const categoryIcons: Record<string, string> = {
  proteins: '🍖',
  vegetables: '🥬',
  fruits: '🍎',
  dairy: '🥛',
  grains: '🌾',
  pantryStaples: '🏪',
};

const categoryLabels: Record<string, string> = {
  proteins: 'Proteins',
  vegetables: 'Vegetables',
  fruits: 'Fruits',
  dairy: 'Dairy',
  grains: 'Grains',
  pantryStaples: 'Pantry Staples',
};

export default function GroceryPage() {
  const router = useRouter();
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['proteins', 'vegetables', 'fruits', 'dairy', 'grains', 'pantryStaples'])
  );
  const [estimatedBudget, setEstimatedBudget] = useState<string>('');
  const [shoppingTips, setShoppingTips] = useState<string[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [deficiencyReasons, setDeficiencyReasons] = useState<Record<string, string>>({});

  // Deficiency to food recommendations
  const deficiencyFoods: Record<string, string[]> = {
    iron: ['spinach', 'beef', 'lentils', 'beans', 'eggs', 'tofu', 'quinoa'],
    calcium: ['milk', 'cheese', 'yogurt', 'paneer', 'almonds', 'broccoli', 'kale'],
    b12: ['salmon', 'eggs', 'milk', 'cheese', 'beef', 'chicken', 'tuna'],
    vitamin_d: ['salmon', 'eggs', 'milk', 'mushrooms', 'tuna', 'orange juice'],
    protein: ['chicken', 'eggs', 'fish', 'lentils', 'beans', 'tofu', 'beef', 'paneer'],
    folate: ['spinach', 'asparagus', 'broccoli', 'lentils', 'beans', 'avocado', 'oranges'],
  };

  const deficiencyLabels: Record<string, string> = {
    iron: 'Iron Support',
    calcium: 'Calcium Boost',
    b12: 'B12 Energy',
    vitamin_d: 'Vitamin D',
    protein: 'Protein Power',
    folate: 'Folate Rich',
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchProfile(token);
    fetchGroceryList(token);
  }, [router, weekOffset]);

  const fetchProfile = async (token: string) => {
    try {
      const res = await fetch('/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchGroceryList = async (token: string) => {
    try {
      const res = await fetch(`/api/ai/grocery?weekOffset=${weekOffset}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        // Add emojis to items
        const itemsWithEmojis = (data.items || []).map((item: GroceryItem) => ({
          ...item,
          emoji: item.emoji || getEmoji(item.name, item.category),
        }));
        setItems(itemsWithEmojis);
      }
    } catch (error) {
      console.error('Error fetching grocery list:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const getItemReason = (itemName: string): string | null => {
    if (!profile?.deficiencies?.length) return null;

    const lowerName = itemName.toLowerCase();

    for (const deficiency of profile.deficiencies) {
      const foods = deficiencyFoods[deficiency] || [];
      for (const food of foods) {
        if (lowerName.includes(food.toLowerCase())) {
          return `Recommended for ${deficiencyLabels[deficiency] || deficiency}`;
        }
      }
    }

    return null;
  };

  const generateGroceryList = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch('/api/ai/grocery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ weekOffset }),
      });

      const data = await res.json();

      if (res.ok && data.items) {
        // Add emojis and reasons to items
        const itemsWithExtras = data.items.map((item: GroceryItem) => ({
          ...item,
          emoji: getEmoji(item.name, item.category),
          reason: getItemReason(item.name),
        }));
        setItems(itemsWithExtras);
        setEstimatedBudget(data.estimatedBudget || '');
        setShoppingTips(data.shoppingTips || []);
      } else {
        throw new Error(data.error || 'Failed to generate grocery list');
      }
    } catch (error: any) {
      console.error('Error generating grocery list:', error);
      // Generate sample data on error
      generateSampleGroceryList();
    } finally {
      setLoading(false);
    }
  };

  const generateSampleGroceryList = () => {
    const sampleItems: GroceryItem[] = [
      // Proteins
      { name: 'Salmon Fillet', quantity: '500', unit: 'g', category: 'proteins', checked: false, emoji: '🐟', reason: profile?.deficiencies?.includes('iron') ? 'Rich in Iron & Omega-3' : undefined },
      { name: 'Chicken Breast', quantity: '1', unit: 'kg', category: 'proteins', checked: false, emoji: '🍗', reason: profile?.deficiencies?.includes('protein') ? 'High Quality Protein' : undefined },
      { name: 'Eggs (Large)', quantity: '12', unit: 'pcs', category: 'proteins', checked: false, emoji: '🥚', reason: 'Complete Protein & B12' },
      { name: 'Lentils', quantity: '500', unit: 'g', category: 'proteins', checked: false, emoji: '🫘', reason: profile?.deficiencies?.includes('folate') ? 'Folate & Fiber Rich' : undefined },
      // Vegetables
      { name: 'Fresh Spinach', quantity: '300', unit: 'g', category: 'vegetables', checked: false, emoji: '🥬', reason: profile?.deficiencies?.includes('iron') ? 'Iron & Folate Boost' : undefined },
      { name: 'Broccoli', quantity: '2', unit: 'heads', category: 'vegetables', checked: false, emoji: '🥦', reason: profile?.deficiencies?.includes('calcium') ? 'Calcium & Vitamin C' : undefined },
      { name: 'Carrots', quantity: '500', unit: 'g', category: 'vegetables', checked: false, emoji: '🥕' },
      { name: 'Sweet Potatoes', quantity: '4', unit: 'medium', category: 'vegetables', checked: false, emoji: '🍠' },
      { name: 'Bell Peppers', quantity: '3', unit: 'pcs', category: 'vegetables', checked: false, emoji: '🫑' },
      { name: 'Tomatoes', quantity: '6', unit: 'medium', category: 'vegetables', checked: false, emoji: '🍅' },
      // Fruits
      { name: 'Bananas', quantity: '6', unit: 'pcs', category: 'fruits', checked: false, emoji: '🍌' },
      { name: 'Oranges', quantity: '6', unit: 'pcs', category: 'fruits', checked: false, emoji: '🍊', reason: profile?.deficiencies?.includes('folate') ? 'Folate & Vitamin C' : undefined },
      { name: 'Blueberries', quantity: '250', unit: 'g', category: 'fruits', checked: false, emoji: '🫐' },
      { name: 'Avocados', quantity: '4', unit: 'pcs', category: 'fruits', checked: false, emoji: '🥑', reason: 'Healthy Fats & Folate' },
      { name: 'Apples', quantity: '6', unit: 'pcs', category: 'fruits', checked: false, emoji: '🍎' },
      // Dairy
      { name: 'Greek Yogurt', quantity: '500', unit: 'g', category: 'dairy', checked: false, emoji: '🥛', reason: profile?.deficiencies?.includes('calcium') ? 'Calcium & Probiotics' : undefined },
      { name: 'Whole Milk', quantity: '2', unit: 'L', category: 'dairy', checked: false, emoji: '🥛', reason: profile?.deficiencies?.includes('vitamin_d') ? 'Vitamin D Fortified' : undefined },
      { name: 'Cheese (Cheddar)', quantity: '200', unit: 'g', category: 'dairy', checked: false, emoji: '🧀' },
      // Grains
      { name: 'Brown Rice', quantity: '1', unit: 'kg', category: 'grains', checked: false, emoji: '🍚' },
      { name: 'Whole Wheat Bread', quantity: '1', unit: 'loaf', category: 'grains', checked: false, emoji: '🍞' },
      { name: 'Oatmeal', quantity: '500', unit: 'g', category: 'grains', checked: false, emoji: '🥣' },
      { name: 'Quinoa', quantity: '400', unit: 'g', category: 'grains', checked: false, emoji: '🌾', reason: profile?.deficiencies?.includes('iron') ? 'Iron & Complete Protein' : undefined },
      // Pantry
      { name: 'Olive Oil', quantity: '500', unit: 'ml', category: 'pantryStaples', checked: false, emoji: '🫒' },
      { name: 'Almonds', quantity: '200', unit: 'g', category: 'pantryStaples', checked: false, emoji: '🥜', reason: profile?.deficiencies?.includes('calcium') ? 'Calcium & Healthy Fats' : undefined },
      { name: 'Honey', quantity: '250', unit: 'g', category: 'pantryStaples', checked: false, emoji: '🍯' },
      { name: 'Chia Seeds', quantity: '200', unit: 'g', category: 'pantryStaples', checked: false, emoji: '🌻' },
    ];

    setItems(sampleItems);
    setEstimatedBudget('$120 - $150 CAD');
    setShoppingTips([
      'Buy seasonal produce for better prices and freshness',
      'Check for sales on proteins - stock up and freeze',
      'Choose organic for the Dirty Dozen items when possible',
    ]);
  };

  const toggleItem = async (index: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const newItems = [...items];
    newItems[index].checked = !newItems[index].checked;
    setItems(newItems);

    try {
      await fetch('/api/ai/grocery', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: newItems }),
      });
    } catch (error) {
      console.error('Error saving grocery list:', error);
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const getWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + weekOffset * 7);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return {
      start: monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      end: sunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
  };

  const downloadPDF = () => {
    const weekDates = getWeekDates();
    const motherName = profile?.fullName || 'Mom';
    const pregnancyMonth = profile?.pregnancyMonth || 6;
    const deficiencies = profile?.deficiencies || [];

    // Create HTML content for PDF
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Grocery List - ${motherName}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Inter', -apple-system, sans-serif;
            color: #1f2937;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
          }

          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #ec4899;
          }

          .logo {
            font-size: 24px;
            font-weight: 700;
            color: #9333ea;
            margin-bottom: 5px;
          }

          .title {
            font-size: 20px;
            color: #374151;
            margin-bottom: 10px;
          }

          .meta {
            display: flex;
            justify-content: center;
            gap: 20px;
            font-size: 14px;
            color: #6b7280;
          }

          .meta-item {
            background: #f3f4f6;
            padding: 8px 16px;
            border-radius: 20px;
          }

          .deficiencies {
            background: linear-gradient(135deg, #fdf2f8, #faf5ff);
            padding: 15px 20px;
            border-radius: 12px;
            margin-bottom: 25px;
          }

          .deficiencies-title {
            font-size: 14px;
            font-weight: 600;
            color: #9333ea;
            margin-bottom: 8px;
          }

          .deficiencies-list {
            font-size: 13px;
            color: #6b7280;
          }

          .category {
            margin-bottom: 25px;
          }

          .category-header {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e5e7eb;
          }

          .items {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }

          .item {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            padding: 10px 12px;
            background: #f9fafb;
            border-radius: 8px;
            font-size: 14px;
          }

          .item-emoji {
            font-size: 16px;
          }

          .item-checkbox {
            width: 16px;
            height: 16px;
            border: 2px solid #d1d5db;
            border-radius: 4px;
            flex-shrink: 0;
          }

          .item-checked .item-checkbox {
            background: #10b981;
            border-color: #10b981;
          }

          .item-checked .item-name {
            text-decoration: line-through;
            color: #9ca3af;
          }

          .item-name {
            flex: 1;
          }

          .item-qty {
            color: #6b7280;
            font-size: 13px;
          }

          .item-reason {
            font-size: 11px;
            color: #9333ea;
            margin-top: 2px;
          }

          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
          }

          .tips {
            background: #f0fdf4;
            padding: 15px 20px;
            border-radius: 12px;
            margin-top: 25px;
          }

          .tips-title {
            font-size: 14px;
            font-weight: 600;
            color: #059669;
            margin-bottom: 10px;
          }

          .tips-list {
            font-size: 13px;
            color: #374151;
          }

          .tips-list li {
            margin-bottom: 5px;
            padding-left: 5px;
          }

          @media print {
            body { padding: 20px; }
            .items { gap: 5px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">💜 BirthTech.ai</div>
          <div class="title">Weekly Grocery List</div>
          <div class="meta">
            <span class="meta-item">👩 ${motherName}</span>
            <span class="meta-item">📅 ${weekDates.start} - ${weekDates.end}</span>
            <span class="meta-item">🤰 Month ${pregnancyMonth}</span>
          </div>
        </div>

        ${deficiencies.length > 0 ? `
        <div class="deficiencies">
          <div class="deficiencies-title">🎯 Nutrition Focus Areas</div>
          <div class="deficiencies-list">
            ${deficiencies.map((d: string) => deficiencyLabels[d] || d).join(' • ')}
          </div>
        </div>
        ` : ''}

        ${Object.entries(groupedItems).map(([category, categoryItems]) => `
          <div class="category">
            <div class="category-header">
              <span>${categoryIcons[category] || '🛒'}</span>
              <span>${categoryLabels[category] || category}</span>
              <span style="color: #9ca3af; font-weight: normal; font-size: 14px;">(${(categoryItems as GroceryItem[]).length})</span>
            </div>
            <div class="items">
              ${(categoryItems as GroceryItem[]).map(item => `
                <div class="item ${item.checked ? 'item-checked' : ''}">
                  <span class="item-checkbox"></span>
                  <span class="item-emoji">${item.emoji || getEmoji(item.name, category)}</span>
                  <div style="flex: 1;">
                    <span class="item-name">${item.name}</span>
                    ${item.reason ? `<div class="item-reason">✨ ${item.reason}</div>` : ''}
                  </div>
                  <span class="item-qty">${item.quantity}${item.unit ? ' ' + item.unit : ''}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}

        ${shoppingTips.length > 0 ? `
        <div class="tips">
          <div class="tips-title">💡 Shopping Tips</div>
          <ul class="tips-list">
            ${shoppingTips.map(tip => `<li>• ${tip}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        ${estimatedBudget ? `
        <div style="text-align: center; margin-top: 20px; padding: 15px; background: #faf5ff; border-radius: 12px;">
          <span style="font-size: 14px; color: #6b7280;">Estimated Budget: </span>
          <span style="font-size: 18px; font-weight: 600; color: #9333ea;">${estimatedBudget}</span>
        </div>
        ` : ''}

        <div class="footer">
          <p>Generated by BirthTech.ai - Your AI Pregnancy Companion</p>
          <p style="margin-top: 5px;">This is not medical advice. Always consult your healthcare provider.</p>
        </div>
      </body>
      </html>
    `;

    // Open print dialog
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || 'pantryStaples';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, GroceryItem[]>);

  const checkedCount = items.filter((item) => item.checked).length;
  const progress = items.length > 0 ? (checkedCount / items.length) * 100 : 0;
  const weekDates = getWeekDates();

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <Heart className="w-12 h-12 text-pink-500 mx-auto animate-pulse" fill="#ec4899" />
          <p className="mt-4 text-gray-600">Loading grocery list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">Grocery List</h1>
              <p className="text-xs text-gray-500">
                {items.length > 0 ? `${checkedCount}/${items.length} items` : 'Weekly shopping'}
              </p>
            </div>
          </div>
          {items.length > 0 && (
            <button
              onClick={downloadPDF}
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full"
              title="Download PDF"
            >
              <Download className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Week Navigation */}
        <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setWeekOffset(weekOffset - 1)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-500" />
              <span className="font-medium text-gray-900">
                {weekDates.start} - {weekDates.end}
              </span>
              {weekOffset === 0 && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  This Week
                </span>
              )}
            </div>
            <button
              onClick={() => setWeekOffset(weekOffset + 1)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Deficiency Info Banner */}
        {profile?.deficiencies?.length > 0 && items.length > 0 && (
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 mb-4 flex items-start gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-900">Personalized for You</p>
              <p className="text-xs text-purple-700 mt-1">
                Items marked with ✨ are specially recommended based on your nutrition needs: {' '}
                {profile.deficiencies.map((d: string) => deficiencyLabels[d] || d).join(', ')}
              </p>
            </div>
          </div>
        )}

        {/* Generate Button */}
        {items.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Weekly Grocery List</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Generate a personalized grocery list based on your pregnancy nutrition needs
              {profile?.deficiencies?.length > 0 && ' and targeted for your nutritional requirements'}.
            </p>
            <button
              onClick={generateGroceryList}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow flex items-center gap-2 mx-auto"
            >
              <Sparkles className="w-5 h-5" />
              Generate Grocery List
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 text-green-500 mx-auto animate-spin" />
            <p className="mt-4 text-gray-600">Creating your grocery list...</p>
            <p className="text-sm text-gray-400 mt-2">This may take a moment</p>
          </div>
        )}

        {/* Grocery List Display */}
        {items.length > 0 && !loading && (
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Shopping Progress</span>
                <span className="text-sm font-medium text-gray-900">{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {progress === 100 && (
                <p className="text-center text-green-600 text-sm mt-2 font-medium">
                  🎉 All done! Great job!
                </p>
              )}
            </div>

            {/* Regenerate Button */}
            <div className="flex justify-end">
              <button
                onClick={generateGroceryList}
                className="flex items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </button>
            </div>

            {/* Categories */}
            {Object.entries(groupedItems).map(([category, categoryItems]) => (
              <div key={category} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{categoryIcons[category] || '🛒'}</span>
                    <span className="font-semibold text-gray-900">
                      {categoryLabels[category] || category}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({(categoryItems as GroceryItem[]).filter((i) => i.checked).length}/{(categoryItems as GroceryItem[]).length})
                    </span>
                  </div>
                  {expandedCategories.has(category) ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {expandedCategories.has(category) && (
                  <div className="px-4 pb-4 space-y-2">
                    {(categoryItems as GroceryItem[]).map((item, i) => {
                      const globalIndex = items.findIndex(
                        (it) => it.name === item.name && it.category === item.category
                      );
                      const reason = item.reason || getItemReason(item.name);
                      return (
                        <button
                          key={i}
                          onClick={() => toggleItem(globalIndex)}
                          className={`w-full p-3 rounded-xl flex items-start gap-3 transition-colors text-left ${
                            item.checked
                              ? 'bg-green-50 text-gray-400'
                              : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 mt-0.5 ${
                              item.checked
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-300'
                            }`}
                          >
                            {item.checked && <Check className="w-4 h-4 text-white" />}
                          </div>
                          <span className="text-xl">{item.emoji || getEmoji(item.name, category)}</span>
                          <div className="flex-1 min-w-0">
                            <span className={`block ${item.checked ? 'line-through' : ''}`}>
                              {item.name}
                            </span>
                            {reason && !item.checked && (
                              <span className="text-xs text-purple-600 flex items-center gap-1 mt-1">
                                <Sparkles className="w-3 h-3" />
                                {reason}
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-500 flex-shrink-0">
                            {item.quantity}{item.unit ? ` ${item.unit}` : ''}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {/* Budget & Tips */}
            {(estimatedBudget || shoppingTips.length > 0) && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-5 text-white">
                {estimatedBudget && (
                  <div className="mb-4">
                    <p className="text-sm text-green-100">Estimated Budget</p>
                    <p className="text-2xl font-bold">{estimatedBudget}</p>
                  </div>
                )}
                {shoppingTips.length > 0 && (
                  <div>
                    <p className="font-semibold mb-2 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Shopping Tips
                    </p>
                    <ul className="text-sm text-green-100 space-y-1">
                      {shoppingTips.map((tip, i) => (
                        <li key={i}>• {tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Download PDF Button */}
            <button
              onClick={downloadPDF}
              className="w-full py-4 bg-white rounded-2xl shadow-sm flex items-center justify-center gap-3 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Download className="w-5 h-5 text-green-500" />
              <span className="font-medium">Download PDF</span>
              <span className="text-sm text-gray-400">
                ({profile?.fullName || 'Mom'} • Month {profile?.pregnancyMonth || 6})
              </span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
