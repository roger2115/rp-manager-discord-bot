import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Tymczasowe przekierowanie do Discord OAuth
  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=1492693587614371971&redirect_uri=${encodeURIComponent('https://panel-discord-rp.vercel.app/api/auth/callback')}&response_type=code&scope=identify%20guilds`;
  
  res.redirect(discordAuthUrl);
}