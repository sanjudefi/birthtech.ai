# BirthTech.ai - AI Pregnancy Care Platform

AI-powered pregnancy and baby care guidance platform for Canadian families. Personalized nutrition, exercise, and wellness tips throughout your pregnancy journey.

## Tech Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: JWT-based authentication
- **Payments**: Stripe subscriptions

### Frontend
- **Framework**: Angular 17+ (standalone components)
- **UI**: Angular Material
- **State**: Angular Signals

## Project Structure

```
birthtech.ai/
├── backend/                 # NestJS API
│   ├── prisma/             # Database schema
│   │   └── schema.prisma
│   └── src/
│       ├── auth/           # Authentication module
│       ├── subscription/   # Stripe integration
│       ├── profile/        # Pregnancy profile
│       ├── care/           # Care plan generation
│       └── prisma/         # Database service
│
└── frontend/               # Angular SPA
    └── src/
        └── app/
            ├── core/       # Services, guards, interceptors
            └── features/   # Feature modules
                ├── landing/
                ├── auth/
                ├── subscription/
                ├── onboarding/
                └── dashboard/
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

## API Endpoints

```
AUTH
POST   /api/auth/signup           Register new user
POST   /api/auth/login            Login (returns JWT)
POST   /api/auth/forgot-password  Send reset email
POST   /api/auth/reset-password   Reset with token
GET    /api/auth/me               Get current user

SUBSCRIPTION
GET    /api/subscription/plans    List available plans
POST   /api/subscription/checkout Create Stripe session
POST   /api/subscription/webhook  Stripe webhook handler
GET    /api/subscription/status   Get user subscription

PROFILE
GET    /api/profile               Get pregnancy profile
POST   /api/profile               Create profile
PUT    /api/profile               Update profile

CARE PLAN
GET    /api/care/today            Today's care plan
GET    /api/care/week             Weekly calendar view
GET    /api/care/inventory/weekly Weekly food inventory
GET    /api/care/inventory/monthly Monthly staples list
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Stripe account

### Backend Setup

```bash
cd backend
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database and Stripe credentials

# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run prisma:push

# Start development server
npm run start:dev
```

### Frontend Setup

```bash
cd frontend
npm install

# Start development server
npm start
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_BASIC_PRICE_ID=price_...
STRIPE_PREMIUM_PRICE_ID=price_...
APP_URL=http://localhost:4200
API_PORT=3000
```

### Frontend (environments/environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  stripePublishableKey: 'pk_test_...',
};
```

## Stripe Setup

1. Create a Stripe account
2. Create two products with monthly pricing:
   - Basic Care ($10 CAD/month)
   - Premium Care ($20 CAD/month)
3. Copy the price IDs to your .env file
4. Set up webhook endpoint: `POST /api/subscription/webhook`
5. Configure webhook events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`

## Disclaimer

BirthTech.ai provides general guidance only and is not a substitute for professional medical advice. Always consult your healthcare provider for personalized care.

## License

MIT
