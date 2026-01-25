import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CarePlanGenerator } from './care-plan-generator';

@Injectable()
export class CareService {
  constructor(
    private prisma: PrismaService,
    private carePlanGenerator: CarePlanGenerator,
  ) {}

  async getTodaysCare(userId: string) {
    const profile = await this.prisma.pregnancyProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Please complete your pregnancy profile first');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const today = new Date();
    const dayOfWeek = today.getDay();

    const carePlan = this.carePlanGenerator.generateDailyCarePlan(
      profile.pregnancyMonth,
      profile.dietPreference,
      dayOfWeek,
    );

    const babySize = this.carePlanGenerator.getBabySizeComparison(profile.pregnancyMonth);
    const pregnancyWeek = this.carePlanGenerator.getPregnancyWeek(profile.pregnancyMonth);

    return {
      greeting: this.generateGreeting(user?.firstName),
      pregnancyInfo: {
        month: profile.pregnancyMonth,
        week: pregnancyWeek,
        babySize: babySize.size,
        babySizeEmoji: babySize.emoji,
        dueDate: profile.dueDate,
      },
      todaysCare: {
        meals: carePlan.meals,
        exercise: {
          minutes: carePlan.exerciseMinutes,
          type: carePlan.exerciseType,
        },
        hydration: {
          targetGlasses: carePlan.hydrationGlasses,
          completed: 0, // Client tracks this
        },
        sleepTip: carePlan.sleepTip,
        wellnessTip: carePlan.wellnessTip,
        safetyNote: carePlan.safetyNote,
      },
      disclaimer: 'This is guidance only, not medical advice. Always consult your healthcare provider for personalized care.',
    };
  }

  async getWeeklyCalendar(userId: string) {
    const profile = await this.prisma.pregnancyProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Please complete your pregnancy profile first');
    }

    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Start from Sunday

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);

      const carePlan = this.carePlanGenerator.generateDailyCarePlan(
        profile.pregnancyMonth,
        profile.dietPreference,
        i,
      );

      weekDays.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate(),
        isToday: date.toDateString() === today.toDateString(),
        isPast: date < today && date.toDateString() !== today.toDateString(),
        summary: {
          mealHighlight: carePlan.meals.breakfast.name,
          exerciseMinutes: carePlan.exerciseMinutes,
          exerciseType: carePlan.exerciseType,
        },
      });
    }

    return {
      weekStart: weekStart.toISOString().split('T')[0],
      weekEnd: new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      days: weekDays,
    };
  }

  async getWeeklyInventory(userId: string) {
    const profile = await this.prisma.pregnancyProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Please complete your pregnancy profile first');
    }

    const inventory = this.carePlanGenerator.generateWeeklyInventory(
      profile.dietPreference,
    );

    return {
      title: 'Weekly Grocery List',
      description: 'Based on your meal plan this week',
      inventory,
    };
  }

  async getMonthlyStaples(userId: string) {
    const profile = await this.prisma.pregnancyProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Please complete your pregnancy profile first');
    }

    const staples = this.carePlanGenerator.generateMonthlyStaples(
      profile.pregnancyMonth,
      profile.dietPreference,
    );

    return {
      title: `Monthly Staples (Month ${profile.pregnancyMonth})`,
      description: "Essential nutrients for your baby's development",
      pregnancyMonth: profile.pregnancyMonth,
      staples,
    };
  }

  private generateGreeting(firstName?: string | null): string {
    const hour = new Date().getHours();
    let timeGreeting: string;

    if (hour < 12) {
      timeGreeting = 'Good morning';
    } else if (hour < 17) {
      timeGreeting = 'Good afternoon';
    } else {
      timeGreeting = 'Good evening';
    }

    const name = firstName || 'there';
    return `${timeGreeting}, ${name}!`;
  }
}
