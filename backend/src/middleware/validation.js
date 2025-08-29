import Joi from 'joi';

// Validation middleware factory
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details
      });
    }
    
    next();
  };
};

// Query validation middleware
export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message: 'Query validation error',
        errors: error.details
      });
    }
    
    next();
  };
};

// User validation schemas
export const userSchemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    fullName: Joi.string().min(2).max(100).required(),
    password: Joi.string().min(6).required(),
    bio: Joi.string().max(500).optional(),
    avatarUrl: Joi.string().uri().optional(),
  }),

  login: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),

  update: Joi.object({
    email: Joi.string().email().optional(),
    username: Joi.string().alphanum().min(3).max(30).optional(),
    fullName: Joi.string().min(2).max(100).optional(),
    bio: Joi.string().max(500).optional(),
    avatarUrl: Joi.string().uri().optional(),
  }),
};

// Post validation schemas
export const postSchemas = {
  create: Joi.object({
    title: Joi.string().min(1).max(500).required(),
    content: Joi.string().min(1).required(),
    slug: Joi.string().min(1).max(500).required(),
    excerpt: Joi.string().max(1000).optional(),
    featuredImage: Joi.string().uri().optional(),
    isPublished: Joi.boolean().optional(),
    isFeatured: Joi.boolean().optional(),
    categoryId: Joi.number().integer().positive().optional(),
    tagIds: Joi.array().items(Joi.number().integer().positive()).optional(),
  }),

  update: Joi.object({
    title: Joi.string().min(1).max(500).optional(),
    content: Joi.string().min(1).optional(),
    excerpt: Joi.string().max(1000).optional(),
    featuredImage: Joi.string().uri().optional(),
    isPublished: Joi.boolean().optional(),
    isFeatured: Joi.boolean().optional(),
    categoryId: Joi.number().integer().positive().optional(),
    tagIds: Joi.array().items(Joi.number().integer().positive()).optional(),
  }),
};

// Category validation schemas
export const categorySchemas = {
  create: Joi.object({
    name: Joi.string().min(1).max(200).required(),
    slug: Joi.string().min(1).max(200).required(),
    description: Joi.string().max(1000).optional(),
    color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional(),
    icon: Joi.string().max(100).optional(),
  }),

  update: Joi.object({
    name: Joi.string().min(1).max(200).optional(),
    description: Joi.string().max(1000).optional(),
    color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional(),
    icon: Joi.string().max(100).optional(),
    isActive: Joi.boolean().optional(),
  }),
};

// Tag validation schemas
export const tagSchemas = {
  create: Joi.object({
    name: Joi.string().min(1).max(100).required(),
    slug: Joi.string().min(1).max(100).required(),
    description: Joi.string().max(1000).optional(),
    color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional(),
  }),

  update: Joi.object({
    name: Joi.string().min(1).max(100).optional(),
    description: Joi.string().max(1000).optional(),
    color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional(),
    isActive: Joi.boolean().optional(),
  }),
};

// Comment validation schemas
export const commentSchemas = {
  create: Joi.object({
    content: Joi.string().min(1).required(),
    postId: Joi.number().integer().positive().required(),
    parentId: Joi.number().integer().positive().optional(),
    authorEmail: Joi.string().email().optional(),
    authorName: Joi.string().min(1).max(200).optional(),
    authorWebsite: Joi.string().uri().optional(),
  }),

  update: Joi.object({
    content: Joi.string().min(1).optional(),
    isApproved: Joi.boolean().optional(),
    isSpam: Joi.boolean().optional(),
  }),
};

// Query validation schemas
export const querySchemas = {
  pagination: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    skip: Joi.number().integer().min(0).optional(),
  }),

  postQuery: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    search: Joi.string().optional(),
    categoryId: Joi.number().integer().positive().optional(),
    tagId: Joi.number().integer().positive().optional(),
    isPublished: Joi.boolean().optional(),
    isFeatured: Joi.boolean().optional(),
    sortBy: Joi.string().valid('createdAt', 'updatedAt', 'title', 'viewCount', 'likeCount').optional(),
    order: Joi.string().valid('asc', 'desc').optional(),
  }),
};