import express from 'express';
import { protect, AuthRequest } from '../middleware/Authentication';
import User from '../models/User';

const router = express.Router();

router.get('/me', protect, async (req: AuthRequest, res) => {
  const user = await User.findById(req.user!.id).select('_id username email').lean();
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

export default router;