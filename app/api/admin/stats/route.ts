import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'birthtech-jwt-secret-2026';

function verifyAdminToken(request: NextRequest): { userId: string; isAdmin: boolean } | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; isAdmin: boolean };

    if (!decoded.isAdmin) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = verifyAdminToken(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all users with their subscriptions and profiles
    const users = await prisma.user.findMany({
      where: { isAdmin: false },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        subscription: {
          select: {
            planType: true,
            status: true,
          },
        },
        pregnancyProfile: {
          select: {
            pregnancyMonth: true,
            dueDate: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate stats
    const totalUsers = users.length;
    const activeSubscriptions = users.filter(
      (u) => u.subscription?.status === 'active'
    ).length;
    const basicPlans = users.filter(
      (u) => u.subscription?.planType === 'basic' && u.subscription?.status === 'active'
    ).length;
    const premiumPlans = users.filter(
      (u) => u.subscription?.planType === 'premium' && u.subscription?.status === 'active'
    ).length;

    // Calculate revenue (basic = $10, premium = $20)
    const totalRevenue = basicPlans * 10 + premiumPlans * 20;

    return NextResponse.json({
      users,
      stats: {
        totalUsers,
        activeSubscriptions,
        basicPlans,
        premiumPlans,
        totalRevenue,
      },
    });
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
