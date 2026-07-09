import { Router } from 'express';
import passport from 'passport';
import { googleAuthCallback } from '../controllers/Usercontroller.js';

const router = Router();

// Route 1: Trigger the Google login page
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Route 2: The callback where Google redirects after login
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login-failed' }),
  googleAuthCallback
);

export default router;
