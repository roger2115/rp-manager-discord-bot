import { Router, Request, Response } from 'express';
import { decrypt } from '../utils/encryption';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Simple in-memory cache for bot guilds (5 minutes TTL)
let botGuildsCache: { data: any[]; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get user's Discord guilds (filtered by bot presence)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const userId = (req.user as any).id;

    // Get user session with access token
    const session = await prisma.userSession.findUnique({
      where: { userId },
    });

    if (!session) {
      return res.status(401).json({ error: 'Session not found' });
    }

    // Decrypt access token
    const accessToken = decrypt(session.accessToken);

    // Fetch user guilds from Discord API
    const response = await fetch('https://discord.com/api/v10/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('Discord API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Discord API error:', errorData);
      throw new Error('Failed to fetch guilds from Discord');
    }

    const userGuilds = await response.json();

    // For now, return all user guilds
    // TODO: Implement proper bot guild filtering
    res.json(userGuilds);
  } catch (error) {
    console.error('Error fetching guilds:', error);
    res.status(500).json({ error: 'Failed to fetch guilds' });
  }
});

export default router;
