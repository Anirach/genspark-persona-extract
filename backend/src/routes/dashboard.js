import express from 'express';
import { getDashboardStats, getContentStats } from '../controllers/dashboardController.js';
import { authenticateToken, requireSuperuser } from '../middleware/auth.js';

const router = express.Router();

// Protected routes (superuser only)
router.get('/stats', authenticateToken, requireSuperuser, getDashboardStats);
router.get('/content-stats', authenticateToken, requireSuperuser, getContentStats);

export default router;