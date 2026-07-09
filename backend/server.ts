import express from 'express';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
import session from 'express-session';
import './config/passport.js'; // Import passport config to initialize strategy
import authRoutes from './routes/authRoutes.js';
import passport from 'passport';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const app = express();
export const prisma = new PrismaClient({ adapter });

app.use(express.json());

// Session config
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Mount the auth routes
app.use('/auth', authRoutes);

app.listen(5000, () => {
    console.log('server is running on http://localhost:5000');
});