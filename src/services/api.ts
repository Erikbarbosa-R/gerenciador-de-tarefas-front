import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiError } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://gerenciador-de-tarefas-production-7bba.up.railway.app/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        // Não redirecionar automaticamente se estiver na página de login
        if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        
        const apiError: ApiError = {
          message: error.response?.data?.message || 'Erro interno do servidor',
          status: error.response?.status || 500,
        };
        
        return Promise.reject(apiError);
      }
    );
  }

  async get<T>(url: string, token?: string): Promise<T> {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await this.api.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, token?: string): Promise<T> {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await this.api.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, token?: string): Promise<T> {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await this.api.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, token?: string): Promise<T> {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await this.api.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, token?: string): Promise<T> {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await this.api.delete<T>(url, config);
    return response.data;
  }
}

export const apiService = new ApiService();

export const testBackendConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return response.ok;
  } catch (error) {
    return false;
  }
};