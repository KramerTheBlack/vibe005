import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';
import analyticsRoutes from './routes/analytics';
import weatherRoutes from './routes/weather';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/weather', weatherRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
