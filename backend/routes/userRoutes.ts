import express from 'express';
import { syncUser, getAllUsers } from '../controllers/userController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/sync', authMiddleware, syncUser);
router.get('/', authMiddleware, roleMiddleware(['admin', 'super_admin']), getAllUsers);

export default router;
