# BirthTech.ai - AI Pregnancy Care Platform

AI-powered pregnancy and baby care guidance platform for Canadian families. Personalized nutrition, exercise, and wellness tips throughout your pregnancy journey.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM (Prisma Accelerate)
- **Auth**: JWT-based authentication
- **Payments**: Stripe subscriptions
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Project Structure

```
birthtech.ai/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── profile/       # Profile endpoints
│   │   └── subscription/  # Stripe endpoints
│   ├── auth/              # Auth pages
│   ├── dashboard/         # Main dashboard
│   ├── onboarding/        # Profile setup
│   ├── profile/           # Edit profile
│   └── subscribe/         # Subscription plans
├── lib/                   # Utility libraries
│   └── prisma.ts         # Prisma client
├── prisma/               # Database schema
│   └── schema.prisma
└── backend/              # NestJS API (optional, for advanced features)
```

## Features

### MVP Scope

1. **Authentication**
   - Email signup/login
   - Password hashing (bcrypt)
   - Forgot/reset password flow
   - JWT tokens

2. **Subscription Plans**
   - Basic ($10/month): Daily meals, exercise, hydration
   - Premium ($20/month): Everything + personalized plans

3. **Pregnancy Profile**
   - Pregnancy month (1-9)
   - Due date
   - Height, weight
   - Diet preference (veg/non-veg/vegan)
   - Allergies

4. **Dashboard**
   - Today's Care (6 cards):
     - Meals (breakfast, lunch, dinner, snacks)
     - Exercise recommendation
     - Hydration tracking
     - Sleep/rest tip
     - Wellness tip
     - Safety note
   - Weekly calendar view
   - Weekly grocery list
   - Monthly staple inventory

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Prisma Accelerate)
- Stripe account

### Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Start development server
npm run dev
```

### Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables:
   - `DATABASE_URL`
   - `DIRECT_DATABASE_URL`
   - `JWT_SECRET`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `STRIPE_BASIC_PRICE_ID`
   - `STRIPE_PREMIUM_PRICE_ID`
   - `NEXT_PUBLIC_APP_URL`

## Environment Variables

```env
# Database - Prisma
DATABASE_URL="prisma+postgres://..."
DIRECT_DATABASE_URL="postgres://..."

# JWT Secret
JWT_SECRET="your-secure-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_BASIC_PRICE_ID="price_..."
STRIPE_PREMIUM_PRICE_ID="price_..."

# App URL
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
```

## API Routes

```
AUTH
POST   /api/auth/signup           Register new user
POST   /api/auth/login            Login (returns JWT)
POST   /api/auth/forgot-password  Send reset email

PROFILE
GET    /api/profile               Get pregnancy profile
POST   /api/profile               Create profile
PUT    /api/profile               Update profile

SUBSCRIPTION
POST   /api/subscription/checkout Create Stripe session
```

## Stripe Setup

1. Create a Stripe account
2. Create two products with monthly pricing:
   - Basic Care ($10 CAD/month)
   - Premium Care ($20 CAD/month)
3. Copy the price IDs to your environment variables
4. Set up webhook endpoint: `POST /api/subscription/webhook`
5. Configure webhook events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

## Demo Mode

When `STRIPE_SECRET_KEY` is not set, the app runs in demo mode:
- Subscription checkout creates a demo subscription directly
- Users can proceed without actual payment

## Disclaimer

BirthTech.ai provides general guidance only and is not a substitute for professional medical advice. Always consult your healthcare provider for personalized care.

## License

MIT
