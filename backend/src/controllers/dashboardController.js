import { prisma } from '../config/database.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    // Get counts for all main entities
    const [
      totalUsers,
      totalPosts,
      totalComments,
      totalCategories,
      totalTags,
      publishedPosts,
      draftPosts,
      approvedComments,
      pendingComments,
      spamComments
    ] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.comment.count(),
      prisma.category.count(),
      prisma.tag.count(),
      prisma.post.count({ where: { isPublished: true } }),
      prisma.post.count({ where: { isPublished: false } }),
      prisma.comment.count({ where: { isApproved: true } }),
      prisma.comment.count({ where: { isApproved: false } }),
      prisma.comment.count({ where: { isSpam: true } })
    ]);

    // Get recent activity
    const recentPosts = await prisma.post.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true
          }
        }
      }
    });

    const recentComments = await prisma.comment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true
          }
        },
        post: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      }
    });

    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        createdAt: true,
        isActive: true
      }
    });

    // Get popular posts (by views and likes)
    const popularPosts = await prisma.post.findMany({
      take: 5,
      where: { isPublished: true },
      orderBy: [
        { viewCount: 'desc' },
        { likeCount: 'desc' }
      ],
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true
          }
        }
      }
    });

    // Get most active authors
    const activeAuthors = await prisma.user.findMany({
      take: 5,
      select: {
        id: true,
        username: true,
        fullName: true,
        avatarUrl: true,
        _count: {
          select: {
            posts: true,
            comments: true
          }
        }
      },
      orderBy: {
        posts: {
          _count: 'desc'
        }
      }
    });

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalPosts,
          totalComments,
          totalCategories,
          totalTags,
          publishedPosts,
          draftPosts,
          approvedComments,
          pendingComments,
          spamComments
        },
        recentActivity: {
          posts: recentPosts,
          comments: recentComments,
          users: recentUsers
        },
        popularContent: {
          posts: popularPosts,
          authors: activeAuthors
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getContentStats = async (req, res, next) => {
  try {
    // Get monthly post creation stats for the last 12 months
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlyPosts = await prisma.$queryRaw`
      SELECT 
        strftime('%Y-%m', created_at) as month,
        COUNT(*) as count
      FROM posts 
      WHERE created_at >= ${twelveMonthsAgo.toISOString()}
      GROUP BY strftime('%Y-%m', created_at)
      ORDER BY month
    `;

    // Get category distribution
    const categoryStats = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        postCount: true,
        color: true
      },
      where: {
        postCount: {
          gt: 0
        }
      },
      orderBy: {
        postCount: 'desc'
      },
      take: 10
    });

    // Get tag cloud data
    const tagStats = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        postCount: true,
        color: true
      },
      where: {
        postCount: {
          gt: 0
        }
      },
      orderBy: {
        postCount: 'desc'
      },
      take: 20
    });

    // Get user engagement stats
    const engagementStats = await prisma.post.groupBy({
      by: ['authorId'],
      _sum: {
        viewCount: true,
        likeCount: true
      },
      _count: {
        id: true
      },
      orderBy: {
        _sum: {
          viewCount: 'desc'
        }
      },
      take: 10
    });

    // Get the user details for engagement stats
    const authorIds = engagementStats.map(stat => stat.authorId);
    const authors = await prisma.user.findMany({
      where: {
        id: {
          in: authorIds
        }
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        avatarUrl: true
      }
    });

    // Combine engagement stats with author details
    const engagementWithAuthors = engagementStats.map(stat => {
      const author = authors.find(a => a.id === stat.authorId);
      return {
        ...stat,
        author
      };
    });

    res.json({
      success: true,
      data: {
        monthlyPosts,
        categoryStats,
        tagStats,
        engagementStats: engagementWithAuthors
      }
    });
  } catch (error) {
    next(error);
  }
};