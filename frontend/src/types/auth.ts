/**
 * Authentication-related type definitions.
 * 
 * Defines interfaces for user data, authentication requests,
 * and JWT token responses used throughout the application.
 */

export enum UserRole {
    ANONYMOUS = 'anonymous',
    REGISTERED = 'registered'
  }
  
  export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
    role: UserRole;
    is_active: boolean;
    created_at: string;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterData {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }
  
  export interface AuthResponse {
    access_token: string;
    user: User;
    expires_in: number;
  }
  
  export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
  }