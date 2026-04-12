import { Client, GatewayIntentBits, Events, Message, TextChannel } from 'discord.js';
import dotenv from 'dotenv';
import { parseMessageBrackets } from './utils/bracketParser';
import { getCharacterByBracket, incrementMessageCount } from './services/api';
import { getOrCreateWebhook, sendWebhookMessage } from './services/webhookManager';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildWebhooks,
  ],
});

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`✅ Bot is ready! Logged in as ${readyClient.user.tag}`);
  console.log(`📊 Serving ${readyClient.guilds.cache.size} guilds`);

  // Report guilds to backend
  try {
    const guildIds = Array.from(readyClient.guilds.cache.keys());
    const apiUrl = process.env.API_URL || 'http://localhost:3003';
    
    const response = await fetch(`${apiUrl}/api/bot-guilds/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        guildIds,
        botToken: process.env.DISCORD_BOT_TOKEN,
      }),
    });

    if (response.ok) {
      console.log(`✅ Reported ${guildIds.length} guilds to backend`);
    } else {
      console.error('Failed to report guilds to backend');
    }
  } catch (error) {
    console.error('Error reporting guilds:', error);
  }
});

client.on(Events.MessageCreate, async (message: Message) => {
  // Ignore bot messages
  if (message.author.bot) return;
  
  // Ignore DMs
  if (!message.guild) return;

  try {
    let bracketMatch = parseMessageBrackets(message.content);
    let character = null;

    // First, try bracket syntax [text]
    if (bracketMatch) {
      character = await getCharacterByBracket(message.guild.id, bracketMatch.bracket);
    }

    // If no bracket match or no character found, try prefix matching WITHOUT space requirement
    if (!character) {
      // Try to match any character's bracket as a prefix (even without space)
      // We'll check all possible prefix lengths
      const content = message.content.trim();
      
      // Try progressively longer prefixes (up to 10 chars, which is max bracket length)
      for (let len = 1; len <= Math.min(10, content.length); len++) {
        const potentialPrefix = content.substring(0, len);
        
        try {
          const foundChar = await getCharacterByBracket(message.guild.id, potentialPrefix);
          
          if (foundChar && foundChar.userId === message.author.id) {
            character = foundChar;
            bracketMatch = {
              bracket: potentialPrefix,
              content: content.substring(len).trim(),
              fullMatch: potentialPrefix,
            };
            break;
          }
        } catch (err) {
          // Character not found, continue trying
          continue;
        }
      }
    }

    if (!bracketMatch || !character) {
      return; // No matching character found
    }

    // Verify ownership (already checked above, but double-check)
    if (character.userId !== message.author.id) {
      return;
    }

    // Get or create webhook for channel
    const webhook = await getOrCreateWebhook(message.channel as TextChannel);

    // Delete original message
    await message.delete().catch((err) => {
      console.error('Failed to delete message:', err);
    });

    // Send webhook message as character
    await sendWebhookMessage(webhook, character, bracketMatch.content);

    // Update progression
    const progressionResult = await incrementMessageCount(character.id);

    // Handle promotion if triggered
    if (progressionResult.promoted) {
      console.log(`🎉 Character ${character.name} was promoted!`);
    }
  } catch (error) {
    console.error('Error handling message:', error);
  }
});

client.on(Events.Error, (error) => {
  console.error('Discord client error:', error);
});

// Login to Discord
const token = process.env.DISCORD_BOT_TOKEN;
if (!token) {
  console.error('❌ DISCORD_BOT_TOKEN is not defined in environment variables');
  process.exit(1);
}

if (token.length < 50) {
  console.error('❌ DISCORD_BOT_TOKEN appears to be invalid (too short)');
  console.log('💡 Make sure you copied the full bot token from Discord Developer Portal');
  process.exit(1);
}

client.login(token).catch((error) => {
  console.error('❌ Failed to login to Discord:', error);
  console.log('💡 Check if your bot token is correct in the .env file');
  process.exit(1);
});

export default client;
