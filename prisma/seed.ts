import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.stall.deleteMany();
  await prisma.pickupSlot.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const user = await prisma.user.create({
    data: {
      studentId: '20230001',
      name: 'Sam Gabriel Espeleta',
      email: 'sam_gabriel_espeleta@dlsl.edu.ph',
      mobile: '09123456789',
      program: 'BSCS',
      yearLevel: '3rd Year',
      passwordHash: 'hashed_password',
    },
  });

  // Create Stalls
  await Promise.all([
    prisma.stall.create({
      data: {
        id: 'stall-1',
        name: 'Stall #1 (Vendor Pending)',
        category: 'Rice Meals',
        rating: 4.8,
        estimatedTime: '10-15 mins',
        isPaused: false,
      },
    }),
    prisma.stall.create({
      data: {
        id: 'stall-2',
        name: 'Stall #2 (Vendor Pending)',
        category: 'Snacks',
        rating: 4.5,
        estimatedTime: '5-10 mins',
        isPaused: false,
      },
    }),
    prisma.stall.create({
      data: {
        id: 'stall-3',
        name: 'Stall #3 (Vendor Pending)',
        category: 'Drinks',
        rating: 4.2,
        estimatedTime: 'Paused',
        isPaused: true,
      },
    }),
    prisma.stall.create({
      data: {
        id: 'stall-4',
        name: 'Stall #4 (Vendor Pending)',
        category: 'Pasta',
        rating: 4.7,
        estimatedTime: '15-20 mins',
        isPaused: false,
      },
    }),
  ]);

  // Create Menu Items
  await Promise.all([
    prisma.menuItem.create({
      data: {
        id: 'item-1',
        stallId: 'stall-1',
        name: 'Menu Item 1',
        description: 'Generic description for menu item 1. Freshly prepared and student-friendly.',
        price: 75.0,
        category: 'Mains',
        isAvailable: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        id: 'item-2',
        stallId: 'stall-1',
        name: 'Menu Item 2',
        description: 'Generic description for menu item 2. High quality ingredients.',
        price: 85.0,
        category: 'Mains',
        isAvailable: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        id: 'item-3',
        stallId: 'stall-1',
        name: 'Menu Item 3',
        description: 'Generic description for menu item 3. Popular choice.',
        price: 60.0,
        category: 'Sides',
        isAvailable: false,
      },
    }),
    prisma.menuItem.create({
      data: {
        id: 'item-4',
        stallId: 'stall-2',
        name: 'Menu Item 4',
        description: 'Generic snack item for quick breaks.',
        price: 45.0,
        category: 'Snacks',
        isAvailable: true,
      },
    }),
  ]);

  // Create Pickup Slots
  await Promise.all([
    prisma.pickupSlot.create({
      data: {
        id: 'slot-1',
        date: '2026-09-19',
        timeWindow: '09:00 AM - 09:15 AM',
        capacity: 20,
        status: 'AVAILABLE',
      },
    }),
    prisma.pickupSlot.create({
      data: {
        id: 'slot-2',
        date: '2026-09-19',
        timeWindow: '09:15 AM - 09:30 AM',
        capacity: 45,
        status: 'AVAILABLE',
      },
    }),
    prisma.pickupSlot.create({
      data: {
        id: 'slot-3',
        date: '2026-09-19',
        timeWindow: '09:30 AM - 09:45 AM',
        capacity: 85,
        status: 'AVAILABLE',
      },
    }),
    prisma.pickupSlot.create({
      data: {
        id: 'slot-4',
        date: '2026-09-19',
        timeWindow: '09:45 AM - 10:00 AM',
        capacity: 100,
        status: 'FULL',
      },
    }),
  ]);

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
