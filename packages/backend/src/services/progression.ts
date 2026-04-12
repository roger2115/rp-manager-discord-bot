import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ProgressionResult {
  promoted: boolean;
  character: any;
  promotion?: any;
}

/**
 * Increment character message count and check for promotion
 */
export async function incrementMessageCount(characterId: string): Promise<ProgressionResult> {
  try {
    // Increment message count atomically
    const character = await prisma.character.update({
      where: { id: characterId },
      data: { messageCount: { increment: 1 } },
      include: {
        currentRank: true,
      },
    });

    // Get guild config
    const guildConfig = await prisma.guildConfig.findUnique({
      where: { guildId: character.guildId },
    });

    // Check if progression is enabled
    if (!guildConfig || !guildConfig.enableProgression) {
      return { promoted: false, character };
    }

    // Get next rank
    const nextRank = await prisma.rank.findFirst({
      where: {
        guildId: character.guildId,
        order: { gt: character.currentRank?.order ?? -1 },
      },
      orderBy: { order: 'asc' },
    });

    if (!nextRank) {
      return { promoted: false, character }; // Already at max rank
    }

    // Check promotion trigger
    const shouldPromote = checkPromotionTrigger(character, nextRank);

    if (!shouldPromote) {
      return { promoted: false, character };
    }

    // Execute promotion
    const promotion = await promoteCharacter(character.id, nextRank.id, false);

    return {
      promoted: true,
      character,
      promotion,
    };
  } catch (error) {
    console.error('Increment message count error:', error);
    throw error;
  }
}

/**
 * Check if character should be promoted based on trigger
 */
function checkPromotionTrigger(character: any, nextRank: any): boolean {
  const { promotionTriggerType, promotionTriggerValue } = nextRank;

  switch (promotionTriggerType) {
    case 'message_count':
      return character.messageCount >= (promotionTriggerValue || 0);

    case 'time':
      const daysSinceCreation =
        (Date.now() - character.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceCreation >= (promotionTriggerValue || 0);

    case 'manual':
      return false; // Manual promotions don't auto-trigger

    default:
      return false;
  }
}

/**
 * Promote character to a new rank
 */
export async function promoteCharacter(
  characterId: string,
  rankId: string,
  manual: boolean,
  triggeredByUserId?: string
): Promise<any> {
  try {
    const character = await prisma.character.findUnique({
      where: { id: characterId },
      include: { currentRank: true },
    });

    if (!character) {
      throw new Error('Character not found');
    }

    // Create promotion record and update character in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create promotion record
      const promotion = await tx.promotion.create({
        data: {
          characterId,
          fromRankId: character.currentRankId,
          toRankId: rankId,
          triggeredBy: manual ? 'manual' : 'auto',
          triggeredByUserId,
        },
        include: {
          fromRank: true,
          toRank: true,
          character: true,
        },
      });

      // Update character's current rank
      await tx.character.update({
        where: { id: characterId },
        data: { currentRankId: rankId },
      });

      return promotion;
    });

    return result;
  } catch (error) {
    console.error('Promote character error:', error);
    throw error;
  }
}

/**
 * Get ranks for a guild
 */
export async function getRanks(guildId: string): Promise<any[]> {
  try {
    return await prisma.rank.findMany({
      where: { guildId },
      orderBy: { order: 'asc' },
    });
  } catch (error) {
    console.error('Get ranks error:', error);
    throw error;
  }
}

export default {
  incrementMessageCount,
  promoteCharacter,
  getRanks,
};
