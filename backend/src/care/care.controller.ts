import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { CareService } from './care.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubscriptionGuard } from '../auth/guards/subscription.guard';

@Controller('care')
@UseGuards(JwtAuthGuard, SubscriptionGuard)
export class CareController {
  constructor(private careService: CareService) {}

  @Get('today')
  async getTodaysCare(@Request() req: any) {
    return this.careService.getTodaysCare(req.user.userId);
  }

  @Get('week')
  async getWeeklyCalendar(@Request() req: any) {
    return this.careService.getWeeklyCalendar(req.user.userId);
  }

  @Get('inventory/weekly')
  async getWeeklyInventory(@Request() req: any) {
    return this.careService.getWeeklyInventory(req.user.userId);
  }

  @Get('inventory/monthly')
  async getMonthlyStaples(@Request() req: any) {
    return this.careService.getMonthlyStaples(req.user.userId);
  }
}
