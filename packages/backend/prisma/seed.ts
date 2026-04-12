import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create example guild config
  const guildConfig = await prisma.guildConfig.upsert({
    where: { guildId: '123456789012345678' },
    update: {},
    create: {
      guildId: '123456789012345678',
      announcementChannelId: '987654321098765432',
      enableProgression: true,
    },
  });

  console.log('✅ Created guild config:', guildConfig);

  // Create example ranks
  const ranks = await Promise.all([
    prisma.rank.upsert({
      where: { guildId_order: { guildId: '123456789012345678', order: 0 } },
      update: {},
      create: {
        guildId: '123456789012345678',
        name: 'Recruit',
        order: 0,
        promotionTriggerType: 'message_count',
        promotionTriggerValue: 10,
      },
    }),
    prisma.rank.upsert({
      where: { guildId_order: { guildId: '123456789012345678', order: 1 } },
      update: {},
      create: {
        guildId: '123456789012345678',
        name: 'Cadet',
        order: 1,
        promotionTriggerType: 'message_count',
        promotionTriggerValue: 50,
      },
    }),
    prisma.rank.upsert({
      where: { guildId_order: { guildId: '123456789012345678', order: 2 } },
      update: {},
      create: {
        guildId: '123456789012345678',
        name: 'Officer',
        order: 2,
        promotionTriggerType: 'message_count',
        promotionTriggerValue: 100,
      },
    }),
    prisma.rank.upsert({
      where: { guildId_order: { guildId: '123456789012345678', order: 3 } },
      update: {},
      create: {
        guildId: '123456789012345678',
        name: 'Commander',
        order: 3,
        promotionTriggerType: 'manual',
      },
    }),
  ]);

  console.log('✅ Created ranks:', ranks.length);

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
