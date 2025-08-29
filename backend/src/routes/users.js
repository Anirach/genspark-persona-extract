import express from 'express';
import { 
  getUsers, 
  getUser, 
  updateProfile, 
  updateUser, 
  deleteUser 
} from '../controllers/userController.js';
import { authenticateToken, requireSuperuser } from '../middleware/auth.js';
import { validate, validateQuery, userSchemas, querySchemas } from '../middleware/validation.js';

const router = express.Router();

// Protected routes
router.get('/', authenticateToken, requireSuperuser, validateQuery(querySchemas.pagination), getUsers);
router.get('/:id', authenticateToken, getUser);
router.put('/profile', authenticateToken, validate(userSchemas.update), updateProfile);
router.put('/:id', authenticateToken, requireSuperuser, validate(userSchemas.update), updateUser);
router.delete('/:id', authenticateToken, requireSuperuser, deleteUser);

export default router;