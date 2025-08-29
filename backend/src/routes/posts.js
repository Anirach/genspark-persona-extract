import express from 'express';
import { 
  getPosts, 
  getPost, 
  createPost, 
  updatePost, 
  deletePost,
  likePost 
} from '../controllers/postController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { validate, validateQuery, postSchemas, querySchemas } from '../middleware/validation.js';

const router = express.Router();

// Public routes (with optional auth)
router.get('/', validateQuery(querySchemas.postQuery), optionalAuth, getPosts);
router.get('/:id', optionalAuth, getPost);

// Protected routes
router.post('/', authenticateToken, validate(postSchemas.create), createPost);
router.put('/:id', authenticateToken, validate(postSchemas.update), updatePost);
router.delete('/:id', authenticateToken, deletePost);
router.post('/:id/like', authenticateToken, likePost);

export default router;