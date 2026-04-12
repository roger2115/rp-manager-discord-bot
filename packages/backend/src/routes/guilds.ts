import { Router, Request, Response } from 'express';
import { decrypt } from '../utils/encryption';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

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

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Discord API error:', errorData);
      throw new Error('Failed to fetch guilds from Discord');
    }

    const userGuilds = await response.json();

    // Get bot guilds from internal endpoint
    try {
      const botGuildsResponse = await fetch('http://localhost:3003/api/bot-guilds');
      
      if (botGuildsResponse.ok) {
        const { guildIds: botGuildIds } = await botGuildsResponse.json();
        
        // Filter user guilds to only include those where bot is present
        const filteredGuilds = userGuilds.filter((guild: any) =>
          botGuildIds.includes(guild.id)
        );
        
        console.log(`Filtered ${userGuilds.length} user guilds to ${filteredGuilds.length} (bot is in ${botGuildIds.length} guilds)`);
        return res.json(filteredGuilds);
      }
    } catch (error) {
      console.error('Failed to fetch bot guilds:', error);
    }

    // Fallback: return all user guilds if bot guilds fetch fails
    res.json(userGuilds);
  } catch (error) {
    console.error('Error fetching guilds:', error);
    res.status(500).json({ error: 'Failed to fetch guilds' });
  }
});

export default router;
