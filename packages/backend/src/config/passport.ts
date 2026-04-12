import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { PrismaClient } from '@prisma/client';
import { encrypt } from '../utils/encryption';

const prisma = new PrismaClient();

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    // In a real implementation, fetch user from database
    done(null, { id });
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      callbackURL: process.env.DISCORD_CALLBACK_URL!,
      scope: ['identify', 'guilds'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('OAuth callback received for user:', profile.id);
        
        // Generate session token
        const sessionToken = require('crypto').randomBytes(32).toString('hex');
        
        // Store or update user session
        const session = await prisma.userSession.upsert({
          where: { userId: profile.id },
          update: {
            accessToken: encrypt(accessToken),
            refreshToken: encrypt(refreshToken || ''),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          },
          create: {
            userId: profile.id,
            token: sessionToken,
            accessToken: encrypt(accessToken),
            refreshToken: encrypt(refreshToken || ''),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });

        console.log('Session created/updated for user:', profile.id);
        done(null, { id: profile.id, session });
      } catch (error) {
        console.error('OAuth callback error:', error);
        done(error as Error, undefined);
      }
    }
  )
);

export default passport;
