import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { generateWorkout } from '@/lib/openai';

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

    const workout = await generateWorkout({
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
      where: {
        userId_planDate: {
          userId,
          planDate: today,
        },
      },
      update: {
        workout: workout as any,
      },
      create: {
        userId,
        planDate: today,
        meals: {},
        workout: workout as any,
      },
    });

    return NextResponse.json({
      success: true,
      workout,
      disclaimer: 'Always listen to your body. Stop if you feel pain, dizziness, or shortness of breath.',
    });
  } catch (error: any) {
    console.error('Workout generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate workout', details: error.message },
      { status: 500 }
    );
  }
}
