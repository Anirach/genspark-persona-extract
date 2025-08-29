import { apiClient, authManager } from '@/lib/api';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  User, 
  ApiResponse 
} from '@/types';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    
    if (response.success && response.data.token) {
      authManager.setToken(response.data.token);
    }
    
    return response;
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    
    if (response.success && response.data.token) {
      authManager.setToken(response.data.token);
    }
    
    return response;
  },

  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    return apiClient.get<ApiResponse<{ user: User }>>('/auth/profile');
  },

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return apiClient.post<ApiResponse<{ token: string }>>('/auth/refresh');
  },

  logout(): void {
    authManager.removeToken();
  },

  isAuthenticated(): boolean {
    return authManager.isAuthenticated();
  },

  getToken(): string | null {
    return authManager.getToken();
  }
};