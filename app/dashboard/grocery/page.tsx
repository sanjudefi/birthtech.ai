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
  Copy,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface GroceryItem {
  name: string;
  quantity: string;
  unit: string;
  category: string;
  checked: boolean;
}

const categoryIcons: Record<string, string> = {
  proteins: '',
  vegetables: '',
  fruits: '',
  dairy: '',
  grains: '',
  pantryStaples: '',
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
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['proteins', 'vegetables', 'fruits', 'dairy', 'grains', 'pantryStaples']));
  const [estimatedBudget, setEstimatedBudget] = useState<string>('');
  const [shoppingTips, setShoppingTips] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchGroceryList(token);
  }, [router]);

  const fetchGroceryList = async (token: string) => {
    try {
      const res = await fetch('/api/ai/grocery', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (error) {
      console.error('Error fetching grocery list:', error);
    } finally {
      setInitialLoading(false);
    }
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
      });

      const data = await res.json();

      if (res.ok && data.items) {
        setItems(data.items);
        setEstimatedBudget(data.estimatedBudget || '');
        setShoppingTips(data.shoppingTips || []);
      } else {
        throw new Error(data.error || 'Failed to generate grocery list');
      }
    } catch (error: any) {
      console.error('Error generating grocery list:', error);
      alert('Failed to generate grocery list. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = async (index: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const newItems = [...items];
    newItems[index].checked = !newItems[index].checked;
    setItems(newItems);

    // Save to backend
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

  const copyToClipboard = () => {
    const text = items
      .map((item) => `${item.checked ? '[ ]' : '[ ]'} ${item.name} - ${item.quantity}${item.unit ? ' ' + item.unit : ''}`)
      .join('\n');

    navigator.clipboard.writeText(text);
    alert('Grocery list copied to clipboard!');
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
              onClick={copyToClipboard}
              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full"
              title="Copy to clipboard"
            >
              <Copy className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Generate Button */}
        {items.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Weekly Grocery List</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Generate a personalized grocery list based on your pregnancy nutrition needs.
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
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
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
                    <span className="text-xl">{categoryIcons[category] || ''}</span>
                    <span className="font-semibold text-gray-900">
                      {categoryLabels[category] || category}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({categoryItems.filter((i) => i.checked).length}/{categoryItems.length})
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
                    {categoryItems.map((item, i) => {
                      const globalIndex = items.findIndex(
                        (it) => it.name === item.name && it.category === item.category
                      );
                      return (
                        <button
                          key={i}
                          onClick={() => toggleItem(globalIndex)}
                          className={`w-full p-3 rounded-xl flex items-center gap-3 transition-colors ${
                            item.checked
                              ? 'bg-green-50 text-gray-400'
                              : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              item.checked
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-300'
                            }`}
                          >
                            {item.checked && <Check className="w-4 h-4 text-white" />}
                          </div>
                          <span className={`flex-1 text-left ${item.checked ? 'line-through' : ''}`}>
                            {item.name}
                          </span>
                          <span className="text-sm text-gray-500">
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
          </div>
        )}
      </main>
    </div>
  );
}
