import { apiClient } from '@/lib/api';
import { 
  Comment, 
  CommentsResponse, 
  CreateCommentRequest,
  ApiResponse 
} from '@/types';

interface CommentFilters {
  page?: number;
  limit?: number;
  postId?: number;
  isApproved?: boolean;
  isSpam?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'likeCount';
  order?: 'asc' | 'desc';
}

interface UpdateCommentRequest {
  content?: string;
  isApproved?: boolean;
  isSpam?: boolean;
}

export const commentService = {
  async getComments(filters: CommentFilters = {}): Promise<CommentsResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const queryString = params.toString();
    const endpoint = queryString ? `/comments?${queryString}` : '/comments';
    
    return apiClient.get<CommentsResponse>(endpoint);
  },

  async getComment(id: number): Promise<ApiResponse<{ comment: Comment }>> {
    return apiClient.get<ApiResponse<{ comment: Comment }>>(`/comments/${id}`);
  },

  async createComment(commentData: CreateCommentRequest): Promise<ApiResponse<{ comment: Comment }>> {
    return apiClient.post<ApiResponse<{ comment: Comment }>>('/comments', commentData);
  },

  async updateComment(id: number, commentData: UpdateCommentRequest): Promise<ApiResponse<{ comment: Comment }>> {
    return apiClient.put<ApiResponse<{ comment: Comment }>>(`/comments/${id}`, commentData);
  },

  async deleteComment(id: number): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<ApiResponse<{ message: string }>>(`/comments/${id}`);
  },

  async likeComment(id: number): Promise<ApiResponse<{ likeCount: number }>> {
    return apiClient.post<ApiResponse<{ likeCount: number }>>(`/comments/${id}/like`);
  },

  async approveComment(id: number): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<ApiResponse<{ message: string }>>(`/comments/${id}/approve`);
  },

  async markAsSpam(id: number): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<ApiResponse<{ message: string }>>(`/comments/${id}/spam`);
  },

  // Get comments for a specific post
  async getPostComments(postId: number, filters: Omit<CommentFilters, 'postId'> = {}): Promise<CommentsResponse> {
    return this.getComments({ ...filters, postId });
  },

  // Get approved comments only
  async getApprovedComments(filters: Omit<CommentFilters, 'isApproved'> = {}): Promise<CommentsResponse> {
    return this.getComments({ ...filters, isApproved: true });
  },

  // Get pending comments (for moderation)
  async getPendingComments(filters: Omit<CommentFilters, 'isApproved'> = {}): Promise<CommentsResponse> {
    return this.getComments({ ...filters, isApproved: false });
  },

  // Get spam comments
  async getSpamComments(filters: Omit<CommentFilters, 'isSpam'> = {}): Promise<CommentsResponse> {
    return this.getComments({ ...filters, isSpam: true });
  }
};