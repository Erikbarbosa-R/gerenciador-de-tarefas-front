import { User, LoginData, RegisterData, AuthResponse } from '../types';
import { apiService } from './api';
import { userService } from './userService';

class AuthService {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/users/login', data);
    return response;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/users/register', data);
    return response;
  }

  async getCurrentUser(token: string): Promise<User> {
    const tokenData = this.decodeToken(token);
    
    if (!tokenData || !tokenData.userId || !tokenData.name) {
      const savedUserData = localStorage.getItem('userData');
      if (savedUserData) {
        try {
          const userData = JSON.parse(savedUserData);
          return userData;
        } catch (error) {
        }
      }
      
      throw new Error('Não foi possível obter dados do usuário');
    }
    
    const userData: User = {
      id: tokenData.userId,
      name: tokenData.name,
      email: tokenData.email,
      role: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      isDeleted: false
    };
    
    return userData;
  }

  async getUsers(token: string): Promise<User[]> {
    return userService.getUsers(token);
  }

  async getUserById(id: string, token: string): Promise<User> {
    return userService.getUserById(id, token);
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      return null;
    }
  }
}

export const authService = new AuthService();