import express from 'express';
import { 
  getCategories, 
  getCategory, 
  getCategoryBySlug,
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../controllers/categoryController.js';
import { authenticateToken, requireSuperuser } from '../middleware/auth.js';
import { validate, validateQuery, categorySchemas, querySchemas } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', validateQuery(querySchemas.pagination), getCategories);
router.get('/:id', getCategory);
router.get('/slug/:slug', getCategoryBySlug);

// Protected routes (superuser only for CUD operations)
router.post('/', authenticateToken, requireSuperuser, validate(categorySchemas.create), createCategory);
router.put('/:id', authenticateToken, requireSuperuser, validate(categorySchemas.update), updateCategory);
router.delete('/:id', authenticateToken, requireSuperuser, deleteCategory);

export default router;