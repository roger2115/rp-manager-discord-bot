import { Router, Request, Response } from 'express';
import passport from '../config/passport';

const router = Router();

// Initiate Discord OAuth2 flow
router.get('/login', passport.authenticate('discord'));

// OAuth2 callback
router.get(
  '/callback',
  passport.authenticate('discord', { failureRedirect: '/login' }),
  (req: Request, res: Response) => {
    // Successful authentication
    console.log('OAuth callback successful, user:', req.user);
    console.log('Session ID:', req.sessionID);
    console.log('Session:', req.session);
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3002';
    console.log('Redirecting to:', `${frontendUrl}/dashboard`);
    res.redirect(`${frontendUrl}/dashboard`);
  }
);

// Logout
router.post('/logout', (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Get current user
router.get('/me', (req: Request, res: Response) => {
  console.log('Auth check - isAuthenticated:', req.isAuthenticated());
  console.log('Auth check - user:', req.user);
  console.log('Auth check - session:', req.session);
  console.log('Auth check - sessionID:', req.sessionID);
  
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({ user: req.user });
});

export default router;
