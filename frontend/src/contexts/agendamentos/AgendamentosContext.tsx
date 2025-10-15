// =============================================================================
// AGENDAMENTOS CONTEXT
// =============================================================================

import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { Agendamento } from '../../types';
import { api } from '../../services/api';
import type { CrudOperations, LoadingState, ContextProviderProps } from '../shared/types';

// Types específicos do contexto de agendamentos
export interface AgendamentosContextData extends CrudOperations<Agendamento> {
  // Métodos específicos de agendamentos
  getAgendamentosByDate: (date: string) => Agendamento[];
  getAgendamentosByBarbeiro: (barbeiroId: string) => Agendamento[];
  getAgendamentosByCliente: (clienteId: string) => Agendamento[];
  getAgendamentosByStatus: (status: Agendamento['status']) => Agendamento[];
  getAgendamentosHoje: () => Agendamento[];
  getAgendamentosMes: (year: number, month: number) => Agendamento[];
  getTotalReceitaAgendamentos: (filtro?: Partial<Agendamento>) => number;
  getProximosAgendamentos: (limit?: number) => Agendamento[];
  updateStatus: (id: string, status: Agendamento['status']) => Promise<void>;
}

// Context
const AgendamentosContext = createContext<AgendamentosContextData | undefined>(undefined);

