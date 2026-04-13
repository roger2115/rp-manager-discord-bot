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

client.on('disconnect', () => {
  console.log('🔌 Bot rozłączony');
  botStatus.isOnline = false;
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