import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { generateGroceryList } from '@/lib/openai';

const JWT_SECRET = process.env.JWT_SECRET || 'birthtech-jwt-secret-2026';

function getUserIdFromToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.pregnancyProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found. Please complete onboarding.' }, { status: 404 });
    }

    const groceryData = await generateGroceryList({
      pregnancyMonth: profile.pregnancyMonth,
      dietPreference: profile.dietPreference,
      allergies: profile.allergies,
      existingConditions: profile.existingConditions,
      exerciseLevel: profile.exerciseLevel,
      foodAversions: profile.foodAversions,
    });

    // Get Monday of current week
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    monday.setHours(0, 0, 0, 0);

    // Convert to flat items list with categories
    const items: any[] = [];
    const categories = ['proteins', 'vegetables', 'fruits', 'dairy', 'grains', 'pantryStaples'];

    for (const category of categories) {
      const categoryItems = (groceryData as any)[category] || [];
      for (const item of categoryItems) {
        items.push({
          name: item.name,
          quantity: item.quantity,
          unit: item.unit || '',
          category,
          checked: false,
        });
      }
    }

    // Save to database
    const groceryList = await prisma.groceryList.upsert({
      where: {
        userId_weekStart: {
          userId,
          weekStart: monday,
        },
      },
      update: {
        items: items,
      },
      create: {
        userId,
        weekStart: monday,
        items: items,
      },
    });

    return NextResponse.json({
      success: true,
      groceryList: groceryData,
      items,
      estimatedBudget: (groceryData as any).estimatedBudget,
      shoppingTips: (groceryData as any).shoppingTips,
    });
  } catch (error: any) {
    console.error('Grocery list generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate grocery list', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get Monday of current week
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    monday.setHours(0, 0, 0, 0);

    const groceryList = await prisma.groceryList.findUnique({
      where: {
        userId_weekStart: {
          userId,
          weekStart: monday,
        },
      },
    });

    if (!groceryList) {
      return NextResponse.json({ items: [], message: 'No grocery list for this week. Generate one!' });
    }

    return NextResponse.json({
      items: groceryList.items,
      weekStart: groceryList.weekStart,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch grocery list' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items } = await request.json();

    // Get Monday of current week
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    monday.setHours(0, 0, 0, 0);

    const groceryList = await prisma.groceryList.update({
      where: {
        userId_weekStart: {
          userId,
          weekStart: monday,
        },
      },
      data: {
        items,
      },
    });

    return NextResponse.json({ success: true, items: groceryList.items });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update grocery list' }, { status: 500 });
  }
}
