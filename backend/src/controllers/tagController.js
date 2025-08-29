import { prisma } from '../config/database.js';

export const getTags = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, isActive } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      ...(isActive !== undefined && { isActive: isActive === 'true' })
    };

    const [tags, total] = await Promise.all([
      prisma.tag.findMany({
        skip: parseInt(skip),
        take: parseInt(limit),
        where,
        orderBy: {
          name: 'asc'
        }
      }),
      prisma.tag.count({ where })
    ]);

    const pages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        tags,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getTag = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tag = await prisma.tag.findUnique({
      where: { id: parseInt(id) },
      include: {
        posts: {
          include: {
            post: {
              where: {
                isPublished: true
              },
              select: {
                id: true,
                title: true,
                slug: true,
                excerpt: true,
                featuredImage: true,
                createdAt: true,
                author: {
                  select: {
                    id: true,
                    username: true,
                    fullName: true
                  }
                }
              }
            }
          },
          take: 10
        }
      }
    });

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found'
      });
    }

    // Transform the posts
    const transformedTag = {
      ...tag,
      posts: tag.posts.map(pt => pt.post).filter(Boolean)
    };

    res.json({
      success: true,
      data: { tag: transformedTag }
    });
  } catch (error) {
    next(error);
  }
};

export const getTagBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const tag = await prisma.tag.findUnique({
      where: { slug },
      include: {
        posts: {
          include: {
            post: {
              where: {
                isPublished: true
              },
              select: {
                id: true,
                title: true,
                slug: true,
                excerpt: true,
                featuredImage: true,
                createdAt: true,
                author: {
                  select: {
                    id: true,
                    username: true,
                    fullName: true
                  }
                }
              }
            }
          },
          take: 10
        }
      }
    });

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found'
      });
    }

    // Transform the posts
    const transformedTag = {
      ...tag,
      posts: tag.posts.map(pt => pt.post).filter(Boolean)
    };

    res.json({
      success: true,
      data: { tag: transformedTag }
    });
  } catch (error) {
    next(error);
  }
};

export const createTag = async (req, res, next) => {
  try {
    const { name, slug, description, color } = req.body;

    // Check if slug already exists
    const existingTag = await prisma.tag.findUnique({
      where: { slug }
    });

    if (existingTag) {
      return res.status(409).json({
        success: false,
        message: 'Tag with this slug already exists'
      });
    }

    // Check if name already exists
    const existingName = await prisma.tag.findUnique({
      where: { name }
    });

    if (existingName) {
      return res.status(409).json({
        success: false,
        message: 'Tag with this name already exists'
      });
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        slug,
        description,
        color
      }
    });

    res.status(201).json({
      success: true,
      message: 'Tag created successfully',
      data: { tag }
    });
  } catch (error) {
    next(error);
  }
};

export const updateTag = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, color, isActive } = req.body;

    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingTag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found'
      });
    }

    // Check if new name already exists (if being updated)
    if (name && name !== existingTag.name) {
      const duplicateName = await prisma.tag.findUnique({
        where: { name }
      });

      if (duplicateName) {
        return res.status(409).json({
          success: false,
          message: 'Tag with this name already exists'
        });
      }
    }

    const tag = await prisma.tag.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(color !== undefined && { color }),
        ...(isActive !== undefined && { isActive })
      }
    });

    res.json({
      success: true,
      message: 'Tag updated successfully',
      data: { tag }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTag = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if tag exists
    const tag = await prisma.tag.findUnique({
      where: { id: parseInt(id) }
    });

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found'
      });
    }

    // Check if tag has posts
    if (tag.postCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete tag with existing posts'
      });
    }

    await prisma.tag.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Tag deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};