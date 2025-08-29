import { prisma } from '../config/database.js';

export const getComments = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      postId,
      isApproved,
      isSpam,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const skip = (page - 1) * limit;

    const where = {
      ...(postId && { postId: parseInt(postId) }),
      ...(isApproved !== undefined && { isApproved: isApproved === 'true' }),
      ...(isSpam !== undefined && { isSpam: isSpam === 'true' }),
      parentId: null // Only top-level comments
    };

    const orderBy = { [sortBy]: order };

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        skip: parseInt(skip),
        take: parseInt(limit),
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
          post: {
            select: {
              id: true,
              title: true,
              slug: true
            }
          },
          replies: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  fullName: true,
                  avatarUrl: true
                }
              }
            },
            orderBy: {
              createdAt: 'asc'
            }
          }
        }
      }),
      prisma.comment.count({ where })
    ]);

    const pages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        comments,
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

export const getComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await prisma.comment.findUnique({
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
        post: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        },
        parent: {
          select: {
            id: true,
            content: true,
            author: {
              select: {
                id: true,
                username: true,
                fullName: true
              }
            }
          }
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                fullName: true,
                avatarUrl: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    res.json({
      success: true,
      data: { comment }
    });
  } catch (error) {
    next(error);
  }
};

export const createComment = async (req, res, next) => {
  try {
    const {
      content,
      postId,
      parentId,
      authorEmail,
      authorName,
      authorWebsite
    } = req.body;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: parseInt(postId) }
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if parent comment exists (for replies)
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parseInt(parentId) }
      });

      if (!parentComment) {
        return res.status(404).json({
          success: false,
          message: 'Parent comment not found'
        });
      }

      if (parentComment.postId !== parseInt(postId)) {
        return res.status(400).json({
          success: false,
          message: 'Parent comment must be from the same post'
        });
      }
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: parseInt(postId),
        parentId: parentId ? parseInt(parentId) : null,
        authorId: req.user ? req.user.id : null,
        authorEmail,
        authorName,
        authorWebsite,
        isApproved: req.user ? true : false // Auto-approve for authenticated users
      },
      include: {
        author: req.user ? {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true
          }
        } : false,
        post: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        },
        replies: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      data: { comment }
    });
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content, isApproved, isSpam } = req.body;

    // Check if comment exists
    const existingComment = await prisma.comment.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingComment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check ownership (unless superuser) - only for content updates
    if (content && existingComment.authorId !== req.user?.id && !req.user?.isSuperuser) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this comment'
      });
    }

    // Only superusers can update approval/spam status
    if ((isApproved !== undefined || isSpam !== undefined) && !req.user?.isSuperuser) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to moderate comments'
      });
    }

    const comment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: {
        ...(content && { content }),
        ...(isApproved !== undefined && { isApproved }),
        ...(isSpam !== undefined && { isSpam })
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
        post: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        },
        replies: {
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
      }
    });

    res.json({
      success: true,
      message: 'Comment updated successfully',
      data: { comment }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) }
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check ownership (unless superuser)
    if (comment.authorId !== req.user?.id && !req.user?.isSuperuser) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    await prisma.comment.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const approveComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) }
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    await prisma.comment.update({
      where: { id: parseInt(id) },
      data: {
        isApproved: true,
        isSpam: false
      }
    });

    res.json({
      success: true,
      message: 'Comment approved successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const markAsSpam = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) }
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    await prisma.comment.update({
      where: { id: parseInt(id) },
      data: {
        isSpam: true,
        isApproved: false
      }
    });

    res.json({
      success: true,
      message: 'Comment marked as spam'
    });
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) }
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: {
        likeCount: {
          increment: 1
        }
      }
    });

    res.json({
      success: true,
      message: 'Comment liked successfully',
      data: {
        likeCount: updatedComment.likeCount
      }
    });
  } catch (error) {
    next(error);
  }
};