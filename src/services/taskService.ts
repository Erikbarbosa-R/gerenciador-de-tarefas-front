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
    
    tasks.forEach((task, index) => {
      console.log(`Tarefa ${index + 1}:`, {
        id: task.id,
        title: task.title,
        status: task.status,
        priority: task.priority,
        userId: task.userId,
        assignedToUserId: task.assignedToUserId,
        dueDate: task.dueDate
      });
    });
    
    if (!filters) {
      const uniqueUsers = Array.from(new Set(tasks.map(t => t.userId)));
      const uniqueAssignedUsers = Array.from(new Set(tasks.map(t => t.assignedToUserId).filter(Boolean)));
      console.log('Estatísticas gerais:', {
        totalTarefas: tasks.length,
        usuariosUnicosCriadores: uniqueUsers.length,
        usuariosUnicosDelegados: uniqueAssignedUsers.length,
        tarefasSemAtribuicao: tasks.filter(t => !t.assignedToUserId).length
      });
    }
    
    if (filters?.assignedToUserId) {
      const tasksAssignedToUser = tasks.filter(t => t.assignedToUserId === filters.assignedToUserId);
      console.log(`Tarefas delegadas para usuário ${filters.assignedToUserId}:`, tasksAssignedToUser.length);
      if (tasksAssignedToUser.length !== tasks.length) {
        console.warn(`Filtro assignedToUserId=${filters.assignedToUserId} retornou ${tasks.length} tarefas, mas apenas ${tasksAssignedToUser.length} foram realmente delegadas para este usuário!`);
        const wrongAssignedTasks = tasks.filter(t => t.assignedToUserId !== filters.assignedToUserId);
        console.warn('Tarefas não delegadas para o usuário:', wrongAssignedTasks.map(t => ({ 
          id: t.id, 
          title: t.title, 
          assignedToUserId: t.assignedToUserId,
          userId: t.userId 
        })));
      }
    }
    
    if (filters?.status !== undefined) {
      const tasksWithCorrectStatus = tasks.filter(t => t.status === filters.status);
      console.log(`Tarefas com status ${filters.status}:`, tasksWithCorrectStatus.length);
      if (tasksWithCorrectStatus.length !== tasks.length) {
        console.warn(`Filtro status=${filters.status} retornou ${tasks.length} tarefas, mas apenas ${tasksWithCorrectStatus.length} têm o status correto!`);
        const wrongStatusTasks = tasks.filter(t => t.status !== filters.status);
        console.warn('Tarefas com status incorreto:', wrongStatusTasks.map(t => ({ 
          id: t.id, 
          title: t.title, 
          status: t.status 
        })));
      }
    }
    
    if (filters?.priority !== undefined) {
      const tasksWithCorrectPriority = tasks.filter(t => t.priority === filters.priority);
      console.log(`Tarefas com prioridade ${filters.priority}:`, tasksWithCorrectPriority.length);
      if (tasksWithCorrectPriority.length !== tasks.length) {
        console.warn(`Filtro priority=${filters.priority} retornou ${tasks.length} tarefas, mas apenas ${tasksWithCorrectPriority.length} têm a prioridade correta!`);
        const wrongPriorityTasks = tasks.filter(t => t.priority !== filters.priority);
        console.warn('Tarefas com prioridade incorreta:', wrongPriorityTasks.map(t => ({ 
          id: t.id, 
          title: t.title, 
          priority: t.priority 
        })));
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