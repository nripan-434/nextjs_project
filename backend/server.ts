import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
import session from 'express-session';
import cors from 'cors'; // Import cors
import './config/passport.js'; // Import passport config to initialize strategy
import authRoutes from './routes/authRoutes.js';
import ideaRoutes from './routes/ideaRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
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

// Create HTTP server for Socket.io
const server = http.createServer(app);
const frontendOrigin = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');

app.use(cors({
  origin: frontendOrigin,
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

// Setup Socket.io Real-Time Notifications
export const io = new Server(server, {
  cors: {
    origin: frontendOrigin,
    credentials: true
  }
});

io.on('connection', (socket) => {
  socket.on('join_user_room', (userId: string) => {
    if (userId) {
      socket.join(`user_${userId}`);
    }
  });

  socket.on('send_collaborate_request', (data: {
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    ownerId: string;
    ideaId: string;
    ideaTitle: string;
  }) => {
    if (data.ownerId) {
      io.to(`user_${data.ownerId}`).emit('new_collaborate_notification', {
        id: Date.now().toString(),
        senderId: data.senderId,
        senderName: data.senderName,
        senderAvatar: data.senderAvatar,
        ideaId: data.ideaId,
        ideaTitle: data.ideaTitle,
        timestamp: new Date().toISOString()
      });
    }
  });
});

app.use('/auth', authRoutes);
app.use('/ideas', ideaRoutes);
app.use('/projects', projectRoutes);
app.use(errorHandler);

server.listen(5000, () => {
    console.log('server with socket.io is running on http://localhost:5000');
});