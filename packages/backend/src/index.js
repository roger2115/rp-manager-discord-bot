import { Client, GatewayIntentBits, ActivityType } from 'discord.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Express middleware
app.use(cors());
app.use(express.json());

// Discord bot setup
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// Bot status management
let botStatus = {
  isOnline: false,
  lastHeartbeat: null,
  guilds: 0,
  users: 0
};

// Bot events
client.once('ready', () => {
  console.log(`✅ Bot zalogowany jako ${client.user.tag}`);
  botStatus.isOnline = true;
  botStatus.lastHeartbeat = new Date();
  
  // Set bot status
  updateBotStatus();
  
  // Update status every 30 seconds
  setInterval(updateBotStatus, 30000);
});

client.on('error', (error) => {
  console.error('❌ Discord bot error:', error);
  botStatus.isOnline = false;
});

client.on('messageReactionAdd', async (reaction, user) => {
  // Ignore bot reactions
  if (user.bot) return;
  
  // Fetch partial reactions
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error('Error fetching reaction:', error);
      return;
    }
  }
  
  const message = reaction.message;
  const emoji = reaction.emoji.name;
  
  // Find if this is a character message
  const characterMessage = messageHistory.find(msg => msg.id === message.id);
  if (!characterMessage) return;
  
  const character = characters.find(char => char.id === characterMessage.characterId);
  if (!character) return;
  
  try {
    switch (emoji) {
      case '❌':
        // Delete message - only character owner can do this
        if (user.id === character.userId) {
          await message.delete();
          // Remove from history
          const index = messageHistory.findIndex(msg => msg.id === message.id);
          if (index > -1) {
            messageHistory.splice(index, 1);
          }
        } else {
          // Remove user's reaction if they're not the owner
          await reaction.users.remove(user.id);
        }
        break;
        
      case '📝':
        // Edit message - only character owner can do this
        if (user.id === character.userId) {
          // Send DM to user with edit instructions
          try {
            const dmChannel = await user.createDM();
            await dmChannel.send({
              embeds: [{
                title: '📝 Edytuj wiadomość',
                description: `Aby edytować wiadomość postaci **${character.name}**, odpowiedz na tę wiadomość nową treścią.`,
                fields: [{
                  name: 'Aktualna treść:',
                  value: characterMessage.content
                }],
                color: 0x7C3AED,
                footer: {
                  text: `ID wiadomości: ${message.id}`
                }
              }]
            });
            
            // Store edit request
            editRequests.set(user.id, {
              messageId: message.id,
              characterId: character.id,
              channelId: message.channel.id
            });
            
          } catch (error) {
            console.error('Error sending edit DM:', error);
          }
        } else {
          await reaction.users.remove(user.id);
        }
        break;
        
      case '❓':
        // Show character info - anyone can use this
        try {
          const dmChannel = await user.createDM();
          await dmChannel.send({
            embeds: [{
              title: '❓ Informacje o postaci',
              description: `**${character.name}** ${character.tag ? `(${character.tag})` : ''}`,
              fields: [
                {
                  name: 'Opis:',
                  value: character.description || 'Brak opisu'
                },
                {
                  name: 'Właściciel:',
                  value: `<@${character.userId}>`
                }
              ],
              thumbnail: {
                url: character.avatarUrl
              },
              color: 0x7C3AED,
              timestamp: new Date()
            }]
          });
        } catch (error) {
          console.error('Error sending character info DM:', error);
        }
        break;
    }
  } catch (error) {
    console.error('Error handling reaction:', error);
  }
});

// Handle DM messages for editing
const editRequests = new Map();

client.on('messageCreate', async (message) => {
  // Handle edit requests in DMs
  if (message.channel.type === 1 && !message.author.bot) { // DM channel
    const editRequest = editRequests.get(message.author.id);
    if (editRequest) {
      try {
        // Find the original message
        const channel = await client.channels.fetch(editRequest.channelId);
        const originalMessage = await channel.messages.fetch(editRequest.messageId);
        
        if (originalMessage) {
          // Find webhook that sent the message
          const character = characters.find(char => char.id === editRequest.characterId);
          if (character) {
            const webhooks = await channel.fetchWebhooks();
            const webhook = webhooks.find(wh => wh.name === `RP-${character.name}`);
            
            if (webhook) {
              // Edit the message
              await webhook.editMessage(originalMessage.id, {
                content: message.content,
                username: character.name,
                avatarURL: character.avatarUrl
              });
              
              // Update message history
              const historyIndex = messageHistory.findIndex(msg => msg.id === originalMessage.id);
              if (historyIndex > -1) {
                messageHistory[historyIndex].content = message.content;
                messageHistory[historyIndex].editedAt = new Date();
              }
              
              // Confirm edit
              await message.reply('✅ Wiadomość została edytowana!');
            }
          }
        }
        
        // Remove edit request
        editRequests.delete(message.author.id);
      } catch (error) {
        console.error('Error editing message:', error);
        await message.reply('❌ Wystąpił błąd podczas edytowania wiadomości.');
        editRequests.delete(message.author.id);
      }
    }
  }
});

