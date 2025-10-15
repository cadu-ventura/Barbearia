// APIs relacionadas ao financeiro
import { httpClient } from './client';
import type { MovimentacaoFinanceira, ApiResponse } from '../../types';

export class FinanceiroApi {
  /**
   * Busca todas as movimentações financeiras
   */
  async getAll(): Promise<ApiResponse<MovimentacaoFinanceira[]>> {
    console.log('🔄 Buscando movimentações financeiras');
    const response = await httpClient.get<MovimentacaoFinanceira[]>('/financeiro');
    if (response.success) {
      console.log('📡 Movimentações encontradas:', response.data?.length);
    }
    return response;
  }

  /**
   * Busca movimentação por ID
   */
  async getById(id: string): Promise<ApiResponse<MovimentacaoFinanceira>> {
    console.log('🔄 Buscando movimentação por ID:', id);
    const response = await httpClient.get<MovimentacaoFinanceira>(`/financeiro/${id}`);
    if (response.success) {
      console.log('📡 Movimentação encontrada:', response.data);
    }
    return response;
  }

  /**
   * Cria nova movimentação financeira
   */
  async create(movimentacao: Omit<MovimentacaoFinanceira, 'id'>): Promise<ApiResponse<MovimentacaoFinanceira>> {
    console.log('🔄 Criando movimentação financeira:', movimentacao);
    const response = await httpClient.post<MovimentacaoFinanceira>('/financeiro', movimentacao);
    if (response.success) {
      console.log('✅ Movimentação criada com sucesso!');
    }
    return response;
  }

  /**
   * Atualiza movimentação existente
   */
  async update(id: string, movimentacao: Partial<MovimentacaoFinanceira>): Promise<ApiResponse<MovimentacaoFinanceira>> {
    console.log('🔄 Atualizando movimentação:', id, movimentacao);
    const response = await httpClient.put<MovimentacaoFinanceira>(`/financeiro/${id}`, movimentacao);
    if (response.success) {
      console.log('✅ Movimentação atualizada com sucesso!');
    }
    return response;
  }

  /**
   * Remove movimentação
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    console.log('🗑️ Excluindo movimentação:', id);
    const response = await httpClient.delete<void>(`/financeiro/${id}`);
    if (response.success) {
      console.log('✅ Movimentação excluída com sucesso!');
    }
    return response;
  }

  /**
   * Busca relatório financeiro
   */
  async getRelatorio(params?: {
    dataInicio?: string;
    dataFim?: string;
    barbeiroId?: string;
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params?.dataInicio) queryParams.append('dataInicio', params.dataInicio);
    if (params?.dataFim) queryParams.append('dataFim', params.dataFim);
    if (params?.barbeiroId) queryParams.append('barbeiroId', params.barbeiroId);
    
    const endpoint = `/relatorios/financeiro${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    console.log('🔄 Buscando relatório financeiro:', endpoint);
    
    const response = await httpClient.get<any>(endpoint);
    if (response.success) {
      console.log('📡 Relatório financeiro obtido');
    }
    return response;
  }
}

export const financeiroApi = new FinanceiroApi();