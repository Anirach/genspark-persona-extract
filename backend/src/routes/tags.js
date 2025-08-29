import express from 'express';
import { 
  getTags, 
  getTag, 
  getTagBySlug,
  createTag, 
  updateTag, 
  deleteTag 
} from '../controllers/tagController.js';
import { authenticateToken, requireSuperuser } from '../middleware/auth.js';
import { validate, validateQuery, tagSchemas, querySchemas } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', validateQuery(querySchemas.pagination), getTags);
router.get('/:id', getTag);
router.get('/slug/:slug', getTagBySlug);

// Protected routes
router.post('/', authenticateToken, validate(tagSchemas.create), createTag);
router.put('/:id', authenticateToken, requireSuperuser, validate(tagSchemas.update), updateTag);
router.delete('/:id', authenticateToken, requireSuperuser, deleteTag);

export default router;