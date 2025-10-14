import { Request, Response } from 'express';
import { Database } from 'sqlite3';

export interface DatabaseRequest extends Request {
  db: {
    all: (sql: string, params?: any[]) => Promise<any[]>;
    get: (sql: string, params?: any[]) => Promise<any>;
    run: (sql: string, params?: any[]) => Promise<{ lastID?: number; changes: number }>;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DateRangeQuery {
  data_inicio?: string;
  data_fim?: string;
}

export interface StatusQuery {
  status?: string;
  ativo?: string;
}

// Re-exports
export * from './Cliente';
export * from './Barbeiro';
export * from './Servico';
export * from './Agendamento';
export * from './Financeiro';
export * from './Auth';