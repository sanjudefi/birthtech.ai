import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { generateWeeklyWorkoutPlan } from '@/lib/openai';

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

function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekEnd(weekStart: Date): Date {
  const d = new Date(weekStart);
  d.setDate(d.getDate() + 6);
  d.setHours(23, 59, 59, 999);
  return d;
}

// GET - Fetch weekly workout plan history
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const weekStartParam = searchParams.get('weekStart');

    if (weekStartParam) {
      // Get specific week's plan
      const weekStart = new Date(weekStartParam);
      const plan = await prisma.weeklyPlan.findUnique({
        where: { userId_weekStart: { userId, weekStart } },
      });
      return NextResponse.json({ plan });
    }

    // Get all weekly plans with workouts (history)
    const plans = await prisma.weeklyPlan.findMany({
      where: {
        userId,
        workouts: { not: null }
      },
      orderBy: { weekStart: 'desc' },
      take: 12,
    });

    return NextResponse.json({ plans });
  } catch (error: any) {
    console.error('Get weekly workout plans error:', error);
    return NextResponse.json({ error: 'Failed to fetch workout plans' }, { status: 500 });
  }
}

// POST - Generate new weekly workout plan
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

    // Calculate week number
    const existingPlans = await prisma.weeklyPlan.count({
      where: { userId, workouts: { not: null } }
    });
    const weekNumber = existingPlans + 1;

    const weekStart = getWeekStart();
    const weekEnd = getWeekEnd(weekStart);

    // Check if workout plan already exists for this week
    const existingPlan = await prisma.weeklyPlan.findUnique({
      where: { userId_weekStart: { userId, weekStart } },
    });

    if (existingPlan?.workouts) {
      return NextResponse.json({
        success: true,
        plan: existingPlan,
        message: 'Using existing workout plan for this week',
      });
    }

    // Generate new workout plan
    const workoutPlan = await generateWeeklyWorkoutPlan({
      pregnancyMonth: profile.pregnancyMonth,
      dietPreference: profile.dietPreference,
      allergies: profile.allergies,
      existingConditions: profile.existingConditions,
      exerciseLevel: profile.exerciseLevel,
      foodAversions: profile.foodAversions,
    }, weekNumber);

    // Save to database - upsert to handle case where meals exist but workouts don't
    const savedPlan = await prisma.weeklyPlan.upsert({
      where: { userId_weekStart: { userId, weekStart } },
      update: { workouts: workoutPlan },
      create: {
        userId,
        weekStart,
        weekEnd,
        meals: {},
        workouts: workoutPlan,
      },
    });

    return NextResponse.json({
      success: true,
      plan: savedPlan,
      disclaimer: 'Always listen to your body. Stop if you feel pain, dizziness, or shortness of breath.',
    });
  } catch (error: any) {
    console.error('Weekly workout plan error:', error);
    return NextResponse.json(
      { error: 'Failed to generate workout plan', details: error.message },
      { status: 500 }
    );
  }
}
