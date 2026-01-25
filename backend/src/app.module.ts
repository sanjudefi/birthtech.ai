import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { ProfileModule } from './profile/profile.module';
import { CareModule } from './care/care.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    SubscriptionModule,
    ProfileModule,
    CareModule,
  ],
})
export class AppModule {}
