import express from 'express';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const notifications = await Notification.find({ group: req.user.group }).sort({ createdAt: -1 }).limit(100);
  res.json(notifications);
});

export default router;
