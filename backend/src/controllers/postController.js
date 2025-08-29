import { prisma } from '../config/database.js';

export const getPosts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      categoryId,
      tagId,
      isPublished,
      isFeatured,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    // Build where clause
    const where = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
          { excerpt: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(categoryId && { categoryId: parseInt(categoryId) }),
      ...(isPublished !== undefined && { isPublished: isPublished === 'true' }),
      ...(isFeatured !== undefined && { isFeatured: isFeatured === 'true' }),
      ...(tagId && {
        tags: {
          some: {
            tagId: parseInt(tagId)
          }
        }
      })
    };

    // Build orderBy clause
    const orderBy = { [sortBy]: order };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        skip: parseInt(skip),
        take,
        where,
        orderBy,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              fullName: true,
              avatarUrl: true
            }
          },
          category: true,
          tags: {
            include: {
              tag: true
            }
          },
          _count: {
            select: {
              comments: true
            }
          }
        }
      }),
      prisma.post.count({ where })
    ]);

    const pages = Math.ceil(total / take);

    // Transform posts to include tags properly
    const transformedPosts = posts.map(post => ({
      ...post,
      tags: post.tags.map(pt => pt.tag),
      commentCount: post._count.comments
    }));

    res.json({
      success: true,
      data: {
        posts: transformedPosts,
        pagination: {
          page: parseInt(page),
          limit: take,
          total,
          pages
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true
          }
        },
        category: true,
        tags: {
          include: {
            tag: true
          }
        },
        comments: {
          where: {
            parentId: null,
            isApproved: true
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
            replies: {
              where: {
                isApproved: true
              },
              include: {
                author: {
                  select: {
                    id: true,
                    username: true,
                    fullName: true,
                    avatarUrl: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Increment view count
    await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        viewCount: {
          increment: 1
        }
      }
    });

    // Transform post to include tags properly
    const transformedPost = {
      ...post,
      tags: post.tags.map(pt => pt.tag),
      viewCount: post.viewCount + 1
    };

    res.json({
      success: true,
      data: { post: transformedPost }
    });
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const {
      title,
      content,
      slug,
      excerpt,
      featuredImage,
      isPublished = false,
      isFeatured = false,
      categoryId,
      tagIds = []
    } = req.body;

    // Check if slug already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug }
    });

    if (existingPost) {
      return res.status(409).json({
        success: false,
        message: 'Post with this slug already exists'
      });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        slug,
        excerpt,
        featuredImage,
        isPublished,
        isFeatured,
        authorId: req.user.id,
        categoryId: categoryId ? parseInt(categoryId) : null,
        publishedAt: isPublished ? new Date() : null,
        tags: {
          create: tagIds.map(tagId => ({
            tag: {
              connect: { id: parseInt(tagId) }
            }
          }))
        }
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
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    // Update tag post counts
    if (tagIds.length > 0) {
      await prisma.tag.updateMany({
        where: {
          id: {
            in: tagIds.map(id => parseInt(id))
          }
        },
        data: {
          postCount: {
            increment: 1
          }
        }
      });
    }

    // Update category post count
    if (categoryId) {
      await prisma.category.update({
        where: { id: parseInt(categoryId) },
        data: {
          postCount: {
            increment: 1
          }
        }
      });
    }

    // Transform post to include tags properly
    const transformedPost = {
      ...post,
      tags: post.tags.map(pt => pt.tag)
    };

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: { post: transformedPost }
    });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      excerpt,
      featuredImage,
      isPublished,
      isFeatured,
      categoryId,
      tagIds
    } = req.body;

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: {
        tags: true,
        category: true
      }
    });

    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check ownership (unless superuser)
    if (existingPost.authorId !== req.user.id && !req.user.isSuperuser) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }

    // Handle category change
    const oldCategoryId = existingPost.categoryId;
    const newCategoryId = categoryId ? parseInt(categoryId) : null;

    // Handle tag changes
    const oldTagIds = existingPost.tags.map(pt => pt.tagId);
    const newTagIds = tagIds ? tagIds.map(id => parseInt(id)) : oldTagIds;

    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(excerpt !== undefined && { excerpt }),
        ...(featuredImage !== undefined && { featuredImage }),
        ...(isPublished !== undefined && { 
          isPublished,
          publishedAt: isPublished && !existingPost.isPublished ? new Date() : existingPost.publishedAt
        }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(categoryId !== undefined && { categoryId: newCategoryId }),
        ...(tagIds && {
          tags: {
            deleteMany: {},
            create: newTagIds.map(tagId => ({
              tag: {
                connect: { id: tagId }
              }
            }))
          }
        })
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
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    // Update category post counts
    if (oldCategoryId !== newCategoryId) {
      if (oldCategoryId) {
        await prisma.category.update({
          where: { id: oldCategoryId },
          data: { postCount: { decrement: 1 } }
        });
      }
      if (newCategoryId) {
        await prisma.category.update({
          where: { id: newCategoryId },
          data: { postCount: { increment: 1 } }
        });
      }
    }

    // Update tag post counts
    if (tagIds) {
      const removedTagIds = oldTagIds.filter(id => !newTagIds.includes(id));
      const addedTagIds = newTagIds.filter(id => !oldTagIds.includes(id));

      if (removedTagIds.length > 0) {
        await prisma.tag.updateMany({
          where: { id: { in: removedTagIds } },
          data: { postCount: { decrement: 1 } }
        });
      }

      if (addedTagIds.length > 0) {
        await prisma.tag.updateMany({
          where: { id: { in: addedTagIds } },
          data: { postCount: { increment: 1 } }
        });
      }
    }

    // Transform post to include tags properly
    const transformedPost = {
      ...post,
      tags: post.tags.map(pt => pt.tag)
    };

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: { post: transformedPost }
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: {
        tags: true
      }
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check ownership (unless superuser)
    if (post.authorId !== req.user.id && !req.user.isSuperuser) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    // Delete post (cascades to comments and post_tags)
    await prisma.post.delete({
      where: { id: parseInt(id) }
    });

    // Update category post count
    if (post.categoryId) {
      await prisma.category.update({
        where: { id: post.categoryId },
        data: { postCount: { decrement: 1 } }
      });
    }

    // Update tag post counts
    const tagIds = post.tags.map(pt => pt.tagId);
    if (tagIds.length > 0) {
      await prisma.tag.updateMany({
        where: { id: { in: tagIds } },
        data: { postCount: { decrement: 1 } }
      });
    }

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) }
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const updatedPost = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        likeCount: {
          increment: 1
        }
      }
    });

    res.json({
      success: true,
      message: 'Post liked successfully',
      data: {
        likeCount: updatedPost.likeCount
      }
    });
  } catch (error) {
    next(error);
  }
};