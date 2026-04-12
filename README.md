# RP Manager - Discord Character Management System

Modern Discord bot system for managing roleplay characters with webhooks, progression tracking, and a web dashboard.

## Features

- 🎭 **Character Management** - Create and manage multiple RP characters
- 🤖 **Discord Bot** - Automatic message proxying via webhooks
- 📊 **Web Dashboard** - Modern neon-styled interface
- 🔄 **Progression System** - Track messages and rank promotions
- 🔍 **Search & Filter** - Find characters by name, prefix, or group
- 🎨 **Neon UI** - Blue-purple-white-black modern design

## Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Express, TypeScript, Prisma
- **Bot**: Discord.js
- **Database**: SQLite (development), PostgreSQL (production)
- **Auth**: Discord OAuth2

## Project Structure

```
├── packages/
│   ├── backend/     # Express API server
│   ├── bot/         # Discord bot
│   └── frontend/    # Next.js dashboard
```

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Discord Application (Bot + OAuth2)

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd PanelDiscordRP
npm install
```

### 2. Discord Application Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create New Application
3. Go to **Bot** tab:
   - Enable **MESSAGE CONTENT INTENT**
   - Copy Bot Token
4. Go to **OAuth2** tab:
   - Add redirect: `http://localhost:3003/api/auth/callback`
   - Copy Client ID and Client Secret

### 3. Environment Variables

Create `.env` files in each package:

**packages/backend/.env**
```env
PORT=3003
NODE_ENV=development
DATABASE_URL="file:./rpmanager.db"

DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
DISCORD_CALLBACK_URL=http://localhost:3003/api/auth/callback
DISCORD_BOT_TOKEN=your_bot_token

SESSION_SECRET=your_random_secret_key
FRONTEND_URL=http://localhost:3000
ENCRYPTION_KEY=your_32_character_encryption_key
```

**packages/bot/.env**
```env
DISCORD_BOT_TOKEN=your_bot_token
API_URL=http://localhost:3003
NODE_ENV=development
```

**packages/frontend/.env.local**
```env
NEXT_PUBLIC_API_URL=http://localhost:3003
```

### 4. Database Setup

```bash
cd packages/backend
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

### 5. Run Development

Open 3 terminals:

```bash
# Terminal 1 - Backend
cd packages/backend
npm run dev

# Terminal 2 - Bot
cd packages/bot
npm run dev

# Terminal 3 - Frontend
cd packages/frontend
npm run dev
```

Access dashboard at: http://localhost:3000

## Usage

### Creating a Character

1. Login with Discord
2. Select your server
3. Click "+ Nowa Postać"
4. Fill in:
   - **Name**: Character name
   - **Avatar**: External URL (Discord CDN, Imgur)
   - **Group**: For organizing characters
   - **Prefix**: e.g., "Sven." or "[]"

### Using on Discord

**Prefix mode:**
```
Sven.Hello world!
```

**Bracket mode:**
```
[Sven.] Hello world!
```

Bot will delete your message and send it as the character via webhook.

## Deployment

### Backend + Bot

Deploy to any Node.js hosting (Railway, Render, Heroku):

1. Set environment variables
2. Run migrations: `npx prisma migrate deploy`
3. Start: `npm start`

### Frontend

Deploy to Vercel:

```bash
cd packages/frontend
vercel
```

Update `NEXT_PUBLIC_API_URL` to your backend URL.

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, open an issue on GitHub.
