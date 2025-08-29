export interface User {
  id: number;
  email: string;
  username: string;
  fullName: string;
  bio?: string;
  avatarUrl?: string;
  isActive: boolean;
  isSuperuser: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive: boolean;
  postCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  isActive: boolean;
  postCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string;
  isPublished: boolean;
  isFeatured: boolean;
  viewCount: number;
  likeCount: number;
  authorId: number;
  categoryId?: number;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
  author: User;
  category?: Category;
  tags: Tag[];
  commentCount?: number;
  comments?: Comment[];
}

export interface Comment {
  id: number;
  content: string;
  isApproved: boolean;
  isSpam: boolean;
  likeCount: number;
  authorId?: number;
  postId: number;
  parentId?: number;
  authorEmail?: string;
  authorName?: string;
  authorWebsite?: string;
  createdAt: string;
  updatedAt?: string;
  author?: User;
  post?: Post;
  parent?: Comment;
  replies?: Comment[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  fullName: string;
  password: string;
  bio?: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface CreatePostRequest {
  title: string;
  content: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  categoryId?: number;
  tagIds?: number[];
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  excerpt?: string;
  featuredImage?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  categoryId?: number;
  tagIds?: number[];
}

export interface CreateCommentRequest {
  content: string;
  postId: number;
  parentId?: number;
  authorEmail?: string;
  authorName?: string;
  authorWebsite?: string;
}

export interface PostsResponse {
  success: boolean;
  data: {
    posts: Post[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface CommentsResponse {
  success: boolean;
  data: {
    comments: Comment[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  totalCategories: number;
  totalTags: number;
  publishedPosts: number;
  draftPosts: number;
  approvedComments: number;
  pendingComments: number;
  spamComments: number;
}

export interface PostFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  tagId?: number;
  isPublished?: boolean;
  isFeatured?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'viewCount' | 'likeCount';
  order?: 'asc' | 'desc';
}