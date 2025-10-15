// =============================================================================
// BARBEIROS CONTEXT
// =============================================================================

import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { Barbeiro } from '../../types';
import { api } from '../../services/api';
import type { CrudOperations, LoadingState, ContextProviderProps } from '../shared/types';

// Types específicos do contexto de barbeiros
export interface BarbeirosContextData extends CrudOperations<Barbeiro> {
  // Métodos específicos de barbeiros
  searchByName: (name: string) => Barbeiro[];
  getActiveBarbeiros: () => Barbeiro[];
  getBarbeirosByEspecialidade: (especialidade: string) => Barbeiro[];
  getAllEspecialidades: () => string[];
}

// Context
const BarbeirosContext = createContext<BarbeirosContextData | undefined>(undefined);

// Provider
const BarbeirosProvider: React.FC<ContextProviderProps> = ({ children }) => {
  // ==========================================================================
  // STATES
  // ==========================================================================
  
  const [items, setItems] = useState<Barbeiro[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    error: null
  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  /**
   * Converte resposta da API para formato do barbeiro
   */
  const convertApiToBarbeiro = (apiData: any): Barbeiro => {
    return {
      id: String(apiData.id),
      nome: apiData.nome,
      telefone: apiData.telefone,
      email: apiData.email,
      especialidades: Array.isArray(apiData.especialidades) 
        ? apiData.especialidades 
        : (typeof apiData.especialidades === 'string' 
            ? apiData.especialidades.split(', ').filter(Boolean)
            : []
          ),
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
   * Lista todos os barbeiros
   */
  const list = useCallback(async () => {
    updateLoading(true);
    try {
      const response = await api.getBarbeiros();
      
      if (response.success && response.data) {
        const barbeiros = response.data.map(convertApiToBarbeiro);
        setItems(barbeiros);
      } else {
        setItems([]);
      }
      
      updateLoading(false);
    } catch (error) {
      console.error('Erro ao listar barbeiros:', error);
      updateLoading(false, 'Erro ao carregar barbeiros');
      setItems([]);
    }
  }, []);

  /**
   * Cria novo barbeiro
   */
  const create = useCallback(async (data: Omit<Barbeiro, 'id'>) => {
    updateLoading(true);
    try {
      const payload = {
        ...data,
        especialidades: Array.isArray(data.especialidades) 
          ? data.especialidades.join(', ')
          : data.especialidades
      };

      const response = await api.createBarbeiro(payload);
      
      if (response.success && response.data) {
        const novoBarbeiro = convertApiToBarbeiro(response.data);
        setItems(prev => [...prev, novoBarbeiro]);
        updateLoading(false);
      }
      
    } catch (error) {
      console.error('Erro ao criar barbeiro:', error);
      updateLoading(false, 'Erro ao criar barbeiro');
      throw error;
    }
  }, []);

  /**
   * Atualiza barbeiro existente
   */
  const update = useCallback(async (id: string, data: Partial<Barbeiro>) => {
    updateLoading(true);
    try {
      const payload = {
        ...data,
        especialidades: data.especialidades && Array.isArray(data.especialidades) 
          ? data.especialidades.join(', ')
          : data.especialidades
      };

      const response = await api.updateBarbeiro(id, payload);
      
      if (response.success && response.data) {
        const barbeiroAtualizado = convertApiToBarbeiro(response.data);
        setItems(prev => prev.map(item => 
          item.id === id ? barbeiroAtualizado : item
        ));
        updateLoading(false);
      }
      
    } catch (error) {
      console.error('Erro ao atualizar barbeiro:', error);
      updateLoading(false, 'Erro ao atualizar barbeiro');
      throw error;
    }
  }, []);

  /**
   * Remove barbeiro
   */
  const remove = useCallback(async (id: string) => {
    updateLoading(true);
    try {
      await api.deleteBarbeiro(id);
      setItems(prev => prev.filter(item => item.id !== id));
      updateLoading(false);
    } catch (error) {
      console.error('Erro ao remover barbeiro:', error);
      updateLoading(false, 'Erro ao remover barbeiro');
      throw error;
    }
  }, []);

  /**
   * Atualiza a lista de barbeiros
   */
  const refresh = useCallback(async () => {
    await list();
  }, [list]);

  /**
   * Busca barbeiro por ID
   */
  const findById = useCallback((id: string): Barbeiro | undefined => {
    return items.find(item => item.id === id);
  }, [items]);

  // ==========================================================================
  // BUSINESS METHODS
  // ==========================================================================

  /**
   * Busca barbeiros por nome
   */
  const searchByName = useCallback((name: string): Barbeiro[] => {
    if (!name.trim()) return items;
    
    const searchTerm = name.toLowerCase().trim();
    return items.filter(item => 
      item.nome.toLowerCase().includes(searchTerm)
    );
  }, [items]);

  /**
   * Retorna apenas barbeiros ativos
   */
  const getActiveBarbeiros = useCallback((): Barbeiro[] => {
    return items.filter(item => item.ativo);
  }, [items]);

  /**
   * Busca barbeiros por especialidade
   */
  const getBarbeirosByEspecialidade = useCallback((especialidade: string): Barbeiro[] => {
    if (!especialidade.trim()) return items;
    
    const especialidadeTerm = especialidade.toLowerCase().trim();
    return items.filter(item => 
      item.especialidades.some(esp => 
        esp.toLowerCase().includes(especialidadeTerm)
      )
    );
  }, [items]);

  /**
   * Retorna todas as especialidades únicas
   */
  const getAllEspecialidades = useCallback((): string[] => {
    const todasEspecialidades = items.flatMap(item => item.especialidades);
    return [...new Set(todasEspecialidades)].sort();
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

  const contextValue: BarbeirosContextData = {
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
    getActiveBarbeiros,
    getBarbeirosByEspecialidade,
    getAllEspecialidades
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <BarbeirosContext.Provider value={contextValue}>
      {children}
    </BarbeirosContext.Provider>
  );
};

export default BarbeirosProvider;
export { BarbeirosContext };