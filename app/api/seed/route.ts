import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

// This endpoint seeds the database with test users
// In production, you would protect this or remove it
export async function POST(request: NextRequest) {
  try {
    // Optional: Add a secret key check for security
    const { secret } = await request.json().catch(() => ({}));

    // Simple protection - you can remove this in development
    if (process.env.NODE_ENV === 'production' && secret !== process.env.SEED_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Seeding database...');

    // Create test user: sanju@catchway.com / 12345
    const testUserPassword = await bcrypt.hash('12345', 12);
    const testUser = await prisma.user.upsert({
      where: { email: 'sanju@catchway.com' },
      update: {
        passwordHash: testUserPassword,
      },
      create: {
        email: 'sanju@catchway.com',
        passwordHash: testUserPassword,
        firstName: 'Sanju',
        lastName: 'User',
        emailVerified: true,
      },
    });

    // Create subscription for test user
    await prisma.subscription.upsert({
      where: { userId: testUser.id },
      update: { status: 'active' },
      create: {
        userId: testUser.id,
        planType: 'premium',
        status: 'active',
        stripeCustomerId: 'demo_customer_test',
        stripeSubscriptionId: 'demo_sub_test',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    // Create pregnancy profile for test user
    await prisma.pregnancyProfile.upsert({
      where: { userId: testUser.id },
      update: {},
      create: {
        userId: testUser.id,
        pregnancyMonth: 6,
        dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        heightCm: 165,
        weightKg: 62,
        dietPreference: 'non-veg',
        allergies: [],
      },
    });

    // Create admin user: admin@birthtech.ai / admin123
    const adminPassword = await bcrypt.hash('admin123', 12);
    await prisma.user.upsert({
      where: { email: 'admin@birthtech.ai' },
      update: {
        passwordHash: adminPassword,
        isAdmin: true,
      },
      create: {
        email: 'admin@birthtech.ai',
        passwordHash: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        emailVerified: true,
        isAdmin: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      users: [
        { email: 'sanju@catchway.com', password: '12345', role: 'user' },
        { email: 'admin@birthtech.ai', password: 'admin123', role: 'admin' },
      ],
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint to seed the database',
    note: 'This creates test users for development',
  });
}
