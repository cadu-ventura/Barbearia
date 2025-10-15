// =============================================================================
// CLIENTES CONTEXT
// =============================================================================

import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { Cliente } from '../../types';
import { api } from '../../services/api';
import type { CrudOperations, LoadingState, ContextProviderProps } from '../shared/types';

// Types específicos do contexto de clientes
export interface ClientesContextData extends CrudOperations<Cliente> {
  // Métodos específicos de clientes
  searchByName: (name: string) => Cliente[];
  getActiveClientes: () => Cliente[];
  getTotalAtendimentos: () => number;
}

// Context
const ClientesContext = createContext<ClientesContextData | undefined>(undefined);

// Provider
export const ClientesProvider: React.FC<ContextProviderProps> = ({ children }) => {
  // =============================================================================
  // STATE
  // =============================================================================
  const [items, setItems] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: true,
    error: null
  });

  // =============================================================================
  // UTILS
  // =============================================================================
  const setLoadingState = useCallback((isLoading: boolean, error: string | null = null) => {
    setLoading({ isLoading, error });
  }, []);

  const convertApiToCliente = useCallback((apiData: any): Cliente => ({
    id: apiData.id?.toString() || '',
    nome: apiData.nome || '',
    telefone: apiData.telefone || '',
    email: apiData.email || '',
    dataNascimento: apiData.data_nascimento || apiData.dataNascimento,
    observacoes: apiData.observacoes || '',
    ativo: apiData.ativo !== false,
    dataCadastro: apiData.created_at ? new Date(apiData.created_at) : new Date(),
    totalAtendimentos: apiData.totalAtendimentos || 0,
    ultimoAtendimento: apiData.ultimoAtendimento ? new Date(apiData.ultimoAtendimento) : undefined
  }), []);

  // =============================================================================
  // API OPERATIONS
  // =============================================================================
  
  const refresh = useCallback(async (): Promise<void> => {
    try {
      setLoadingState(true);
      console.log('🔄 Carregando clientes...');
      
      const response = await api.getClientes();
      
      if (response.success && response.data) {
        const clientesConvertidos = response.data.map(convertApiToCliente);
        setItems(clientesConvertidos);
        console.log('✅ Clientes carregados:', clientesConvertidos.length);
        setLoadingState(false);
      } else {
        throw new Error(response.error || 'Erro ao carregar clientes');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar clientes:', error);
      setLoadingState(false, error instanceof Error ? error.message : 'Erro desconhecido');
      setItems([]);
    }
  }, [convertApiToCliente, setLoadingState]);

  const create = useCallback(async (clienteData: Omit<Cliente, 'id'>): Promise<void> => {
    try {
      setLoadingState(true);
      console.log('🔄 Criando cliente:', clienteData);
      
      const response = await api.createCliente(clienteData);
      
      if (response.success && response.data) {
        // Recarregar lista para garantir consistência
        await refresh();
        console.log('✅ Cliente criado com sucesso!');
      } else {
        throw new Error(response.error || 'Erro ao criar cliente');
      }
    } catch (error) {
      console.error('❌ Erro ao criar cliente:', error);
      setLoadingState(false, error instanceof Error ? error.message : 'Erro ao criar cliente');
      throw error;
    }
  }, [refresh, setLoadingState]);

  const update = useCallback(async (id: string, dadosAtualizados: Partial<Cliente>): Promise<void> => {
    try {
      setLoadingState(true);
      console.log('🔄 Atualizando cliente:', id, dadosAtualizados);
      
      const response = await api.updateCliente(id, dadosAtualizados);
      
      if (response.success) {
        // Atualizar localmente
        setItems(prev => 
          prev.map(cliente => 
            cliente.id === id 
              ? { ...cliente, ...dadosAtualizados, dataAtualizacao: new Date() }
              : cliente
          )
        );
        console.log('✅ Cliente atualizado com sucesso!');
        setLoadingState(false);
      } else {
        throw new Error(response.error || 'Erro ao atualizar cliente');
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar cliente:', error);
      setLoadingState(false, error instanceof Error ? error.message : 'Erro ao atualizar cliente');
      throw error;
    }
  }, [setLoadingState]);

  const remove = useCallback(async (id: string): Promise<void> => {
    try {
      setLoadingState(true);
      console.log('🗑️ Removendo cliente:', id);
      
      const response = await api.deleteCliente(id);
      
      if (response.success) {
        // Remover localmente
        setItems(prev => prev.filter(cliente => cliente.id !== id));
        console.log('✅ Cliente removido com sucesso!');
        setLoadingState(false);
      } else {
        throw new Error(response.error || 'Erro ao remover cliente');
      }
    } catch (error) {
      console.error('❌ Erro ao remover cliente:', error);
      setLoadingState(false, error instanceof Error ? error.message : 'Erro ao remover cliente');
      throw error;
    }
  }, [setLoadingState]);

  // =============================================================================
  // BUSINESS LOGIC
  // =============================================================================
  
  const findById = useCallback((id: string): Cliente | undefined => {
    return items.find(cliente => cliente.id === id);
  }, [items]);

  const searchByName = useCallback((name: string): Cliente[] => {
    if (!name.trim()) return items;
    
    const searchTerm = name.toLowerCase();
    return items.filter(cliente =>
      cliente.nome.toLowerCase().includes(searchTerm) ||
      (cliente.email && cliente.email.toLowerCase().includes(searchTerm)) ||
      cliente.telefone.includes(searchTerm)
    );
  }, [items]);

  const getActiveClientes = useCallback((): Cliente[] => {
    return items.filter(cliente => cliente.ativo !== false);
  }, [items]);

  const getTotalAtendimentos = useCallback((): number => {
    return items.reduce((total, cliente) => total + (cliente.totalAtendimentos || 0), 0);
  }, [items]);

  // =============================================================================
  // EFFECTS
  // =============================================================================
  
  useEffect(() => {
    refresh();
  }, [refresh]);

  // =============================================================================
  // CONTEXT VALUE
  // =============================================================================
  
  const contextValue: ClientesContextData = {
    // CRUD Operations
    items,
    loading,
    create,
    update,
    remove,
    refresh,
    findById,
    
    // Business Logic
    searchByName,
    getActiveClientes,
    getTotalAtendimentos,
  };

  return (
    <ClientesContext.Provider value={contextValue}>
      {children}
    </ClientesContext.Provider>
  );
};

export default ClientesProvider;
export { ClientesContext };