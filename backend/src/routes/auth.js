import express from 'express';
import { register, login, getProfile, refreshToken } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate, userSchemas } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validate(userSchemas.register), register);
router.post('/login', validate(userSchemas.login), login);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.post('/refresh', authenticateToken, refreshToken);

export default router;