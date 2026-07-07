import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
export const prisma = new PrismaClient();

app.listen(5000, () => {
    console.log('server is running');
});