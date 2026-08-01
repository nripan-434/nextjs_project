import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { prisma } from '../server.js';
import dotenv from 'dotenv';

dotenv.config();

// 1. Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'fallback_google_id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'fallback_google_secret',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await prisma.user.findUnique({
            where: { googleId: profile.id }
        });
        
        if (!user) {
            const email = profile.emails?.[0]?.value;
            if (email) {
                user = await prisma.user.findUnique({
                    where: { email: email }
                });
            }

            const avatarUrl = profile.photos?.[0]?.value || null;

            if (user) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        googleId: profile.id,
                        avatar: user.avatar || avatarUrl
                    }
                });
            } else {
                user = await prisma.user.create({
                    data: {
                        googleId: profile.id,
                        email: email || '',
                        username: profile.displayName || profile.username || 'User',
                        avatar: avatarUrl
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

// 2. GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID || 'fallback_github_id',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'fallback_github_secret',
    callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:5000/auth/github/callback"
  },
  async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      let user = await prisma.user.findUnique({
        where: { githubId: profile.id }
      });

      const primaryEmail = profile.emails?.[0]?.value || `${profile.username}@github.user`;
      const avatarUrl = profile.photos?.[0]?.value || profile._json?.avatar_url || null;

      if (!user) {
        if (primaryEmail) {
          user = await prisma.user.findUnique({
            where: { email: primaryEmail }
          });
        }

        if (user) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              githubId: profile.id,
              githubAccessToken: accessToken,
              githubUsername: profile.username,
              githubUrl: profile.profileUrl || `https://github.com/${profile.username}`,
              avatar: user.avatar || avatarUrl
            }
          });
        } else {
          user = await prisma.user.create({
            data: {
              githubId: profile.id,
              githubAccessToken: accessToken,
              githubUsername: profile.username,
              githubUrl: profile.profileUrl || `https://github.com/${profile.username}`,
              email: primaryEmail,
              username: profile.username || profile.displayName || 'GitHubUser',
              avatar: avatarUrl
            }
          });
        }
      } else {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            githubAccessToken: accessToken,
            githubUsername: profile.username,
            avatar: user.avatar || avatarUrl
          }
        });
      }

      return done(null, user);
    } catch (err) {
      console.error('Error in GitHub Passport Strategy:', err);
      return done(err, undefined);
    }
  }
));

// 3. Serialize user
passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

// 4. Deserialize user
passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

export default passport;
