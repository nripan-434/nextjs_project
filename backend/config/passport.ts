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
        let user = await prisma.user.findUnique({
            where: { googleId: profile.id }
        });
        
        if (!user) {
            user = await prisma.user.create({
                data: {
                    googleId: profile.id,
                    email: profile.emails?.[0].value || '',
                    username: profile.displayName,
                    avatar: profile.photos?.[0].value
                }
            });
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
