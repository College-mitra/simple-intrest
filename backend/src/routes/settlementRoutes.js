import express from 'express';
import { generateSettlement, getSettlementPdf } from '../controllers/settlementController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/generate', protect, adminOnly, generateSettlement);
router.get('/:id/pdf', protect, getSettlementPdf);

export default router;
