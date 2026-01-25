import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true, // Required for Stripe webhooks
  });

  // Enable CORS for Angular frontend
  app.enableCors({
    origin: process.env.APP_URL || 'http://localhost:4200',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  const port = process.env.API_PORT || 3000;
  await app.listen(port);
  console.log(`BirthTech API running on http://localhost:${port}`);
}

bootstrap();
