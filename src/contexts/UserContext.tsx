import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import { useAuth } from './AuthContext';

interface UserContextType {
  users: User[];
  loading: boolean;
  error: string | null;
  refreshUsers: () => Promise<void>;
  getUserById: (id: string) => Promise<User>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token, isAuthenticated } = useAuth();

  const refreshUsers = useCallback(async () => {
    if (!token || !isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);
      const usersData = await authService.getUsers(token);
      setUsers(usersData);
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao carregar usuários do backend';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token, isAuthenticated]);

  const getUserById = useCallback(async (id: string): Promise<User> => {
    if (!token) throw new Error('Token não encontrado');
    
    try {
      const user = await authService.getUserById(id, token);
      return user;
    } catch (error: any) {
      throw error;
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated && token) {
      refreshUsers();
    } else {
      setUsers([]);
    }
  }, [isAuthenticated, token, refreshUsers]);

  const value: UserContextType = {
    users,
    loading,
    error,
    refreshUsers,
    getUserById,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers deve ser usado dentro de um UserProvider');
  }
  return context;
};