# Deployment Guide - RP Manager System

This guide covers deploying the RP Manager system to production using various hosting platforms.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Database Setup](#database-setup)
4. [Backend Deployment](#backend-deployment)
5. [Bot Deployment](#bot-deployment)
6. [Frontend Deployment](#frontend-deployment)
7. [Post-Deployment](#post-deployment)

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (production)
- Discord Application configured
- Domain name (optional but recommended)
- Git repository

## Environment Configuration

### Discord Application Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Update OAuth2 Redirect URLs:
   - Add production callback: `https://your-api-domain.com/api/auth/callback`
4. Ensure **MESSAGE CONTENT INTENT** is enabled in Bot settings
5. Copy your credentials:
   - Client ID
   - Client Secret
   - Bot Token

### Generate Secrets

```bash
# Generate SESSION_SECRET (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate ENCRYPTION_KEY (exactly 32 characters)
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

## Database Setup

### Option 1: Managed PostgreSQL (Recommended)

Use a managed database service:
- **Railway**: Built-in PostgreSQL
- **Supabase**: Free tier available
- **Neon**: Serverless PostgreSQL
- **AWS RDS**: Enterprise option

### Option 2: Self-Hosted PostgreSQL

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database
sudo -u postgres psql
CREATE DATABASE rpmanager;
CREATE USER rpmanager_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE rpmanager TO rpmanager_user;
\q
```

### Run Migrations

```bash
cd packages/backend
export DATABASE_URL="postgresql://user:password@host:5432/rpmanager"
npx prisma migrate deploy
npx prisma db seed
```

## Backend Deployment

### Option 1: Railway (Recommended)

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Create New Project**:
   ```bash
   railway init
   ```

3. **Add PostgreSQL**:
   ```bash
   railway add postgresql
   ```

4. **Configure Environment Variables**:
   ```bash
   railway variables set PORT=3003
   railway variables set NODE_ENV=production
   railway variables set DISCORD_CLIENT_ID=your_client_id
   railway variables set DISCORD_CLIENT_SECRET=your_client_secret
   railway variables set DISCORD_CALLBACK_URL=https://your-domain.railway.app/api/auth/callback
   railway variables set DISCORD_BOT_TOKEN=your_bot_token
   railway variables set SESSION_SECRET=your_session_secret
   railway variables set FRONTEND_URL=https://your-frontend-domain.vercel.app
   railway variables set ENCRYPTION_KEY=your_32_char_key
   ```

5. **Deploy**:
   ```bash
   cd packages/backend
   railway up
   ```

### Option 2: Render

1. Create new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `packages/backend`
   - **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start Command**: `npm start`
4. Add environment variables (same as Railway)
5. Add PostgreSQL database from Render dashboard

### Option 3: VPS (Ubuntu)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Clone repository
git clone https://github.com/your-username/rp-manager.git
cd rp-manager

# Install dependencies
npm install
cd packages/backend
npm install

# Build
npm run build

# Install PM2
sudo npm install -g pm2

# Create ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'rp-backend',
    script: 'dist/index.js',
    cwd: './packages/backend',
    env: {
      NODE_ENV: 'production',
      PORT: 3003,
      DATABASE_URL: 'postgresql://user:password@localhost:5432/rpmanager',
      DISCORD_CLIENT_ID: 'your_client_id',
      DISCORD_CLIENT_SECRET: 'your_client_secret',
      DISCORD_CALLBACK_URL: 'https://your-domain.com/api/auth/callback',
      DISCORD_BOT_TOKEN: 'your_bot_token',
      SESSION_SECRET: 'your_session_secret',
      FRONTEND_URL: 'https://your-frontend.com',
      ENCRYPTION_KEY: 'your_32_char_key'
    }
  }]
}
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Bot Deployment

### Option 1: Same Server as Backend

If deploying to Railway/Render with backend:

**Railway**:
```bash
cd packages/bot
railway up
```

**Render**: Create separate Web Service for bot

### Option 2: VPS with PM2

```bash
# Add bot to ecosystem.config.js
cat >> ecosystem.config.js << EOF
  , {
    name: 'rp-bot',
    script: 'dist/index.js',
    cwd: './packages/bot',
    env: {
      NODE_ENV: 'production',
      DISCORD_BOT_TOKEN: 'your_bot_token',
      API_URL: 'https://your-backend-domain.com'
    }
  }
EOF

# Build bot
cd packages/bot
npm run build

# Restart PM2
pm2 restart ecosystem.config.js
```

### Option 3: Docker

```bash
# Build and run bot container
docker build -t rp-bot -f packages/bot/Dockerfile .
docker run -d \
  --name rp-bot \
  -e DISCORD_BOT_TOKEN=your_token \
  -e API_URL=https://your-backend.com \
  --restart unless-stopped \
  rp-bot
```

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   cd packages/frontend
   vercel
   ```

3. **Configure Environment**:
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL=https://your-backend-domain.com`

4. **Redeploy**:
   ```bash
   vercel --prod
   ```

### Option 2: Netlify

1. Create new site on [Netlify](https://netlify.com)
2. Connect GitHub repository
3. Configure:
   - **Base directory**: `packages/frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
4. Add environment variable: `NEXT_PUBLIC_API_URL`

### Option 3: VPS with Nginx

```bash
# Build frontend
cd packages/frontend
npm run build

# Install Nginx
sudo apt install nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/rp-frontend

# Add configuration:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/rp-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Add to PM2
pm2 start npm --name "rp-frontend" -- start
```

## Post-Deployment

### 1. Update Discord OAuth Callback

Update your Discord Application OAuth2 settings with production URLs:
- `https://your-backend-domain.com/api/auth/callback`

### 2. Test Authentication Flow

1. Visit your frontend URL
2. Click "Zaloguj się przez Discord"
3. Authorize the application
4. Verify redirect to dashboard

### 3. Invite Bot to Server

Generate bot invite URL:
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=536870912&scope=bot
```

Required permissions:
- Manage Webhooks
- Send Messages
- Read Message History

### 4. Test Bot Functionality

1. Create a character in dashboard
2. Use bracket/prefix in Discord
3. Verify webhook message appears
4. Check progression tracking

### 5. Set Up SSL (if using VPS)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### 6. Configure Monitoring

**Backend Health Check**:
```bash
curl https://your-backend-domain.com/health
```

**Set up monitoring** (optional):
- [UptimeRobot](https://uptimerobot.com) - Free uptime monitoring
- [Sentry](https://sentry.io) - Error tracking
- [LogRocket](https://logrocket.com) - Session replay

### 7. Database Backups

**Automated backups** (Railway/Render handle this automatically)

**Manual backup**:
```bash
pg_dump -h host -U user -d rpmanager > backup_$(date +%Y%m%d).sql
```

**Restore**:
```bash
psql -h host -U user -d rpmanager < backup_20260412.sql
```

## Troubleshooting

### Bot Not Responding

1. Check bot is online in Discord
2. Verify MESSAGE CONTENT INTENT is enabled
3. Check bot logs for errors
4. Verify API_URL is correct

### Authentication Failing

1. Verify DISCORD_CALLBACK_URL matches Discord settings
2. Check ENCRYPTION_KEY is exactly 32 characters
3. Verify SESSION_SECRET is set
4. Check FRONTEND_URL is correct

### Database Connection Issues

1. Verify DATABASE_URL format
2. Check database is accessible from server
3. Verify migrations ran successfully
4. Check database credentials

### CORS Errors

1. Verify FRONTEND_URL in backend .env
2. Check NEXT_PUBLIC_API_URL in frontend
3. Ensure credentials: 'include' in API calls

## Scaling Considerations

### Horizontal Scaling

- Use Redis for session storage (shared across instances)
- Enable database connection pooling
- Use load balancer (Nginx, AWS ALB)

### Performance Optimization

- Enable Redis caching
- Add CDN for frontend (Cloudflare)
- Optimize database queries with indexes
- Use database read replicas

### Cost Optimization

**Free Tier Options**:
- Frontend: Vercel (free)
- Backend: Railway ($5/month with free trial)
- Database: Supabase (free tier)
- Bot: Railway (included with backend)

**Estimated Monthly Cost**: $5-10 for small-medium servers

## Support

For deployment issues:
1. Check logs: `pm2 logs` or platform dashboard
2. Review environment variables
3. Verify Discord configuration
4. Open GitHub issue with error details

## Security Checklist

- [ ] All environment variables set correctly
- [ ] HTTPS enabled (SSL certificate)
- [ ] Database credentials secure
- [ ] Bot token not exposed in code
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Input sanitization active
- [ ] Session secret is random and secure
- [ ] Encryption key is exactly 32 characters
- [ ] Database backups configured
- [ ] Error logging set up
- [ ] Monitoring enabled

## Next Steps

After successful deployment:
1. Monitor error logs for first 24 hours
2. Test all features in production
3. Gather user feedback
4. Plan feature enhancements
5. Set up automated backups
6. Configure alerts for downtime

---

**Need help?** Open an issue on GitHub or contact support.
