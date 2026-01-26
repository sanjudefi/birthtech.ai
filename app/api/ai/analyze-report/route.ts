import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { analyzeReport } from '@/lib/openai';

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

// POST - Analyze uploaded report and generate 3-tab content
export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { reportId, reportContent, reportType } = body;

    if (!reportContent) {
      return NextResponse.json({ error: 'Report content is required' }, { status: 400 });
    }

    const profile = await prisma.pregnancyProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Generate analysis with OpenAI
    const analysis = await analyzeReport({
      pregnancyMonth: profile.pregnancyMonth,
      dietPreference: profile.dietPreference,
      allergies: profile.allergies,
      existingConditions: profile.existingConditions,
      exerciseLevel: profile.exerciseLevel,
    }, reportContent, reportType || 'general');

    // If reportId provided, save analysis to database
    if (reportId) {
      // Save summary analysis
      await prisma.reportAnalysis.create({
        data: {
          userId,
          reportId,
          analysisType: 'summary',
          content: JSON.stringify(analysis.summary),
        },
      });

      // Save diet plan analysis
      await prisma.reportAnalysis.create({
        data: {
          userId,
          reportId,
          analysisType: 'diet_plan',
          content: JSON.stringify(analysis.dietPlan),
        },
      });

      // Save workout plan analysis
      await prisma.reportAnalysis.create({
        data: {
          userId,
          reportId,
          analysisType: 'workout_plan',
          content: JSON.stringify(analysis.workoutPlan),
        },
      });

      // Update report with AI summary
      await prisma.medicalReport.update({
        where: { id: reportId },
        data: { aiSummary: analysis.summary.keyFindings?.join('. ') || 'Analysis complete' },
      });
    }

    return NextResponse.json({
      success: true,
      analysis,
      disclaimer: analysis.disclaimer,
    });
  } catch (error: any) {
    console.error('Report analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze report', details: error.message },
      { status: 500 }
    );
  }
}

// GET - Fetch analysis for a specific report
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get('reportId');

    if (!reportId) {
      return NextResponse.json({ error: 'Report ID required' }, { status: 400 });
    }

    const analyses = await prisma.reportAnalysis.findMany({
      where: { reportId, userId },
      orderBy: { createdAt: 'desc' },
    });

    // Format for 3-tab display
    const formatted = {
      summary: null as any,
      dietPlan: null as any,
      workoutPlan: null as any,
    };

    for (const analysis of analyses) {
      try {
        const content = JSON.parse(analysis.content);
        if (analysis.analysisType === 'summary') formatted.summary = content;
        if (analysis.analysisType === 'diet_plan') formatted.dietPlan = content;
        if (analysis.analysisType === 'workout_plan') formatted.workoutPlan = content;
      } catch {
        // Skip malformed JSON
      }
    }

    return NextResponse.json({ analysis: formatted });
  } catch (error: any) {
    console.error('Get report analysis error:', error);
    return NextResponse.json({ error: 'Failed to fetch analysis' }, { status: 500 });
  }
}
