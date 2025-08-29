import { apiClient } from '@/lib/api';
import { DashboardStats, ApiResponse } from '@/types';

interface DashboardResponse {
  success: boolean;
  data: {
    stats: DashboardStats;
    recentActivity: {
      posts: any[];
      comments: any[];
      users: any[];
    };
    popularContent: {
      posts: any[];
      authors: any[];
    };
  };
}

interface ContentStatsResponse {
  success: boolean;
  data: {
    monthlyPosts: Array<{
      month: string;
      count: number;
    }>;
    categoryStats: Array<{
      id: number;
      name: string;
      postCount: number;
      color?: string;
    }>;
    tagStats: Array<{
      id: number;
      name: string;
      postCount: number;
      color?: string;
    }>;
    engagementStats: Array<{
      authorId: number;
      _sum: {
        viewCount: number;
        likeCount: number;
      };
      _count: {
        id: number;
      };
      author: {
        id: number;
        username: string;
        fullName: string;
        avatarUrl?: string;
      };
    }>;
  };
}

export const dashboardService = {
  async getDashboardStats(): Promise<DashboardResponse> {
    return apiClient.get<DashboardResponse>('/dashboard/stats');
  },

  async getContentStats(): Promise<ContentStatsResponse> {
    return apiClient.get<ContentStatsResponse>('/dashboard/content-stats');
  }
};