import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create test user: sanju@catchway.com / 12345
  const testUserPassword = await bcrypt.hash('12345', 12);
  const testUser = await prisma.user.upsert({
    where: { email: 'sanju@catchway.com' },
    update: {},
    create: {
      email: 'sanju@catchway.com',
      passwordHash: testUserPassword,
      firstName: 'Sanju',
      lastName: 'User',
      emailVerified: true,
    },
  });
  console.log('Created test user:', testUser.email);

  // Create subscription for test user
  await prisma.subscription.upsert({
    where: { userId: testUser.id },
    update: { status: 'active' },
    create: {
      userId: testUser.id,
      planType: 'premium',
      status: 'active',
      stripeCustomerId: 'demo_customer_test',
      stripeSubscriptionId: 'demo_sub_test',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });
  console.log('Created subscription for test user');

  // Create pregnancy profile for test user
  await prisma.pregnancyProfile.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
      pregnancyMonth: 6,
      dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      heightCm: 165,
      weightKg: 62,
      dietPreference: 'non-veg',
      allergies: [],
    },
  });
  console.log('Created pregnancy profile for test user');

  // Create admin user: admin / admin123
  const adminPassword = await bcrypt.hash('admin123', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@birthtech.ai' },
    update: {},
    create: {
      email: 'admin@birthtech.ai',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      emailVerified: true,
      isAdmin: true,
    },
  });
  console.log('Created admin user:', adminUser.email);

  console.log('Seeding completed!');
  console.log('\nTest credentials:');
  console.log('  User: sanju@catchway.com / 12345');
  console.log('  Admin: admin@birthtech.ai / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
