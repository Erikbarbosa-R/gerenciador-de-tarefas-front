export interface User {
  id: string;
  name: string;
  email: string;
  role: number; // 0 = USER, 1 = ADMIN
  isActive: boolean;
  createdAt: string;
  isDeleted: boolean;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    status: number; // 0 = PENDING, 1 = IN_PROGRESS, 2 = COMPLETED, 3 = CANCELLED
    priority: number; // 0 = LOW, 1 = MEDIUM, 2 = HIGH, 3 = CRITICAL
    dueDate?: string;
    userId: string;
    assignedToUserId?: string | null;
    createdAt: string;
    updatedAt?: string;
    isDeleted: boolean;
}

export interface CreateTaskData {
  title: string;
  description: string;
  userId: string;
  priority?: number; // 0 = LOW, 1 = MEDIUM, 2 = HIGH, 3 = CRITICAL
  dueDate?: string;
  assignedToUserId?: string | null;
}

export interface UpdateTaskData {
    title?: string;
    description?: string;
    status?: number; // 0 = PENDING, 1 = IN_PROGRESS, 2 = COMPLETED, 3 = CANCELLED
    priority?: number; // 0 = LOW, 1 = MEDIUM, 2 = HIGH, 3 = CRITICAL
    dueDate?: string;
    assignedToUserId?: string | null;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  email: string;
  name: string;
  token: string;
  userId: string;
}

export interface ApiError {
  message: string;
  status: number;
}

// Enum constantes para facilitar uso
export const TaskPriority = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
  CRITICAL: 3
} as const;

export const TaskStatus = {
  PENDING: 0,
  IN_PROGRESS: 1,
  COMPLETED: 2,
  CANCELLED: 3
} as const;

export const UserRole = {
  USER: 0,
  ADMIN: 1
} as const;
