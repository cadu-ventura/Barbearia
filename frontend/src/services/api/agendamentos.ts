// APIs relacionadas a agendamentos
import { httpClient } from './client';
import type { Agendamento, ApiResponse } from '../../types';

export class AgendamentosApi {
  /**
   * Busca todos os agendamentos
   */
  async getAll(): Promise<ApiResponse<Agendamento[]>> {
    console.log('🔄 Buscando agendamentos');
    const response = await httpClient.get<Agendamento[]>('/agendamentos');
    if (response.success) {
      console.log('📡 Agendamentos encontrados:', response.data?.length);
    }
    return response;
  }

  /**
   * Busca agendamento por ID
   */
  async getById(id: string): Promise<ApiResponse<Agendamento>> {
    console.log('🔄 Buscando agendamento por ID:', id);
    const response = await httpClient.get<Agendamento>(`/agendamentos/${id}`);
    if (response.success) {
      console.log('📡 Agendamento encontrado:', response.data);
    }
    return response;
  }

  /**
   * Cria novo agendamento
   */
  async create(agendamento: Omit<Agendamento, 'id'>): Promise<ApiResponse<Agendamento>> {
    console.log('🔄 Criando agendamento:', agendamento);
    const response = await httpClient.post<Agendamento>('/agendamentos', agendamento);
    if (response.success) {
      console.log('✅ Agendamento criado com sucesso!');
    }
    return response;
  }

  /**
   * Atualiza agendamento existente
   */
  async update(id: string, agendamento: Partial<Agendamento>): Promise<ApiResponse<Agendamento>> {
    console.log('🔄 Atualizando agendamento:', id, agendamento);
    const response = await httpClient.put<Agendamento>(`/agendamentos/${id}`, agendamento);
    if (response.success) {
      console.log('✅ Agendamento atualizado com sucesso!');
    }
    return response;
  }

  /**
   * Remove agendamento
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    console.log('🗑️ Excluindo agendamento:', id);
    const response = await httpClient.delete<void>(`/agendamentos/${id}`);
    if (response.success) {
      console.log('✅ Agendamento excluído com sucesso!');
    }
    return response;
  }
}

export const agendamentosApi = new AgendamentosApi();