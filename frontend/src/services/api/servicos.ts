// APIs relacionadas a serviços
import { httpClient } from './client';
import type { Servico, ApiResponse } from '../../types';

export class ServicosApi {
  /**
   * Busca todos os serviços
   */
  async getAll(): Promise<ApiResponse<Servico[]>> {
    console.log('🔄 Buscando serviços');
    const response = await httpClient.get<Servico[]>('/servicos');
    if (response.success) {
      console.log('📡 Serviços encontrados:', response.data?.length);
    }
    return response;
  }

  /**
   * Busca serviço por ID
   */
  async getById(id: string): Promise<ApiResponse<Servico>> {
    console.log('🔄 Buscando serviço por ID:', id);
    const response = await httpClient.get<Servico>(`/servicos/${id}`);
    if (response.success) {
      console.log('📡 Serviço encontrado:', response.data);
    }
    return response;
  }

  /**
   * Cria novo serviço
   */
  async create(servico: Omit<Servico, 'id'>): Promise<ApiResponse<Servico>> {
    console.log('🔄 Criando serviço:', servico);
    const response = await httpClient.post<Servico>('/servicos', servico);
    if (response.success) {
      console.log('✅ Serviço criado com sucesso!');
    }
    return response;
  }

  /**
   * Atualiza serviço existente
   */
  async update(id: string, servico: Partial<Servico>): Promise<ApiResponse<Servico>> {
    console.log('🔄 Atualizando serviço:', id, servico);
    const response = await httpClient.put<Servico>(`/servicos/${id}`, servico);
    if (response.success) {
      console.log('✅ Serviço atualizado com sucesso!');
    }
    return response;
  }

  /**
   * Remove serviço
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    console.log('🗑️ Excluindo serviço:', id);
    const response = await httpClient.delete<void>(`/servicos/${id}`);
    if (response.success) {
      console.log('✅ Serviço excluído com sucesso!');
    }
    return response;
  }
}

export const servicosApi = new ServicosApi();