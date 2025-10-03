import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Task, CreateTaskData, UpdateTaskData } from '../types';
import { taskService } from '../services/taskService';
import { useAuth } from './AuthContext';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  createTask: (data: CreateTaskData) => Promise<void>;
  updateTask: (id: string, data: UpdateTaskData) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  assignTask: (id: string, assignedToUserId: string | null) => Promise<void>;
  getTaskById: (id: string) => Task | undefined;
  refreshTasks: () => Promise<void>;
  getMyTasks: () => Promise<void>;
  getMyPendingTasks: () => Promise<void>;
  getMyCompletedTasks: () => Promise<void>;
  getMyHighPriorityTasks: () => Promise<void>;
  getTasksByStatus: (status: number) => Promise<void>;
  getTasksByPriority: (priority: number) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }: TaskProviderProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token, user, isAuthenticated } = useAuth();

  const refreshTasks = useCallback(async () => {
    if (!token || !user) return;

    try {
      setLoading(true);
      setError(null);
      const tasksData = await taskService.getTasks(token);
      setTasks(tasksData);
    } catch (error: any) {
      setError('Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshTasks();
    }
  }, [isAuthenticated, refreshTasks]);

  const createTask = async (data: CreateTaskData) => {
    if (!token || !user) throw new Error('Token não encontrado');

    try {
      setLoading(true);
      setError(null);
      await taskService.createTask({ ...data, userId: user.id }, token);
      await refreshTasks();
    } catch (error: any) {
      setError('Erro ao criar tarefa');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: string, data: UpdateTaskData) => {
    if (!token) throw new Error('Token não encontrado');

    try {
      setLoading(true);
      setError(null);
      await taskService.updateTask(id, data, token);
      const updatedTask = await taskService.getTaskById(id, token);
      setTasks((prevTasks: Task[]) => 
        prevTasks.map((task: Task) => 
          task.id === id ? updatedTask : task
        )
      );
    } catch (error: any) {
      setError('Erro ao atualizar tarefa');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    if (!token) throw new Error('Token não encontrado');

    try {
      setLoading(true);
      setError(null);
      await taskService.deleteTask(id, token);
      setTasks((prevTasks: Task[]) => prevTasks.filter((task: Task) => task.id !== id));
    } catch (error: any) {
      setError('Erro ao deletar tarefa');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const assignTask = async (id: string, assignedToUserId: string | null) => {
    if (!token) throw new Error('Token não encontrado');

    try {
      setLoading(true);
      setError(null);
      await taskService.updateTask(id, { assignedToUserId: assignedToUserId || undefined }, token);
      const updatedTask = await taskService.getTaskById(id, token);
      setTasks((prevTasks: Task[]) => 
        prevTasks.map((task: Task) => 
          task.id === id ? updatedTask : task
        )
      );
    } catch (error: any) {
      setError('Erro ao atribuir tarefa');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getTaskById = (id: string): Task | undefined => {
    return tasks.find((task: Task) => task.id === id);
  };

  const getMyTasks = async () => {
    if (!token || !user) return;

    try {
      setLoading(true);
      setError(null);
      const tasksData = await taskService.getTasks(token, { assignedToUserId: user.id });
      
      const tasksNotAssignedToMe = tasksData.filter(task => 
        task.assignedToUserId !== user.id || 
        !task.assignedToUserId || 
        task.assignedToUserId === null || 
        task.assignedToUserId === undefined
      );
      
      if (tasksNotAssignedToMe.length > 0) {
        const validTasks = tasksData.filter(task => 
          task.assignedToUserId === user.id && 
          task.assignedToUserId !== null &&
          task.assignedToUserId !== undefined
        );
        setTasks(validTasks);
      } else {
        setTasks(tasksData);
      }
    } catch (error: any) {
      setError('Erro ao carregar minhas tarefas');
    } finally {
      setLoading(false);
    }
  };

  const getMyPendingTasks = async () => {
    if (!token || !user) return;

    try {
      setLoading(true);
      setError(null);
      const tasksData = await taskService.getTasks(token, { 
        assignedToUserId: user.id, 
        status: 0 
      });
      
      const invalidTasks = tasksData.filter(task => 
        task.status !== 0 || 
        task.assignedToUserId !== user.id ||
        !task.assignedToUserId ||
        task.assignedToUserId === null ||
        task.assignedToUserId === undefined
      );
      
      if (invalidTasks.length > 0) {
        const validTasks = tasksData.filter(task => 
          task.status === 0 && 
          task.assignedToUserId === user.id &&
          task.assignedToUserId !== null &&
          task.assignedToUserId !== undefined
        );
        setTasks(validTasks);
      } else {
        setTasks(tasksData);
      }
    } catch (error: any) {
      setError('Erro ao carregar tarefas pendentes');
    } finally {
      setLoading(false);
    }
  };

  const getMyCompletedTasks = async () => {
    if (!token || !user) return;

    try {
      setLoading(true);
      setError(null);
      const tasksData = await taskService.getTasks(token, { 
        assignedToUserId: user.id, 
        status: 2 
      });
      
      const invalidTasks = tasksData.filter(task => 
        task.status !== 2 || 
        task.assignedToUserId !== user.id ||
        !task.assignedToUserId ||
        task.assignedToUserId === null ||
        task.assignedToUserId === undefined
      );
      
      if (invalidTasks.length > 0) {
        const validTasks = tasksData.filter(task => 
          task.status === 2 && 
          task.assignedToUserId === user.id &&
          task.assignedToUserId !== null &&
          task.assignedToUserId !== undefined
        );
        setTasks(validTasks);
      } else {
        setTasks(tasksData);
      }
    } catch (error: any) {
      setError('Erro ao carregar tarefas concluídas');
    } finally {
      setLoading(false);
    }
  };

  const getMyHighPriorityTasks = async () => {
    if (!token || !user) return;

    try {
      setLoading(true);
      setError(null);
      const tasksData = await taskService.getTasks(token, { 
        assignedToUserId: user.id, 
        priority: 2 
      });
      
      const invalidTasks = tasksData.filter(task => 
        task.priority !== 2 || 
        task.assignedToUserId !== user.id ||
        !task.assignedToUserId ||
        task.assignedToUserId === null ||
        task.assignedToUserId === undefined
      );
      
      if (invalidTasks.length > 0) {
        const validTasks = tasksData.filter(task => 
          task.priority === 2 && 
          task.assignedToUserId === user.id &&
          task.assignedToUserId !== null &&
          task.assignedToUserId !== undefined
        );
        setTasks(validTasks);
      } else {
        setTasks(tasksData);
      }
    } catch (error: any) {
      setError('Erro ao carregar tarefas de alta prioridade');
    } finally {
      setLoading(false);
    }
  };

  const getTasksByStatus = async (status: number) => {
    if (!token || !user) return;

    try {
      setLoading(true);
      setError(null);
      const tasksData = await taskService.getTasks(token, { 
        assignedToUserId: user.id, 
        status: status 
      });
      
      const invalidTasks = tasksData.filter(task => 
        task.status !== status || 
        task.assignedToUserId !== user.id ||
        !task.assignedToUserId ||
        task.assignedToUserId === null ||
        task.assignedToUserId === undefined
      );
      
      if (invalidTasks.length > 0) {
        const validTasks = tasksData.filter(task => 
          task.status === status && 
          task.assignedToUserId === user.id &&
          task.assignedToUserId !== null &&
          task.assignedToUserId !== undefined
        );
        setTasks(validTasks);
      } else {
        setTasks(tasksData);
      }
    } catch (error: any) {
      setError('Erro ao carregar tarefas por status');
    } finally {
      setLoading(false);
    }
  };

  const getTasksByPriority = async (priority: number) => {
    if (!token || !user) return;

    try {
      setLoading(true);
      setError(null);
      const tasksData = await taskService.getTasks(token, { 
        assignedToUserId: user.id, 
        priority: priority 
      });
      
      const invalidTasks = tasksData.filter(task => 
        task.priority !== priority || 
        task.assignedToUserId !== user.id ||
        !task.assignedToUserId ||
        task.assignedToUserId === null ||
        task.assignedToUserId === undefined
      );
      
      if (invalidTasks.length > 0) {
        const validTasks = tasksData.filter(task => 
          task.priority === priority && 
          task.assignedToUserId === user.id &&
          task.assignedToUserId !== null &&
          task.assignedToUserId !== undefined
        );
        setTasks(validTasks);
      } else {
        setTasks(tasksData);
      }
    } catch (error: any) {
      setError('Erro ao carregar tarefas por prioridade');
    } finally {
      setLoading(false);
    }
  };

  const value: TaskContextType = {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    assignTask,
    getTaskById,
    refreshTasks,
    getMyTasks,
    getMyPendingTasks,
    getMyCompletedTasks,
    getMyHighPriorityTasks,
    getTasksByStatus,
    getTasksByPriority,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks deve ser usado dentro de um TaskProvider');
  }
  return context;
};