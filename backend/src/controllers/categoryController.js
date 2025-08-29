import { prisma } from '../config/database.js';

export const getCategories = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, isActive } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      ...(isActive !== undefined && { isActive: isActive === 'true' })
    };

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        skip: parseInt(skip),
        take: parseInt(limit),
        where,
        orderBy: {
          name: 'asc'
        }
      }),
      prisma.category.count({ where })
    ]);

    const pages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        categories,
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

export const getCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: {
        posts: {
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
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: { category }
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        posts: {
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
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: { category }
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, slug, description, color, icon } = req.body;

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: 'Category with this slug already exists'
      });
    }

    // Check if name already exists
    const existingName = await prisma.category.findUnique({
      where: { name }
    });

    if (existingName) {
      return res.status(409).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        color,
        icon
      }
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category }
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, color, icon, isActive } = req.body;

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if new name already exists (if being updated)
    if (name && name !== existingCategory.name) {
      const duplicateName = await prisma.category.findUnique({
        where: { name }
      });

      if (duplicateName) {
        return res.status(409).json({
          success: false,
          message: 'Category with this name already exists'
        });
      }
    }

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(color !== undefined && { color }),
        ...(icon !== undefined && { icon }),
        ...(isActive !== undefined && { isActive })
      }
    });

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: { category }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has posts
    if (category.postCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing posts'
      });
    }

    await prisma.category.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};