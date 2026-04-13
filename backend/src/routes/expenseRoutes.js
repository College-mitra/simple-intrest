import express from 'express';
import { addExpense, listExpenses } from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', protect, listExpenses);
router.post('/', protect, addExpense);

export default router;
