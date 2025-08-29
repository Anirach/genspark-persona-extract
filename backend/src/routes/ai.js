import express from 'express';
import { 
  generateBlogPost,
  generatePostIdeas,
  improveContent,
  generateTags,
  generateExcerpt,
  generateSEOTitles,
  analyzeContent
} from '../controllers/aiController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import Joi from 'joi';

const router = express.Router();

// Validation schemas
const generatePostSchema = Joi.object({
  topic: Joi.string().min(3).max(200).required(),
  tone: Joi.string().valid('professional', 'casual', 'friendly', 'authoritative', 'conversational').optional(),
  length: Joi.string().valid('short', 'medium', 'long').optional(),
  categoryId: Joi.number().integer().positive().optional(),
  targetAudience: Joi.string().max(100).optional(),
  autoPublish: Joi.boolean().optional()
});

const improveContentSchema = Joi.object({
  content: Joi.string().min(10).required(),
  improvements: Joi.array().items(
    Joi.string().valid('readability', 'seo', 'engagement', 'clarity', 'structure')
  ).optional()
});

const generateTagsSchema = Joi.object({
  content: Joi.string().min(10).required(),
  maxTags: Joi.number().integer().min(1).max(10).optional()
});

const generateExcerptSchema = Joi.object({
  content: Joi.string().min(10).required(),
  maxLength: Joi.number().integer().min(50).max(500).optional()
});

const generateSEOTitlesSchema = Joi.object({
  content: Joi.string().min(10).required(),
  originalTitle: Joi.string().min(3).max(200).required()
});

const analyzeContentSchema = Joi.object({
  content: Joi.string().min(10).required()
});

// AI Generation Routes (require authentication)
router.post('/generate-post', authenticateToken, validate(generatePostSchema), generateBlogPost);
router.get('/generate-ideas', authenticateToken, generatePostIdeas);
router.post('/improve-content', authenticateToken, validate(improveContentSchema), improveContent);
router.post('/generate-tags', authenticateToken, validate(generateTagsSchema), generateTags);
router.post('/generate-excerpt', authenticateToken, validate(generateExcerptSchema), generateExcerpt);
router.post('/generate-seo-titles', authenticateToken, validate(generateSEOTitlesSchema), generateSEOTitles);
router.post('/analyze-content', authenticateToken, validate(analyzeContentSchema), analyzeContent);

export default router;