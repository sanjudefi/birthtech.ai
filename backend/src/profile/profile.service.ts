import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto, UpdateProfileDto } from './dto';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const profile = await this.prisma.pregnancyProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return null;
    }

    return {
      id: profile.id,
      pregnancyMonth: profile.pregnancyMonth,
      dueDate: profile.dueDate,
      heightCm: profile.heightCm ? Number(profile.heightCm) : null,
      weightKg: profile.weightKg ? Number(profile.weightKg) : null,
      dietPreference: profile.dietPreference,
      allergies: profile.allergies,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }

  async createProfile(userId: string, dto: CreateProfileDto) {
    // Check if profile already exists
    const existing = await this.prisma.pregnancyProfile.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new BadRequestException('Profile already exists. Use update instead.');
    }

    // Validate pregnancy month
    if (dto.pregnancyMonth < 1 || dto.pregnancyMonth > 9) {
      throw new BadRequestException('Pregnancy month must be between 1 and 9');
    }

    const profile = await this.prisma.pregnancyProfile.create({
      data: {
        userId,
        pregnancyMonth: dto.pregnancyMonth,
        dueDate: new Date(dto.dueDate),
        heightCm: dto.heightCm,
        weightKg: dto.weightKg,
        dietPreference: dto.dietPreference || 'non-veg',
        allergies: dto.allergies || [],
      },
    });

    return {
      message: 'Profile created successfully',
      profile: {
        id: profile.id,
        pregnancyMonth: profile.pregnancyMonth,
        dueDate: profile.dueDate,
        heightCm: profile.heightCm ? Number(profile.heightCm) : null,
        weightKg: profile.weightKg ? Number(profile.weightKg) : null,
        dietPreference: profile.dietPreference,
        allergies: profile.allergies,
      },
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const existing = await this.prisma.pregnancyProfile.findUnique({
      where: { userId },
    });

    if (!existing) {
      throw new NotFoundException('Profile not found. Create one first.');
    }

    // Validate pregnancy month if provided
    if (dto.pregnancyMonth && (dto.pregnancyMonth < 1 || dto.pregnancyMonth > 9)) {
      throw new BadRequestException('Pregnancy month must be between 1 and 9');
    }

    const profile = await this.prisma.pregnancyProfile.update({
      where: { userId },
      data: {
        pregnancyMonth: dto.pregnancyMonth,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        heightCm: dto.heightCm,
        weightKg: dto.weightKg,
        dietPreference: dto.dietPreference,
        allergies: dto.allergies,
      },
    });

    return {
      message: 'Profile updated successfully',
      profile: {
        id: profile.id,
        pregnancyMonth: profile.pregnancyMonth,
        dueDate: profile.dueDate,
        heightCm: profile.heightCm ? Number(profile.heightCm) : null,
        weightKg: profile.weightKg ? Number(profile.weightKg) : null,
        dietPreference: profile.dietPreference,
        allergies: profile.allergies,
      },
    };
  }
}
