// =============================================================================
// SHARED TYPES FOR CONTEXTS
// =============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface BaseEntity {
  id: string;
  dataCadastro?: Date;
  dataAtualizacao?: Date;
  ativo?: boolean;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface CrudOperations<T, TInput = Omit<T, 'id'>> {
  // READ
  items: T[];
  loading: LoadingState;
  
  // CREATE
  create: (data: TInput) => Promise<void>;
  
  // UPDATE
  update: (id: string, data: Partial<T>) => Promise<void>;
  
  // DELETE
  remove: (id: string) => Promise<void>;
  
  // UTILITY
  refresh: () => Promise<void>;
  findById: (id: string) => T | undefined;
}

export type ContextProviderProps = {
  children: React.ReactNode;
};