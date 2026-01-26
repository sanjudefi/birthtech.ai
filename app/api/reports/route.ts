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

    const reports = await prisma.medicalReport.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ reports });
  } catch (error: any) {
    console.error('Get reports error:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { fileName, fileType, reportType, reportDate, notes } = body;

    if (!fileName) {
      return NextResponse.json({ error: 'File name is required' }, { status: 400 });
    }

    // For now, we're storing without actual file upload
    // In production, you'd upload to S3/Cloudinary first and store the URL
    const report = await prisma.medicalReport.create({
      data: {
        userId,
        fileName,
        fileUrl: '', // Would be the cloud storage URL
        fileType: fileType || 'pdf',
        reportType: reportType || 'general',
        reportDate: reportDate ? new Date(reportDate) : new Date(),
        notes,
      },
    });

    return NextResponse.json({ report }, { status: 201 });
  } catch (error: any) {
    console.error('Create report error:', error);
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
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
      return NextResponse.json({ error: 'Report ID is required' }, { status: 400 });
    }

    await prisma.medicalReport.delete({
      where: { id, userId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete report error:', error);
    return NextResponse.json({ error: 'Failed to delete report' }, { status: 500 });
  }
}
