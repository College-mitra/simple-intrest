import express from 'express';
import { addMember, listMembers, removeMember } from '../controllers/memberController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', protect, listMembers);
router.post('/', protect, adminOnly, addMember);
router.delete('/:id', protect, adminOnly, removeMember);

export default router;
