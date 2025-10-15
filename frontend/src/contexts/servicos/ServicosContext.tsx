// =============================================================================
// SERVICOS CONTEXT
// =============================================================================

import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { Servico } from '../../types';
import { api } from '../../services/api';
import type { CrudOperations, LoadingState, ContextProviderProps } from '../shared/types';

// Types específicos do contexto de serviços
export interface ServicosContextData extends CrudOperations<Servico> {
  // Métodos específicos de serviços
  searchByName: (name: string) => Servico[];
  getActiveServicos: () => Servico[];
  getServicosByPreco: (minPreco: number, maxPreco: number) => Servico[];
  getTotalValorServicos: () => number;
  getServicosOrdenadosPorPreco: (ascending?: boolean) => Servico[];
}

// Context
const ServicosContext = createContext<ServicosContextData | undefined>(undefined);

// Provider
const ServicosProvider: React.FC<ContextProviderProps> = ({ children }) => {
  // ==========================================================================
  // STATES
  // ==========================================================================
  
  const [items, setItems] = useState<Servico[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    error: null
  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  /**
   * Converte resposta da API para formato do serviço
   */
  const convertApiToServico = (apiData: any): Servico => {
    return {
      id: String(apiData.id),
      nome: apiData.nome,
      preco: Number(apiData.preco) || 0,
      duracao: Number(apiData.duracao) || 0,
      ativo: apiData.ativo ?? true
    };
  };

  /**
   * Atualiza loading state
   */
  const updateLoading = (state: boolean, error?: string | null) => {
    setLoading({
      isLoading: state,
      error: error || null
    });
  };

  // ==========================================================================
  // CRUD OPERATIONS
  // ==========================================================================

  /**
   * Lista todos os serviços
   */
  const list = useCallback(async () => {
    updateLoading(true);
    try {
      const response = await api.getServicos();
      
      if (response.success && response.data) {
        const servicos = response.data.map(convertApiToServico);
        setItems(servicos);
      } else {
        setItems([]);
      }
      
      updateLoading(false);
    } catch (error) {
      console.error('Erro ao listar serviços:', error);
      updateLoading(false, 'Erro ao carregar serviços');
      setItems([]);
    }
  }, []);

  /**
   * Cria novo serviço
   */
  const create = useCallback(async (data: Omit<Servico, 'id'>) => {
    updateLoading(true);
    try {
      const response = await api.createServico(data);
      
      if (response.success && response.data) {
        const novoServico = convertApiToServico(response.data);
        setItems(prev => [...prev, novoServico]);
        updateLoading(false);
      }
      
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      updateLoading(false, 'Erro ao criar serviço');
      throw error;
    }
  }, []);

  /**
   * Atualiza serviço existente
   */
  const update = useCallback(async (id: string, data: Partial<Servico>) => {
    updateLoading(true);
    try {
      const response = await api.updateServico(id, data);
      
      if (response.success && response.data) {
        const servicoAtualizado = convertApiToServico(response.data);
        setItems(prev => prev.map(item => 
          item.id === id ? servicoAtualizado : item
        ));
        updateLoading(false);
      }
      
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      updateLoading(false, 'Erro ao atualizar serviço');
      throw error;
    }
  }, []);

  /**
   * Remove serviço
   */
  const remove = useCallback(async (id: string) => {
    updateLoading(true);
    try {
      await api.deleteServico(id);
      setItems(prev => prev.filter(item => item.id !== id));
      updateLoading(false);
    } catch (error) {
      console.error('Erro ao remover serviço:', error);
      updateLoading(false, 'Erro ao remover serviço');
      throw error;
    }
  }, []);

  /**
   * Atualiza a lista de serviços
   */
  const refresh = useCallback(async () => {
    await list();
  }, [list]);

  /**
   * Busca serviço por ID
   */
  const findById = useCallback((id: string): Servico | undefined => {
    return items.find(item => item.id === id);
  }, [items]);

  // ==========================================================================
  // BUSINESS METHODS
  // ==========================================================================

  /**
   * Busca serviços por nome
   */
  const searchByName = useCallback((name: string): Servico[] => {
    if (!name.trim()) return items;
    
    const searchTerm = name.toLowerCase().trim();
    return items.filter(item => 
      item.nome.toLowerCase().includes(searchTerm)
    );
  }, [items]);

  /**
   * Retorna apenas serviços ativos
   */
  const getActiveServicos = useCallback((): Servico[] => {
    return items.filter(item => item.ativo);
  }, [items]);

  /**
   * Busca serviços por faixa de preço
   */
  const getServicosByPreco = useCallback((minPreco: number, maxPreco: number): Servico[] => {
    return items.filter(item => 
      item.preco >= minPreco && item.preco <= maxPreco
    );
  }, [items]);

  /**
   * Calcula valor total de todos os serviços ativos
   */
  const getTotalValorServicos = useCallback((): number => {
    return items
      .filter(item => item.ativo)
      .reduce((total, item) => total + item.preco, 0);
  }, [items]);

  /**
   * Retorna serviços ordenados por preço
   */
  const getServicosOrdenadosPorPreco = useCallback((ascending: boolean = true): Servico[] => {
    return [...items].sort((a, b) => 
      ascending ? a.preco - b.preco : b.preco - a.preco
    );
  }, [items]);

  // ==========================================================================
  // EFFECTS
  // ==========================================================================

  // Carrega dados na inicialização
  useEffect(() => {
    list();
  }, [list]);

  // ==========================================================================
  // CONTEXT VALUE
  // ==========================================================================

  const contextValue: ServicosContextData = {
    // Estado
    items,
    loading,
    
    // CRUD Operations
    create,
    update,
    remove,
    refresh,
    findById,
    
    // Business Methods
    searchByName,
    getActiveServicos,
    getServicosByPreco,
    getTotalValorServicos,
    getServicosOrdenadosPorPreco
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <ServicosContext.Provider value={contextValue}>
      {children}
    </ServicosContext.Provider>
  );
};

export default ServicosProvider;
export { ServicosContext };