// Provider
const AgendamentosProvider: React.FC<ContextProviderProps> = ({ children }) => {
  // ==========================================================================
  // STATES
  // ==========================================================================
  
  const [items, setItems] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    error: null
  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  /**
   * Converte resposta da API para formato do agendamento
   */
  const convertApiToAgendamento = (apiData: any): Agendamento => {
    return {
      id: String(apiData.id),
      clienteId: String(apiData.cliente_id || apiData.clienteId),
      barbeiroId: String(apiData.barbeiro_id || apiData.barbeiroId),
      servicoIds: apiData.servico_ids || apiData.servicoIds || [String(apiData.servico_id || apiData.servicoId)],
      dataHora: apiData.data_hora || apiData.dataHora,
      status: apiData.status || 'agendado',
      observacoes: apiData.observacoes,
      valorTotal: Number(apiData.valor_total || apiData.valorTotal) || 0,
      formaPagamento: apiData.forma_pagamento || apiData.formaPagamento
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
   * Lista todos os agendamentos
   */
  const list = useCallback(async () => {
    updateLoading(true);
    try {
      const response = await api.getAgendamentos();
      
      if (response.success && response.data) {
        const agendamentos = response.data.map(convertApiToAgendamento);
        setItems(agendamentos);
      } else {
        setItems([]);
      }
      
      updateLoading(false);
    } catch (error) {
      console.error('Erro ao listar agendamentos:', error);
      updateLoading(false, 'Erro ao carregar agendamentos');
      setItems([]);
    }
  }, []);

  /**
   * Cria novo agendamento
   */
  const create = useCallback(async (data: Omit<Agendamento, 'id'>) => {
    updateLoading(true);
    try {
      const payload = {
        ...data,
        cliente_id: data.clienteId,
        barbeiro_id: data.barbeiroId,
        servico_id: data.servicoIds?.[0] || '',
        data_hora: data.dataHora,
        valor_total: data.valorTotal,
        forma_pagamento: data.formaPagamento
      };

      const response = await api.createAgendamento(payload);
      
      if (response.success && response.data) {
        const novoAgendamento = convertApiToAgendamento(response.data);
        setItems(prev => [...prev, novoAgendamento]);
        updateLoading(false);
      }
      
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      updateLoading(false, 'Erro ao criar agendamento');
      throw error;
    }
  }, []);

  /**
   * Atualiza agendamento existente
   */
  const update = useCallback(async (id: string, data: Partial<Agendamento>) => {
    updateLoading(true);
    try {
      const payload = {
        ...data,
        cliente_id: data.clienteId,
        barbeiro_id: data.barbeiroId,
        servico_id: data.servicoIds?.[0] || '',
        data_hora: data.dataHora,
        valor_total: data.valorTotal,
        forma_pagamento: data.formaPagamento
      };

      const response = await api.updateAgendamento(id, payload);
      
      if (response.success && response.data) {
        const agendamentoAtualizado = convertApiToAgendamento(response.data);
        setItems(prev => prev.map(item => 
          item.id === id ? agendamentoAtualizado : item
        ));
        updateLoading(false);
      }
      
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      updateLoading(false, 'Erro ao atualizar agendamento');
      throw error;
    }
  }, []);

  /**
   * Remove agendamento
   */
  const remove = useCallback(async (id: string) => {
    updateLoading(true);
    try {
      await api.deleteAgendamento(id);
      setItems(prev => prev.filter(item => item.id !== id));
      updateLoading(false);
    } catch (error) {
      console.error('Erro ao remover agendamento:', error);
      updateLoading(false, 'Erro ao remover agendamento');
      throw error;
    }
  }, []);

  /**
   * Atualiza a lista de agendamentos
   */
  const refresh = useCallback(async () => {
    await list();
  }, [list]);

  /**
   * Busca agendamento por ID
   */
  const findById = useCallback((id: string): Agendamento | undefined => {
    return items.find(item => item.id === id);
  }, [items]);

  // ==========================================================================
  // BUSINESS METHODS
  // ==========================================================================

  /**
   * Busca agendamentos por data
   */
  const getAgendamentosByDate = useCallback((date: string): Agendamento[] => {
    const targetDate = new Date(date).toDateString();
    return items.filter(item => {
      const agendamentoDate = new Date(item.dataHora).toDateString();
      return agendamentoDate === targetDate;
    });
  }, [items]);

  /**
   * Busca agendamentos por barbeiro
   */
  const getAgendamentosByBarbeiro = useCallback((barbeiroId: string): Agendamento[] => {
    return items.filter(item => item.barbeiroId === barbeiroId);
  }, [items]);

  /**
   * Busca agendamentos por cliente
   */
  const getAgendamentosByCliente = useCallback((clienteId: string): Agendamento[] => {
    return items.filter(item => item.clienteId === clienteId);
  }, [items]);

  /**
   * Busca agendamentos por status
   */
  const getAgendamentosByStatus = useCallback((status: Agendamento['status']): Agendamento[] => {
    return items.filter(item => item.status === status);
  }, [items]);

  /**
   * Retorna agendamentos de hoje
   */
  const getAgendamentosHoje = useCallback((): Agendamento[] => {
    const hoje = new Date().toDateString();
    return items.filter(item => {
      const agendamentoDate = new Date(item.dataHora).toDateString();
      return agendamentoDate === hoje;
    });
  }, [items]);

  /**
   * Retorna agendamentos de um mês específico
   */
  const getAgendamentosMes = useCallback((year: number, month: number): Agendamento[] => {
    return items.filter(item => {
      const agendamentoDate = new Date(item.dataHora);
      return agendamentoDate.getFullYear() === year && agendamentoDate.getMonth() === month;
    });
  }, [items]);

  /**
   * Calcula receita total dos agendamentos
   */
  const getTotalReceitaAgendamentos = useCallback((filtro?: Partial<Agendamento>): number => {
    let agendamentosFiltrados = items;

    if (filtro) {
      agendamentosFiltrados = items.filter(item => {
        return Object.entries(filtro).every(([key, value]) => {
          return item[key as keyof Agendamento] === value;
        });
      });
    }

    return agendamentosFiltrados
      .filter(item => item.status === 'concluido')
      .reduce((total, item) => total + (item.valorTotal || 0), 0);
  }, [items]);

  /**
   * Retorna próximos agendamentos ordenados por data
   */
  const getProximosAgendamentos = useCallback((limit: number = 10): Agendamento[] => {
    const agora = new Date();
    return items
      .filter(item => new Date(item.dataHora) > agora && item.status !== 'cancelado')
      .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime())
      .slice(0, limit);
  }, [items]);

  /**
   * Atualiza apenas o status de um agendamento
   */
  const updateStatus = useCallback(async (id: string, status: Agendamento['status']) => {
    updateLoading(true);
    try {
      const response = await api.updateAgendamento(id, { status });
      
      if (response.success && response.data) {
        const agendamentoAtualizado = convertApiToAgendamento(response.data);
        setItems(prev => prev.map(item => 
          item.id === id ? agendamentoAtualizado : item
        ));
        updateLoading(false);
      }
      
    } catch (error) {
      console.error('Erro ao atualizar status do agendamento:', error);
      updateLoading(false, 'Erro ao atualizar status do agendamento');
      throw error;
    }
  }, []);

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

  const contextValue: AgendamentosContextData = {
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
    getAgendamentosByDate,
    getAgendamentosByBarbeiro,
    getAgendamentosByCliente,
    getAgendamentosByStatus,
    getAgendamentosHoje,
    getAgendamentosMes,
    getTotalReceitaAgendamentos,
    getProximosAgendamentos,
    updateStatus
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <AgendamentosContext.Provider value={contextValue}>
      {children}
    </AgendamentosContext.Provider>
  );
};

export default AgendamentosProvider;
export { AgendamentosContext };