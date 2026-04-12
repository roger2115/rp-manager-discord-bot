import { TextChannel, Webhook, WebhookMessageCreateOptions } from 'discord.js';
import { Character } from './api';

// In-memory webhook cache
const webhookCache = new Map<string, Webhook>();

/**
 * Get or create webhook for a channel
 */
export async function getOrCreateWebhook(channel: TextChannel): Promise<Webhook> {
  const cacheKey = channel.id;

  // Check cache first
  if (webhookCache.has(cacheKey)) {
    return webhookCache.get(cacheKey)!;
  }

  try {
    // Fetch existing webhooks
    const webhooks = await channel.fetchWebhooks();
    let webhook = webhooks.find((wh) => wh.owner?.id === channel.client.user?.id);

    // Create new webhook if none exists
    if (!webhook) {
      webhook = await channel.createWebhook({
        name: 'RP Manager',
        reason: 'Character message proxying',
      });
    }

    // Cache webhook
    webhookCache.set(cacheKey, webhook);

    return webhook;
  } catch (error) {
    console.error('Failed to get or create webhook:', error);
    throw error;
  }
}

/**
 * Send message via webhook as character
 */
export async function sendWebhookMessage(
  webhook: Webhook,
  character: Character,
  content: string
): Promise<void> {
  try {
    const options: WebhookMessageCreateOptions = {
      content,
      username: `${character.name} ${character.tag}`,
    };

    // Only add avatar if it's not a localhost URL
    if (character.avatarUrl && 
        !character.avatarUrl.includes('localhost') && 
        !character.avatarUrl.includes('127.0.0.1')) {
      options.avatarURL = character.avatarUrl;
    }

    await webhook.send(options);
  } catch (error) {
    console.error('Failed to send webhook message:', error);
    throw error;
  }
}

/**
 * Clear webhook cache (useful for cleanup)
 */
export function clearWebhookCache(): void {
  webhookCache.clear();
}

export default {
  getOrCreateWebhook,
  sendWebhookMessage,
  clearWebhookCache,
};
