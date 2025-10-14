import { Request } from 'express';

export type UserRole = 'admin' | 'funcionario' | 'barbeiro';

export interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  ativo: boolean;
  dataCadastro: Date;
}

export interface UserInput {
  nome: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UserDB {
  id: number;
  nome: string;
  email: string;
  password_hash: string;
  role: UserRole;
  ativo: number;
  created_at: string;
  updated_at?: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    nome: string;
    email: string;
    role: UserRole;
  };
  message?: string;
}