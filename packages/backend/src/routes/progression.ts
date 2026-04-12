import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import { incrementMessageCount, promoteCharacter, getRanks } from '../services/progression';
import { hasStaffOverride } from '../services/permissions';

const router = Router();

// Increment message count (called by bot)
router.post('/increment', async (req: Request, res: Response) => {
  try {
    const { characterId } = req.body;

    if (!characterId) {
      return res.status(400).json({ error: 'characterId is required' });
    }

    const result = await incrementMessageCount(characterId);
    res.json(result);
  } catch (error) {
    console.error('Increment message count error:', error);
    res.status(500).json({ error: 'Failed to increment message count' });
  }
});

// Manual promotion (staff only)
router.post('/promote/:characterId', requireAuth, async (req: Request, res: Response) => {
  try {
    const { characterId } = req.params;
    const { rankId } = req.body;
    const userId = (req.user as any).id;

    if (!rankId) {
      return res.status(400).json({ error: 'rankId is required' });
    }

    // TODO: Check staff override permission
    // For now, allow any authenticated user
    
    const promotion = await promoteCharacter(characterId, rankId, true, userId);
    res.json(promotion);
  } catch (error) {
    console.error('Manual promotion error:', error);
    res.status(500).json({ error: 'Failed to promote character' });
  }
});

// Get ranks for a guild
router.get('/ranks/:guildId', async (req: Request, res: Response) => {
  try {
    const { guildId } = req.params;
    const ranks = await getRanks(guildId);
    res.json(ranks);
  } catch (error) {
    console.error('Get ranks error:', error);
    res.status(500).json({ error: 'Failed to fetch ranks' });
  }
});

export default router;
