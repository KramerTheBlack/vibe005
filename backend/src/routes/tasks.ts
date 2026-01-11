import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  const tasks = await prisma.task.findMany({ where: { userId: req.user!.id } });
  res.json(tasks);
});

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  const { title, description, status, priority, deadline, tags } = req.body;
  const task = await prisma.task.create({
    data: { title, description, status, priority, deadline: deadline ? new Date(deadline) : null, tags, userId: req.user!.id },
  });
  res.status(201).json(task);
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { title, description, status, priority, deadline, tags } = req.body;
  const task = await prisma.task.updateMany({
    where: { id: parseInt(id), userId: req.user!.id },
    data: { title, description, status, priority, deadline: deadline ? new Date(deadline) : null, tags },
  });
  if (task.count === 0) return res.status(404).json({ error: 'Task not found' });
  res.json({ message: 'Task updated' });
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const task = await prisma.task.deleteMany({
    where: { id: parseInt(id), userId: req.user!.id },
  });
  if (task.count === 0) return res.status(404).json({ error: 'Task not found' });
  res.json({ message: 'Task deleted' });
});

export default router;
