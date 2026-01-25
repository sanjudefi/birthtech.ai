import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Headers,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { StripeService } from './stripe.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

@Controller('subscription')
export class SubscriptionController {
  constructor(
    private subscriptionService: SubscriptionService,
    private stripeService: StripeService,
  ) {}

  @Get('plans')
  getPlans() {
    return this.subscriptionService.getPlans();
  }

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  async createCheckout(@Request() req: any, @Body() dto: CreateCheckoutDto) {
    return this.subscriptionService.createCheckoutSession(req.user.userId, dto);
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    const rawBody = req.rawBody;

    if (!rawBody) {
      return { error: 'No raw body' };
    }

    try {
      const event = this.stripeService.constructWebhookEvent(rawBody, signature);
      return this.subscriptionService.handleWebhook(event);
    } catch (err) {
      console.error('Webhook error:', err);
      return { error: 'Webhook error' };
    }
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  async getStatus(@Request() req: any) {
    return this.subscriptionService.getStatus(req.user.userId);
  }
}
