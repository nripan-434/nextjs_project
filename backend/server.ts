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
import { RedisStore } from 'connect-redis';

dotenv.config();
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Initialize Redis client to connect Node backend server with Redis database
const redisClient = createClient({
    url: process.env.REDIS_URL as string
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
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || 'fallback_secret',
    resave: false,
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

  socket.on('join_project_room', (projectId: string) => {
    if (projectId) {
      socket.join(`project_${projectId}`);
    }
  });

  socket.on('send_project_message', async (data: {
    projectId: string;
    senderId: string;
    content: string;
  }) => {
    try {
      if (!data.projectId || !data.senderId || !data.content.trim()) return;

      const message = await prisma.message.create({
        data: {
          projectId: data.projectId,
          senderId: data.senderId,
          content: data.content.trim()
        },
        include: {
          sender: {
            select: { id: true, username: true, avatar: true }
          }
        }
      });

      io.to(`project_${data.projectId}`).emit('new_project_message', message);
    } catch (err) {
      console.error('Error saving socket project message:', err);
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