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
    const { pregnancyMonth, dueDate, heightCm, weightKg, dietPreference, allergies } = body;

    // Check if profile already exists
    const existingProfile = await prisma.pregnancyProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Profile already exists. Use PUT to update.' },
        { status: 400 }
      );
    }

    const profile = await prisma.pregnancyProfile.create({
      data: {
        userId,
        pregnancyMonth,
        dueDate: new Date(dueDate),
        heightCm,
        weightKg,
        dietPreference,
        allergies: allergies || [],
      },
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error('Create profile error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
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
    const { pregnancyMonth, dueDate, heightCm, weightKg, dietPreference, allergies } = body;

    const profile = await prisma.pregnancyProfile.update({
      where: { userId },
      data: {
        pregnancyMonth,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        heightCm,
        weightKg,
        dietPreference,
        allergies: allergies || [],
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
