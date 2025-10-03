import { User } from '../types';
import { apiService } from './api';

class UserService {
  async getUsers(token: string): Promise<User[]> {
    try {
      const response = await apiService.get<User[]>('/users', token);
      return response;
    } catch (error: any) {
      throw new Error(`Erro ao buscar usuários: ${error.message}`);
    }
  }

  async getUserById(id: string, token: string): Promise<User> {
    try {
      const response = await apiService.get<User>(`/users/${id}`, token);
      return response;
    } catch (error: any) {
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
  }
}

export const userService = new UserService();