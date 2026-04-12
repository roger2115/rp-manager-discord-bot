import { Router, Request, Response } from 'express';

const router = Router();

// In-memory storage for bot guilds
let botGuildIds: string[] = [];

/**
 * Bot reports its guilds (called by bot on startup)
 */
router.post('/report', async (req: Request, res: Response) => {
  try {
    const { guildIds, botToken } = req.body;

    // Verify bot token
    if (botToken !== process.env.DISCORD_BOT_TOKEN) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!Array.isArray(guildIds)) {
      return res.status(400).json({ error: 'guildIds must be an array' });
    }

    botGuildIds = guildIds;
    console.log(`Bot reported ${guildIds.length} guilds`);

    res.json({ success: true, count: guildIds.length });
  } catch (error) {
    console.error('Error reporting bot guilds:', error);
    res.status(500).json({ error: 'Failed to report guilds' });
  }
});

/**
 * Get bot guild IDs
 */
router.get('/', async (req: Request, res: Response) => {
  res.json({ guildIds: botGuildIds });
});

export default router;
