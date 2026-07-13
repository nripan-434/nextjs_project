import { Router } from 'express';
import passport from 'passport';
import { googleAuthCallback, Registercontroller, Logincontroller, UpdateProfileController } from '../controllers/Usercontroller.js';

const router = Router();

// Route 0: Local Register and Login
router.post('/register', Registercontroller);
router.post('/login', Logincontroller);

// Route 1: Trigger the Google login page
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Route 2: The callback where Google redirects after login
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login-failed' }),
  googleAuthCallback
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
    res.clearCookie('connect.sid'); // clear the session cookie
    res.status(200).json({ message: "Logged out successfully" });
  });
});

export default router;
