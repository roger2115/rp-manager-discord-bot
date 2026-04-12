import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { sanitizeInput, sanitizeURL } from '../utils/sanitize';
import { requireAuth } from '../middleware/auth';
import { characterCreationLimiter } from '../middleware/rateLimit';

const router = Router();
const prisma = new PrismaClient();

// Validation schema
const characterSchema = z.object({
  name: z.string().min(1).max(80),
  avatarUrl: z.string().url(),
  tag: z.string().min(1).max(20),
  brackets: z.string().min(1).max(10),
  guildId: z.string().min(1),
});

// Create character
router.post('/', requireAuth, characterCreationLimiter, async (req: Request, res: Response) => {
  try {
    // Validate input
    const data = characterSchema.parse(req.body);
    const userId = (req.user as any).id;

    // Sanitize inputs
    const sanitizedName = sanitizeInput(data.name);
    const sanitizedTag = sanitizeInput(data.tag);
    const sanitizedBrackets = sanitizeInput(data.brackets);
    const sanitizedAvatarUrl = sanitizeURL(data.avatarUrl);

    if (!sanitizedAvatarUrl) {
      return res.status(400).json({ error: 'Invalid avatar URL' });
    }

    // Check for duplicate brackets
    const existing = await prisma.character.findFirst({
      where: {
        guildId: data.guildId,
        userId: userId,
        brackets: sanitizedBrackets,
      },
    });

    if (existing) {
      return res.status(409).json({ error: 'Character with these brackets already exists' });
    }

    // Create character
    const character = await prisma.character.create({
      data: {
        userId,
        guildId: data.guildId,
        name: sanitizedName,
        avatarUrl: sanitizedAvatarUrl,
        tag: sanitizedTag,
        brackets: sanitizedBrackets,
        messageCount: 0,
      },
    });

    res.status(201).json(character);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('Character creation error:', error);
    res.status(500).json({ error: 'Failed to create character' });
  }
});

// Get characters for a guild
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { guildId } = req.query;
    const userId = (req.user as any).id;

    if (!guildId) {
      return res.status(400).json({ error: 'guildId is required' });
    }

    const characters = await prisma.character.findMany({
      where: {
        guildId: guildId as string,
        userId: userId,
      },
      include: {
        currentRank: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(characters);
  } catch (error) {
    console.error('Get characters error:', error);
    res.status(500).json({ error: 'Failed to fetch characters' });
  }
});

// Get character by bracket (for bot) - MUST be before /:id route
router.get('/by-bracket', async (req: Request, res: Response) => {
  try {
    const { guildId, bracket } = req.query;

    if (!guildId || !bracket) {
      return res.status(400).json({ error: 'guildId and bracket are required' });
    }

    const character = await prisma.character.findFirst({
      where: {
        guildId: guildId as string,
        brackets: bracket as string,
      },
      include: {
        currentRank: true,
      },
    });

    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    res.json(character);
  } catch (error) {
    console.error('Get character by bracket error:', error);
    res.status(500).json({ error: 'Failed to fetch character' });
  }
});

// Get character by ID
router.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req.user as any).id;

    const character = await prisma.character.findUnique({
      where: { id },
      include: {
        currentRank: true,
        promotions: {
          include: {
            fromRank: true,
            toRank: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    // Check permission (owner or staff override)
    if (character.userId !== userId) {
      // TODO: Check staff override
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    res.json(character);
  } catch (error) {
    console.error('Get character error:', error);
    res.status(500).json({ error: 'Failed to fetch character' });
  }
});

// Update character
router.patch('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req.user as any).id;

    // Find character
    const character = await prisma.character.findUnique({
      where: { id },
    });

    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    // Check permission
    if (character.userId !== userId) {
      // TODO: Check staff override
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    // Validate and sanitize updates
    const updates: any = {};
    if (req.body.name) {
      updates.name = sanitizeInput(req.body.name);
    }
    if (req.body.avatarUrl) {
      const sanitized = sanitizeURL(req.body.avatarUrl);
      if (!sanitized) {
        return res.status(400).json({ error: 'Invalid avatar URL' });
      }
      updates.avatarUrl = sanitized;
    }
    if (req.body.tag) {
      updates.tag = sanitizeInput(req.body.tag);
    }
    if (req.body.brackets) {
      updates.brackets = sanitizeInput(req.body.brackets);
    }

    // Update character
    const updated = await prisma.character.update({
      where: { id },
      data: updates,
    });

    res.json(updated);
  } catch (error) {
    console.error('Update character error:', error);
    res.status(500).json({ error: 'Failed to update character' });
  }
});

// Delete character
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req.user as any).id;

    // Find character
    const character = await prisma.character.findUnique({
      where: { id },
    });

    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    // Check permission
    if (character.userId !== userId) {
      // TODO: Check staff override
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    // Delete character
    await prisma.character.delete({
      where: { id },
    });

    res.json({ message: 'Character deleted successfully' });
  } catch (error) {
    console.error('Delete character error:', error);
    res.status(500).json({ error: 'Failed to delete character' });
  }
});

export default router;
