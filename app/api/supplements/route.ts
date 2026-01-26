import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

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

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supplements = await prisma.supplement.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ supplements });
  } catch (error: any) {
    console.error('Get supplements error:', error);
    return NextResponse.json({ error: 'Failed to fetch supplements' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, dosage, frequency, timeOfDay, notes } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const supplement = await prisma.supplement.create({
      data: {
        userId,
        name,
        dosage: dosage || '',
        frequency: frequency || 'daily',
        timeOfDay: timeOfDay || ['morning'],
        notes,
        isActive: true,
      },
    });

    return NextResponse.json({ supplement }, { status: 201 });
  } catch (error: any) {
    console.error('Create supplement error:', error);
    return NextResponse.json({ error: 'Failed to create supplement' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, dosage, frequency, timeOfDay, notes, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'Supplement ID is required' }, { status: 400 });
    }

    const supplement = await prisma.supplement.update({
      where: { id, userId },
      data: {
        name,
        dosage,
        frequency,
        timeOfDay,
        notes,
        isActive,
      },
    });

    return NextResponse.json({ supplement });
  } catch (error: any) {
    console.error('Update supplement error:', error);
    return NextResponse.json({ error: 'Failed to update supplement' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Supplement ID is required' }, { status: 400 });
    }

    await prisma.supplement.delete({
      where: { id, userId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete supplement error:', error);
    return NextResponse.json({ error: 'Failed to delete supplement' }, { status: 500 });
  }
}
