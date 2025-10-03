import { Task, CreateTaskData, UpdateTaskData } from '../types';
import { apiService } from './api';

class TaskService {
  async getTasks(token: string, filters?: {
    userId?: string;
    assignedToUserId?: string;
    status?: number;
    priority?: number;
    searchTerm?: string;
  }): Promise<Task[]> {
    let url = '/tasks';
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.assignedToUserId) params.append('assignedToUserId', filters.assignedToUserId);
      if (filters.status !== undefined) params.append('status', filters.status.toString());
      if (filters.priority !== undefined) params.append('priority', filters.priority.toString());
      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await apiService.get<Task[]>(url, token);
    
    let tasks: Task[] = [];
    if (Array.isArray(response)) {
      tasks = response;
    } else if (response && typeof response === 'object') {
      const responseObj = response as any;
      if ('value' in responseObj && Array.isArray(responseObj.value)) {
        tasks = responseObj.value;
      } else if ('data' in responseObj && Array.isArray(responseObj.data)) {
        tasks = responseObj.data;
      } else if ('tasks' in responseObj && Array.isArray(responseObj.tasks)) {
        tasks = responseObj.tasks;
      }
    }
    
    return tasks;
  }

  async getTaskById(id: string, token: string): Promise<Task> {
    const response = await apiService.get<Task>(`/tasks/${id}`, token);
    return response;
  }

  async createTask(data: CreateTaskData, token: string): Promise<string> {
    const cleanData = { ...data };
    
    if (!cleanData.assignedToUserId || cleanData.assignedToUserId === '') {
      delete cleanData.assignedToUserId;
    }
    
    const response = await apiService.post<{ id: string }>('/tasks', cleanData, token);
    return response.id;
  }

  async updateTask(id: string, data: UpdateTaskData, token: string): Promise<void> {
    await apiService.patch(`/tasks/${id}`, data, token);
  }

  async deleteTask(id: string, token: string): Promise<void> {
    await apiService.delete(`/tasks/${id}`, token);
  }
}

export const taskService = new TaskService();