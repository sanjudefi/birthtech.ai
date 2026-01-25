import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from './stripe.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  priceId: string;
}

@Injectable()
export class SubscriptionService {
  constructor(
    private prisma: PrismaService,
    private stripeService: StripeService,
    private config: ConfigService,
  ) {}

  getPlans(): SubscriptionPlan[] {
    return [
      {
        id: 'basic',
        name: 'Basic Care',
        price: 10,
        currency: 'CAD',
        interval: 'month',
        features: [
          'Daily meal suggestions',
          'Exercise recommendations',
          'Hydration tracking',
          'Weekly grocery list',
          'Basic wellness tips',
        ],
        priceId: this.config.get<string>('STRIPE_BASIC_PRICE_ID') || 'price_basic',
      },
      {
        id: 'premium',
        name: 'Premium Care',
        price: 20,
        currency: 'CAD',
        interval: 'month',
        features: [
          'Everything in Basic',
          'Personalized nutrition plans',
          'Advanced exercise routines',
          'Monthly staple inventory',
          'Priority support',
          'Partner/family access',
        ],
        priceId: this.config.get<string>('STRIPE_PREMIUM_PRICE_ID') || 'price_premium',
      },
    ];
  }

  async createCheckoutSession(userId: string, dto: CreateCheckoutDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Get plan details
    const plans = this.getPlans();
    const plan = plans.find((p) => p.id === dto.planType);

    if (!plan) {
      throw new BadRequestException('Invalid plan type');
    }

    // Create or get Stripe customer
    let stripeCustomerId = user.subscription?.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await this.stripeService.createCustomer(
        user.email,
        `${user.firstName || ''} ${user.lastName || ''}`.trim() || undefined,
      );
      stripeCustomerId = customer.id;

      // Save customer ID
      await this.prisma.subscription.update({
        where: { userId },
        data: { stripeCustomerId },
      });
    }

    // Create checkout session
    const appUrl = this.config.get<string>('APP_URL') || 'http://localhost:4200';
    const session = await this.stripeService.createCheckoutSession(
      stripeCustomerId,
      plan.priceId,
      `${appUrl}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
      `${appUrl}/subscribe?cancelled=true`,
    );

    return {
      sessionId: session.id,
      url: session.url,
    };
  }

  async handleWebhook(event: any) {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        await this.handleCheckoutComplete(session);
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        await this.handleSubscriptionUpdate(subscription);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await this.handleSubscriptionCancel(subscription);
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        await this.handlePaymentFailed(invoice);
        break;
      }
    }

    return { received: true };
  }

  private async handleCheckoutComplete(session: any) {
    const customerId = session.customer;
    const subscriptionId = session.subscription;

    const subscription = await this.prisma.subscription.findFirst({
      where: { stripeCustomerId: customerId },
    });

    if (subscription) {
      // Get subscription details from Stripe
      const stripeSubscription = await this.stripeService.getSubscription(subscriptionId);

      // Determine plan type based on price
      const priceId = stripeSubscription.items.data[0]?.price.id;
      const planType = priceId === this.config.get('STRIPE_PREMIUM_PRICE_ID') ? 'premium' : 'basic';

      await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          stripeSubscriptionId: subscriptionId,
          status: 'active',
          planType,
          currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
          currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        },
      });
    }
  }

  private async handleSubscriptionUpdate(stripeSubscription: any) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { stripeSubscriptionId: stripeSubscription.id },
    });

    if (subscription) {
      const status = stripeSubscription.status === 'active' ? 'active' : 'expired';

      await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status,
          currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
          currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        },
      });
    }
  }

  private async handleSubscriptionCancel(stripeSubscription: any) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { stripeSubscriptionId: stripeSubscription.id },
    });

    if (subscription) {
      await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: 'cancelled' },
      });
    }
  }

  private async handlePaymentFailed(invoice: any) {
    const customerId = invoice.customer;

    const subscription = await this.prisma.subscription.findFirst({
      where: { stripeCustomerId: customerId },
    });

    if (subscription) {
      await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: 'expired' },
      });
    }
  }

  async getStatus(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      return {
        status: 'inactive',
        hasSubscription: false,
      };
    }

    return {
      status: subscription.status,
      planType: subscription.planType,
      hasSubscription: subscription.status === 'active',
      currentPeriodEnd: subscription.currentPeriodEnd,
    };
  }
}
