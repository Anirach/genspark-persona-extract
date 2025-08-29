import express from 'express';
import { 
  getComments, 
  getComment, 
  createComment, 
  updateComment, 
  deleteComment,
  approveComment,
  markAsSpam,
  likeComment
} from '../controllers/commentController.js';
import { authenticateToken, requireSuperuser, optionalAuth } from '../middleware/auth.js';
import { validate, validateQuery, commentSchemas, querySchemas } from '../middleware/validation.js';

const router = express.Router();

// Public/Optional auth routes
router.get('/', validateQuery(querySchemas.pagination), getComments);
router.get('/:id', getComment);
router.post('/', optionalAuth, validate(commentSchemas.create), createComment);

// Protected routes
router.put('/:id', authenticateToken, validate(commentSchemas.update), updateComment);
router.delete('/:id', authenticateToken, deleteComment);
router.post('/:id/like', authenticateToken, likeComment);

// Admin routes (superuser only)
router.post('/:id/approve', authenticateToken, requireSuperuser, approveComment);
router.post('/:id/spam', authenticateToken, requireSuperuser, markAsSpam);

export default router;