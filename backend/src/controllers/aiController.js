import { aiService } from '../services/aiService.js';
import { prisma } from '../config/database.js';
import { slugify } from '../utils/auth.js';

export const generateBlogPost = async (req, res, next) => {
  try {
    const { 
      topic, 
      tone = 'professional',
      length = 'medium',
      categoryId,
      targetAudience = 'general',
      autoPublish = false
    } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: 'Topic is required for blog post generation'
      });
    }

    // Get category info for context
    let category = null;
    if (categoryId) {
      category = await prisma.category.findUnique({
        where: { id: parseInt(categoryId) }
      });
    }

    // Generate blog post
    const generatedPost = await aiService.generateBlogPost(topic, {
      tone,
      length,
      category: category?.name || 'general',
      targetAudience
    });

    // Generate additional metadata
    const [suggestedTags, excerpt, seoTitles] = await Promise.all([
      aiService.generateTags(generatedPost.content, 5),
      aiService.generateExcerpt(generatedPost.content, 200),
      aiService.generateSEOTitle(generatedPost.content, generatedPost.title)
    ]);

    // Create slug
    const slug = slugify(generatedPost.title) + '-' + Date.now();

    const result = {
      ...generatedPost,
      excerpt,
      slug,
      seoTitles,
      suggestedTags: [...(generatedPost.suggestedTags || []), ...suggestedTags],
      metadata: {
        tone,
        length,
        targetAudience,
        category: category?.name,
        generatedAt: new Date().toISOString()
      }
    };

    // Optionally save to database
    if (autoPublish) {
      const savedPost = await prisma.post.create({
        data: {
          title: result.title,
          content: result.content,
          slug: result.slug,
          excerpt: result.excerpt,
          authorId: req.user.id,
          categoryId: categoryId ? parseInt(categoryId) : null,
          isPublished: true,
          publishedAt: new Date(),
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              fullName: true,
              avatarUrl: true
            }
          },
          category: true
        }
      });

      result.savedPost = savedPost;
    }

    res.json({
      success: true,
      message: 'Blog post generated successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const generatePostIdeas = async (req, res, next) => {
  try {
    const { category = 'general', count = 5 } = req.query;

    const ideas = await aiService.generatePostIdeas(category, parseInt(count));

    res.json({
      success: true,
      message: 'Post ideas generated successfully',
      data: {
        ideas,
        category,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

export const improveContent = async (req, res, next) => {
  try {
    const { content, improvements = ['readability', 'seo'] } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Content is required for improvement'
      });
    }

    const improvedContent = await aiService.improveContent(content, improvements);

    res.json({
      success: true,
      message: 'Content improved successfully',
      data: {
        originalContent: content,
        improvedContent,
        improvements,
        improvedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

export const generateTags = async (req, res, next) => {
  try {
    const { content, maxTags = 5 } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Content is required for tag generation'
      });
    }

    const tags = await aiService.generateTags(content, parseInt(maxTags));

    res.json({
      success: true,
      message: 'Tags generated successfully',
      data: {
        suggestedTags: tags,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

export const generateExcerpt = async (req, res, next) => {
  try {
    const { content, maxLength = 150 } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Content is required for excerpt generation'
      });
    }

    const excerpt = await aiService.generateExcerpt(content, parseInt(maxLength));

    res.json({
      success: true,
      message: 'Excerpt generated successfully',
      data: {
        excerpt,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

export const generateSEOTitles = async (req, res, next) => {
  try {
    const { content, originalTitle } = req.body;

    if (!content || !originalTitle) {
      return res.status(400).json({
        success: false,
        message: 'Content and original title are required'
      });
    }

    const seoTitles = await aiService.generateSEOTitle(content, originalTitle);

    res.json({
      success: true,
      message: 'SEO titles generated successfully',
      data: {
        originalTitle,
        seoTitles,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

export const analyzeContent = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Content is required for analysis'
      });
    }

    // Run multiple AI analyses in parallel
    const [tags, excerpt, improvements] = await Promise.all([
      aiService.generateTags(content, 8),
      aiService.generateExcerpt(content, 200),
      // For improvements, we'll analyze what could be improved
      Promise.resolve(['readability', 'seo', 'engagement']) // Placeholder for now
    ]);

    // Basic content analysis
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed
    const sentiment = wordCount > 100 ? 'positive' : 'neutral'; // Placeholder

    res.json({
      success: true,
      message: 'Content analyzed successfully',
      data: {
        analysis: {
          wordCount,
          readingTime,
          sentiment,
          suggestedTags: tags,
          suggestedExcerpt: excerpt,
          recommendedImprovements: improvements
        },
        analyzedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};