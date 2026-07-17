import express from 'express';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
import session from 'express-session';
import cors from 'cors'; // Import cors
import './config/passport.js'; // Import passport config to initialize strategy
import authRoutes from './routes/authRoutes.js';
import ideaRoutes from './routes/ideaRoutes.js';
import passport from 'passport';
import { errorHandler } from './middlewares/errorHandler.js';
import { createClient } from 'redis';
import {RedisStore} from 'connect-redis';

dotenv.config();
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});
redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Connected to Redis successfully'));
redisClient.connect().catch(console.error);
const app = express();
export const prisma = new PrismaClient({ adapter });
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(session({
    store: new RedisStore({ client: redisClient }), // <--- ADD THIS LINE
    secret: process.env.SESSION_SECRET || 'fallback_secret',
    resave: false, // RedisStore handles saving
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRoutes);
app.use('/ideas', ideaRoutes);
app.use(errorHandler);
app.listen(5000, () => {
    console.log('server is running on http://localhost:5000');
});