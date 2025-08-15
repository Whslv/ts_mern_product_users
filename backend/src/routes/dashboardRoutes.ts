import express from 'express';
import { protect, AuthRequest } from '../middleware/Authentication';
import Todo from '../models/Product'; // your todos collection

const router = express.Router();

router.get('/', protect, async (req: AuthRequest, res) => {
  const userId = req.user!.id;

  const todos = await Todo.find({ user: userId });

  res.json({
    message: `Welcome to dashboard of user ${userId}`,
    todos,
  });
});

export default router;