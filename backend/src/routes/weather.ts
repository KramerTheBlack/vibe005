import { Router } from 'express';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id }, select: { city: true } });
  if (!user?.city) return res.status(400).json({ error: 'City not set' });

  try {
    const response = await axios.get(`http://service-worker:8000/weather?city=${user.city}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Weather service unavailable' });
  }
});

export default router;
