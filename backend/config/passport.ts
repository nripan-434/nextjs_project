import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from '../server.js'; // Assuming you export prisma from server.ts
import dotenv from 'dotenv';

dotenv.config();

// 1. Define the Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        // 1. Check if user already logged in with Google
        let user = await prisma.user.findUnique({
            where: { googleId: profile.id }
        });
        
        if (!user) {
            // 2. If not, check if a user with this email already exists (registered via password)
            const email = profile.emails?.[0].value;
            if (email) {
                user = await prisma.user.findUnique({
                    where: { email: email }
                });
            }

            if (user) {
                // 3. Link the Google account to the existing user
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        googleId: profile.id,
                        avatar: user.avatar || profile.photos?.[0].value // keep existing avatar if present
                    }
                });
            } else {
                // 4. Create a brand new user
                user = await prisma.user.create({
                    data: {
                        googleId: profile.id,
                        email: profile.emails?.[0].value || '',
                        username: profile.displayName,
                        avatar: profile.photos?.[0].value
                    }
                });
            }
        }
        return done(null, user);
    } catch (err) {
        return done(err, undefined);
    }
  }
));

// 2. Serialize user to session
passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

// 3. Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

export default passport;
