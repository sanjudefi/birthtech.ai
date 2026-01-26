import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'birthtech-jwt-secret-2026';

function getUserIdFromToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
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

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      // Basic Info
      pregnancyMonth,
      dueDate,
      lastPeriodDate,
      // Physical
      heightCm,
      weightKg,
      prePregnancyWeight,
      bloodType,
      // Diet
      dietPreference,
      allergies,
      foodAversions,
      // Medical
      existingConditions,
      currentMedications,
      previousPregnancies,
      complications,
      // Doctor Info
      doctorName,
      doctorPhone,
      hospitalName,
      // Preferences
      exerciseLevel,
      sleepHours,
      waterIntakeGoal,
    } = body;

    // Check if profile already exists - use upsert instead of error
    const profile = await prisma.pregnancyProfile.upsert({
      where: { userId },
      update: {
        pregnancyMonth,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        lastPeriodDate: lastPeriodDate ? new Date(lastPeriodDate) : undefined,
        heightCm,
        weightKg,
        prePregnancyWeight,
        bloodType,
        dietPreference,
        allergies: allergies || [],
        foodAversions: foodAversions || [],
        existingConditions: existingConditions || [],
        currentMedications: currentMedications || [],
        previousPregnancies: previousPregnancies || 0,
        complications: complications || [],
        doctorName,
        doctorPhone,
        hospitalName,
        exerciseLevel,
        sleepHours,
        waterIntakeGoal,
      },
      create: {
        userId,
        pregnancyMonth,
        dueDate: new Date(dueDate),
        lastPeriodDate: lastPeriodDate ? new Date(lastPeriodDate) : null,
        heightCm,
        weightKg,
        prePregnancyWeight,
        bloodType,
        dietPreference: dietPreference || 'non-veg',
        allergies: allergies || [],
        foodAversions: foodAversions || [],
        existingConditions: existingConditions || [],
        currentMedications: currentMedications || [],
        previousPregnancies: previousPregnancies || 0,
        complications: complications || [],
        doctorName,
        doctorPhone,
        hospitalName,
        exerciseLevel: exerciseLevel || 'moderate',
        sleepHours,
        waterIntakeGoal: waterIntakeGoal || 8,
      },
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (error: any) {
    console.error('Create profile error:', error);
    return NextResponse.json(
      { error: 'Something went wrong', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Build update data dynamically - only include fields that are provided
    const updateData: any = {};

    if (body.pregnancyMonth !== undefined) updateData.pregnancyMonth = body.pregnancyMonth;
    if (body.dueDate !== undefined) updateData.dueDate = new Date(body.dueDate);
    if (body.lastPeriodDate !== undefined) updateData.lastPeriodDate = body.lastPeriodDate ? new Date(body.lastPeriodDate) : null;
    if (body.heightCm !== undefined) updateData.heightCm = body.heightCm;
    if (body.weightKg !== undefined) updateData.weightKg = body.weightKg;
    if (body.prePregnancyWeight !== undefined) updateData.prePregnancyWeight = body.prePregnancyWeight;
    if (body.bloodType !== undefined) updateData.bloodType = body.bloodType;
    if (body.dietPreference !== undefined) updateData.dietPreference = body.dietPreference;
    if (body.allergies !== undefined) updateData.allergies = body.allergies;
    if (body.foodAversions !== undefined) updateData.foodAversions = body.foodAversions;
    if (body.existingConditions !== undefined) updateData.existingConditions = body.existingConditions;
    if (body.currentMedications !== undefined) updateData.currentMedications = body.currentMedications;
    if (body.previousPregnancies !== undefined) updateData.previousPregnancies = body.previousPregnancies;
    if (body.complications !== undefined) updateData.complications = body.complications;
    if (body.doctorName !== undefined) updateData.doctorName = body.doctorName;
    if (body.doctorPhone !== undefined) updateData.doctorPhone = body.doctorPhone;
    if (body.hospitalName !== undefined) updateData.hospitalName = body.hospitalName;
    if (body.exerciseLevel !== undefined) updateData.exerciseLevel = body.exerciseLevel;
    if (body.sleepHours !== undefined) updateData.sleepHours = body.sleepHours;
    if (body.waterIntakeGoal !== undefined) updateData.waterIntakeGoal = body.waterIntakeGoal;

    const profile = await prisma.pregnancyProfile.update({
      where: { userId },
      data: updateData,
    });

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Something went wrong', details: error.message },
      { status: 500 }
    );
  }
}
