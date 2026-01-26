import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { generateMealPlan } from '@/lib/openai';

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
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const mealPlan = await generateMealPlan({
      pregnancyMonth: profile.pregnancyMonth,
      dietPreference: profile.dietPreference,
      allergies: profile.allergies,
      existingConditions: profile.existingConditions,
      exerciseLevel: profile.exerciseLevel,
      foodAversions: profile.foodAversions,
    });

    // Save to daily plan
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.dailyPlan.upsert({
      where: { userId_planDate: { userId, planDate: today } },
      update: { meals: mealPlan },
      create: { userId, planDate: today, meals: mealPlan },
    });

    return NextResponse.json({
      success: true,
      mealPlan,
      disclaimer: 'This meal plan is for general guidance only. Consult your healthcare provider for personalized nutrition advice.',
    });
  } catch (error: any) {
    console.error('Meal plan error:', error);
    return NextResponse.json(
      { error: 'Failed to generate meal plan', details: error.message },
      { status: 500 }
    );
  }
}
