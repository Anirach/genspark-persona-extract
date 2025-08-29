import { apiClient } from '@/lib/api';
import { ApiResponse } from '@/types';

export interface GenerateBlogPostRequest {
  topic: string;
  tone?: 'professional' | 'casual' | 'friendly' | 'authoritative' | 'conversational';
  length?: 'short' | 'medium' | 'long';
  categoryId?: number;
  targetAudience?: string;
  autoPublish?: boolean;
}

export interface GeneratedBlogPost {
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  seoTitles: string[];
  suggestedTags: string[];
  metadata: {
    tone: string;
    length: string;
    targetAudience: string;
    category?: string;
    generatedAt: string;
  };
  savedPost?: any;
}

export interface PostIdea {
  title: string;
  description: string;
  keywords: string[];
}

export interface ContentAnalysis {
  wordCount: number;
  readingTime: number;
  sentiment: string;
  suggestedTags: string[];
  suggestedExcerpt: string;
  recommendedImprovements: string[];
}

export const aiService = {
  async generateBlogPost(request: GenerateBlogPostRequest): Promise<ApiResponse<GeneratedBlogPost>> {
    return apiClient.post<ApiResponse<GeneratedBlogPost>>('/ai/generate-post', request);
  },

  async generatePostIdeas(category: string = 'general', count: number = 5): Promise<ApiResponse<{
    ideas: PostIdea[];
    category: string;
    generatedAt: string;
  }>> {
    const params = new URLSearchParams({ category, count: count.toString() });
    return apiClient.get<ApiResponse<any>>(`/ai/generate-ideas?${params}`);
  },

  async improveContent(content: string, improvements: string[] = ['readability', 'seo']): Promise<ApiResponse<{
    originalContent: string;
    improvedContent: string;
    improvements: string[];
    improvedAt: string;
  }>> {
    return apiClient.post<ApiResponse<any>>('/ai/improve-content', { content, improvements });
  },

  async generateTags(content: string, maxTags: number = 5): Promise<ApiResponse<{
    suggestedTags: string[];
    generatedAt: string;
  }>> {
    return apiClient.post<ApiResponse<any>>('/ai/generate-tags', { content, maxTags });
  },

  async generateExcerpt(content: string, maxLength: number = 150): Promise<ApiResponse<{
    excerpt: string;
    generatedAt: string;
  }>> {
    return apiClient.post<ApiResponse<any>>('/ai/generate-excerpt', { content, maxLength });
  },

  async generateSEOTitles(content: string, originalTitle: string): Promise<ApiResponse<{
    originalTitle: string;
    seoTitles: string[];
    generatedAt: string;
  }>> {
    return apiClient.post<ApiResponse<any>>('/ai/generate-seo-titles', { content, originalTitle });
  },

  async analyzeContent(content: string): Promise<ApiResponse<{
    analysis: ContentAnalysis;
    analyzedAt: string;
  }>> {
    return apiClient.post<ApiResponse<any>>('/ai/analyze-content', { content });
  }
};