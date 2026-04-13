import express from 'express';
import { login, registerGroupAdmin } from '../controllers/authController.js';

const router = express.Router();
router.post('/register-admin', registerGroupAdmin);
router.post('/login', login);

export default router;