// Function to update bot status
function updateBotStatus() {
  if (!client.user) return;
  
  botStatus.guilds = client.guilds.cache.size;
  botStatus.users = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
  botStatus.lastHeartbeat = new Date();
  
  const statusText = `🎭 ${botStatus.guilds} serwerów | 👥 ${botStatus.users} użytkowników`;
  
  client.user.setActivity(statusText, { 
    type: ActivityType.Watching 
  });
  
  console.log(`📊 Status zaktualizowany: ${statusText}`);
}

// In-memory storage for characters (in production, use a database)
let characters = [];
let messageHistory = [];

// API Routes
app.get('/api/status', (req, res) => {
  res.json({
    bot: {
      isOnline: botStatus.isOnline,
      lastHeartbeat: botStatus.lastHeartbeat,
      guilds: botStatus.guilds,
      users: botStatus.users,
      uptime: client.uptime,
      username: client.user?.username || 'Unknown',
      discriminator: client.user?.discriminator || '0000'
    },
    server: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date()
    }
  });
});

app.get('/api/guilds', (req, res) => {
  if (!client.user) {
    return res.status(503).json({ error: 'Bot not ready' });
  }
  
  const guilds = client.guilds.cache.map(guild => ({
    id: guild.id,
    name: guild.name,
    memberCount: guild.memberCount,
    icon: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : null
  }));
  
  res.json(guilds);
});

// Characters API
app.get('/api/characters/:guildId', (req, res) => {
  const { guildId } = req.params;
  const guildCharacters = characters.filter(char => char.guildId === guildId);
  res.json(guildCharacters);
});

app.post('/api/characters', (req, res) => {
  const { name, tag, avatarUrl, description, guildId, userId } = req.body;
  
  if (!name || !guildId || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const character = {
    id: Date.now().toString(),
    name,
    tag: tag || '',
    avatarUrl: avatarUrl || 'https://cdn.discordapp.com/embed/avatars/0.png',
    description: description || '',
    guildId,
    userId,
    createdAt: new Date()
  };
  
  characters.push(character);
  res.json(character);
});

app.put('/api/characters/:id', (req, res) => {
  const { id } = req.params;
  const { name, tag, avatarUrl, description } = req.body;
  
  const characterIndex = characters.findIndex(char => char.id === id);
  if (characterIndex === -1) {
    return res.status(404).json({ error: 'Character not found' });
  }
  
  characters[characterIndex] = {
    ...characters[characterIndex],
    name: name || characters[characterIndex].name,
    tag: tag || characters[characterIndex].tag,
    avatarUrl: avatarUrl || characters[characterIndex].avatarUrl,
    description: description || characters[characterIndex].description,
    updatedAt: new Date()
  };
  
  res.json(characters[characterIndex]);
});

app.delete('/api/characters/:id', (req, res) => {
  const { id } = req.params;
  const characterIndex = characters.findIndex(char => char.id === id);
  
  if (characterIndex === -1) {
    return res.status(404).json({ error: 'Character not found' });
  }
  
  characters.splice(characterIndex, 1);
  res.json({ success: true });
});

// Message history API
app.get('/api/messages/:characterId', (req, res) => {
  const { characterId } = req.params;
  const characterMessages = messageHistory.filter(msg => msg.characterId === characterId);
  res.json(characterMessages);
});

// Send message as character
app.post('/api/messages', async (req, res) => {
  const { characterId, channelId, content } = req.body;
  
  if (!characterId || !channelId || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const character = characters.find(char => char.id === characterId);
  if (!character) {
    return res.status(404).json({ error: 'Character not found' });
  }
  
  try {
    const channel = await client.channels.fetch(channelId);
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }
    
    // Create webhook for character
    const webhooks = await channel.fetchWebhooks();
    let webhook = webhooks.find(wh => wh.name === `RP-${character.name}`);
    
    if (!webhook) {
      webhook = await channel.createWebhook({
        name: `RP-${character.name}`,
        avatar: character.avatarUrl
      });
    }
    
    // Send message as character
    const message = await webhook.send({
      content,
      username: character.name,
      avatarURL: character.avatarUrl
    });
    
    // Store in history
    const messageData = {
      id: message.id,
      characterId,
      channelId,
      content,
      timestamp: new Date(),
      messageUrl: `https://discord.com/channels/${channel.guildId}/${channelId}/${message.id}`
    };
    
    messageHistory.push(messageData);
    
    // Add reactions for editing
    await message.react('❌');
    await message.react('📝');
    await message.react('❓');
    
    res.json(messageData);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    bot: botStatus.isOnline ? 'Online' : 'Offline'
  });
});

// Start Express server
app.listen(PORT, () => {
  console.log(`🚀 Backend server uruchomiony na porcie ${PORT}`);
});

// Login bot
if (process.env.DISCORD_TOKEN) {
  client.login(process.env.DISCORD_TOKEN).catch(error => {
    console.error('❌ Nie udało się zalogować bota:', error);
    console.log('💡 Sprawdź czy DISCORD_TOKEN jest poprawny w pliku .env');
  });
} else {
  console.error('❌ Brak DISCORD_TOKEN w pliku .env');
  console.log('💡 Dodaj DISCORD_TOKEN=twoj_token_bota do pliku packages/backend/.env');
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Zamykanie bota...');
  client.destroy();
  process.exit(0);
});

export default app;

client.on('disconnect', () => {
  console.log('🔌 Bot rozłączony');
  botStatus.isOnline = false;
});