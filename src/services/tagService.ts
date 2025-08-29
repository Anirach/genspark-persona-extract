import { apiClient } from '@/lib/api';
import { Tag, ApiResponse } from '@/types';

interface TagsResponse {
  success: boolean;
  data: {
    tags: Tag[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

interface CreateTagRequest {
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

interface UpdateTagRequest {
  name?: string;
  description?: string;
  color?: string;
  isActive?: boolean;
}

export const tagService = {
  async getTags(params: {
    page?: number;
    limit?: number;
    isActive?: boolean;
  } = {}): Promise<TagsResponse> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/tags?${queryString}` : '/tags';
    
    return apiClient.get<TagsResponse>(endpoint);
  },

  async getTag(id: number): Promise<ApiResponse<{ tag: Tag }>> {
    return apiClient.get<ApiResponse<{ tag: Tag }>>(`/tags/${id}`);
  },

  async getTagBySlug(slug: string): Promise<ApiResponse<{ tag: Tag }>> {
    return apiClient.get<ApiResponse<{ tag: Tag }>>(`/tags/slug/${slug}`);
  },

  async createTag(tagData: CreateTagRequest): Promise<ApiResponse<{ tag: Tag }>> {
    return apiClient.post<ApiResponse<{ tag: Tag }>>('/tags', tagData);
  },

  async updateTag(id: number, tagData: UpdateTagRequest): Promise<ApiResponse<{ tag: Tag }>> {
    return apiClient.put<ApiResponse<{ tag: Tag }>>(`/tags/${id}`, tagData);
  },

  async deleteTag(id: number): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<ApiResponse<{ message: string }>>(`/tags/${id}`);
  },

  // Get active tags only
  async getActiveTags(): Promise<TagsResponse> {
    return this.getTags({ isActive: true });
  },

  // Get popular tags (sorted by post count)
  async getPopularTags(limit: number = 10): Promise<TagsResponse> {
    return this.getTags({ limit, isActive: true });
  }
};