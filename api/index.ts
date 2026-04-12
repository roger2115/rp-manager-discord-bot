import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import session from 'express-session';
import passport from '../packages/backend/src/config/passport';
import { connectDatabase } from '../packages/backend/src/config/database';
import { apiLimiter } from '../packages/backend/src/middleware/rateLimit';

// Routes
import authRoutes from '../packages/backend/src/routes/auth';
import characterRoutes from '../packages/backend/src/routes/characters';
import progressionRoutes from '../packages/backend/src/routes/progression';
import guildsRoutes from '../packages/backend/src/routes/guilds';
import botGuildsRoutes from '../packages/backend/src/routes/botGuilds';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://your-app.vercel.app',
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Rate limiting
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.get('/api', (req, res) => {
  res.json({ message: 'RP Manager API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/progression', progressionRoutes);
app.use('/api/guilds', guildsRoutes);
app.use('/api/bot-guilds', botGuildsRoutes);

// Error handling middleware
app.use((err: Error, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize database connection
let dbInitialized = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!dbInitialized) {
    try {
      await connectDatabase();
      dbInitialized = true;
    } catch (error) {
      console.error('Failed to connect to database:', error);
      return res.status(500).json({ error: 'Database connection failed' });
    }
  }

  return app(req, res);
}