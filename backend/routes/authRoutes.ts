import { Router } from 'express';
import passport from 'passport';
import { googleAuthCallback, Registercontroller, Logincontroller, UpdateProfileController } from '../controllers/Usercontroller.js';

const router = Router();

// Route 0: Local Register and Login
router.post('/register', Registercontroller);
router.post('/login', Logincontroller);

// Route 1: Trigger Google login
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback for Google login
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login-failed' }),
  googleAuthCallback
);

// Route 2: Trigger GitHub login/authorization
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email', 'repo'] })
);

// Callback for GitHub login
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: (process.env.FRONTEND_URL || 'http://localhost:3000') + '/userhome?authError=github_failed' }),
  (req, res) => {
    // Successfully authenticated, redirect to frontend userhome workspace
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/userhome?githubConnected=true`);
  }
);

// Route 3: Check current authenticated user
router.get('/me', (req, res) => {
  if (req.user) {
    return res.status(200).json({ user: req.user });
  } else {
    return res.status(401).json({ user: null, message: "Not authenticated" });
  }
});

// Route 3.5: Update user profile (Progressive Profiling)
router.put('/me', UpdateProfileController);

// Route 4: Logout
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.clearCookie('connect.sid');
    res.status(200).json({ message: "Logged out successfully" });
  });
});

export default router;
