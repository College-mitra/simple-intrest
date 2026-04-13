import express from 'express';
import { resetCycle } from '../controllers/adminController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/reset', protect, adminOnly, resetCycle);

export default router;
