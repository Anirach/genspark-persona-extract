import { apiClient } from '@/lib/api';
import { 
  Post, 
  PostsResponse, 
  CreatePostRequest, 
  UpdatePostRequest,
  PostFilters,
  ApiResponse 
} from '@/types';

export const postService = {
  async getPosts(filters: PostFilters = {}): Promise<PostsResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const queryString = params.toString();
    const endpoint = queryString ? `/posts?${queryString}` : '/posts';
    
    return apiClient.get<PostsResponse>(endpoint);
  },

  async getPost(id: number): Promise<ApiResponse<{ post: Post }>> {
    return apiClient.get<ApiResponse<{ post: Post }>>(`/posts/${id}`);
  },

  async getPostBySlug(slug: string): Promise<ApiResponse<{ post: Post }>> {
    // Note: This would require a backend endpoint for slug-based lookup
    // For now, we'll use the ID endpoint and handle slug lookup client-side
    throw new Error('Slug-based lookup not implemented yet');
  },

  async createPost(postData: CreatePostRequest): Promise<ApiResponse<{ post: Post }>> {
    return apiClient.post<ApiResponse<{ post: Post }>>('/posts', postData);
  },

  async updatePost(id: number, postData: UpdatePostRequest): Promise<ApiResponse<{ post: Post }>> {
    return apiClient.put<ApiResponse<{ post: Post }>>(`/posts/${id}`, postData);
  },

  async deletePost(id: number): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<ApiResponse<{ message: string }>>(`/posts/${id}`);
  },

  async likePost(id: number): Promise<ApiResponse<{ likeCount: number }>> {
    return apiClient.post<ApiResponse<{ likeCount: number }>>(`/posts/${id}/like`);
  },

  // Search posts
  async searchPosts(query: string, filters: Omit<PostFilters, 'search'> = {}): Promise<PostsResponse> {
    return this.getPosts({ ...filters, search: query });
  },

  // Get posts by category
  async getPostsByCategory(categoryId: number, filters: Omit<PostFilters, 'categoryId'> = {}): Promise<PostsResponse> {
    return this.getPosts({ ...filters, categoryId });
  },

  // Get posts by tag
  async getPostsByTag(tagId: number, filters: Omit<PostFilters, 'tagId'> = {}): Promise<PostsResponse> {
    return this.getPosts({ ...filters, tagId });
  },

  // Get featured posts
  async getFeaturedPosts(filters: Omit<PostFilters, 'isFeatured'> = {}): Promise<PostsResponse> {
    return this.getPosts({ ...filters, isFeatured: true });
  },

  // Get published posts
  async getPublishedPosts(filters: Omit<PostFilters, 'isPublished'> = {}): Promise<PostsResponse> {
    return this.getPosts({ ...filters, isPublished: true });
  }
};