import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Tasks completed last week
  const completedLastWeek = await prisma.task.count({
    where: { userId, status: 'Done', updatedAt: { gte: weekAgo } },
  });

  // Average time to complete (simplified: time from created to done for completed tasks)
  const completedTasks = await prisma.task.findMany({
    where: { userId, status: 'Done' },
    select: { createdAt: true, updatedAt: true },
  });
  const avgTime = completedTasks.length > 0
    ? completedTasks.reduce((sum, task) => sum + (task.updatedAt.getTime() - task.createdAt.getTime()), 0) / completedTasks.length / (1000 * 60 * 60) // hours
    : 0;

  // Distribution by tags
  const tasks = await prisma.task.findMany({ where: { userId }, select: { tags: true } });
  const tagCounts: { [key: string]: number } = {};
  tasks.forEach(task => {
    task.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  res.json({
    completedLastWeek,
    avgCompletionTimeHours: avgTime,
    tagDistribution: tagCounts,
  });
});

export default router;
