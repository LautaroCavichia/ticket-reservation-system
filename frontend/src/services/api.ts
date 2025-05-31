// frontend/src/services/api.ts
/**
 * Base API service configuration.
 * 
 * Provides axios configuration, request/response interceptors,
 * and common error handling for all API communications.
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5500/api';

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor for adding auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          // Ensure proper Bearer token format
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Debug logging for development
        if (process.env.NODE_ENV === 'development') {
          console.log('API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            hasAuth: !!token,
            token: token ? `${token.substring(0, 20)}...` : 'none'
          });
        }
        
        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Debug logging for development
        if (process.env.NODE_ENV === 'development') {
          console.log('API Response:', {
            status: response.status,
            url: response.config.url,
            method: response.config.method?.toUpperCase()
          });
        }
        return response;
      },
      (error) => {
        console.error('API Error:', {
          status: error.response?.status,
          message: error.response?.data?.error || error.message,
          url: error.config?.url,
          method: error.config?.method?.toUpperCase()
        });

        const apiError: ApiError = {
          message: error.response?.data?.error || error.message || 'An error occurred',
          errors: error.response?.data?.errors,
          status: error.response?.status || 0,
        };

        // Handle different HTTP status codes
        switch (apiError.status) {
          case 401:
            // Token expired or invalid - clear storage and redirect
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            
            // Only redirect if not already on login page
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
            break;
            
          case 403:
            // Forbidden - user doesn't have permission
            apiError.message = 'You do not have permission to perform this action';
            break;
            
          case 422:
            // JWT validation error - treat as unauthorized
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            apiError.message = 'Authentication failed. Please log in again.';
            apiError.status = 401;
            
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
            break;
            
          case 0:
            // Network error
            apiError.message = 'Network error. Please check your connection.';
            break;
        }

        return Promise.reject(apiError);
      }
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  // Utility method to check token validity
  public hasValidToken(): boolean {
    const token = localStorage.getItem('access_token');
    if (!token) return false;

    try {
      // Basic JWT structure validation (header.payload.signature)
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      // Decode payload to check expiration
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  // Method to refresh authentication state
  public clearAuth(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }
}

export const apiService = new ApiService();