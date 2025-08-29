import { apiClient } from '@/lib/api';
import { Category, ApiResponse } from '@/types';

interface CategoriesResponse {
  success: boolean;
  data: {
    categories: Category[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

interface CreateCategoryRequest {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
}

interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive?: boolean;
}

export const categoryService = {
  async getCategories(params: {
    page?: number;
    limit?: number;
    isActive?: boolean;
  } = {}): Promise<CategoriesResponse> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/categories?${queryString}` : '/categories';
    
    return apiClient.get<CategoriesResponse>(endpoint);
  },

  async getCategory(id: number): Promise<ApiResponse<{ category: Category }>> {
    return apiClient.get<ApiResponse<{ category: Category }>>(`/categories/${id}`);
  },

  async getCategoryBySlug(slug: string): Promise<ApiResponse<{ category: Category }>> {
    return apiClient.get<ApiResponse<{ category: Category }>>(`/categories/slug/${slug}`);
  },

  async createCategory(categoryData: CreateCategoryRequest): Promise<ApiResponse<{ category: Category }>> {
    return apiClient.post<ApiResponse<{ category: Category }>>('/categories', categoryData);
  },

  async updateCategory(id: number, categoryData: UpdateCategoryRequest): Promise<ApiResponse<{ category: Category }>> {
    return apiClient.put<ApiResponse<{ category: Category }>>(`/categories/${id}`, categoryData);
  },

  async deleteCategory(id: number): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<ApiResponse<{ message: string }>>(`/categories/${id}`);
  },

  // Get active categories only
  async getActiveCategories(): Promise<CategoriesResponse> {
    return this.getCategories({ isActive: true });
  }
};