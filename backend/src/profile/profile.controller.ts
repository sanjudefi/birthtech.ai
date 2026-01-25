import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubscriptionGuard } from '../auth/guards/subscription.guard';
import { CreateProfileDto, UpdateProfileDto } from './dto';

@Controller('profile')
@UseGuards(JwtAuthGuard, SubscriptionGuard)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get()
  async getProfile(@Request() req: any) {
    return this.profileService.getProfile(req.user.userId);
  }

  @Post()
  async createProfile(@Request() req: any, @Body() dto: CreateProfileDto) {
    return this.profileService.createProfile(req.user.userId, dto);
  }

  @Put()
  async updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
    return this.profileService.updateProfile(req.user.userId, dto);
  }
}
