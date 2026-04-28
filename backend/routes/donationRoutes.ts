import express from 'express';
import { createOrder, verifyPayment } from '../controllers/donationController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);

export default router;
