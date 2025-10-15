// APIs relacionadas a barbeiros
import { httpClient } from './client';
import type { Barbeiro, ApiResponse } from '../../types';

export class BarbeirosApi {
  /**
   * Busca todos os barbeiros
   */
  async getAll(): Promise<ApiResponse<Barbeiro[]>> {
    console.log('🔄 Buscando barbeiros');
    const response = await httpClient.get<Barbeiro[]>('/barbeiros');
    if (response.success) {
      console.log('📡 Barbeiros encontrados:', response.data?.length);
    }
    return response;
  }

  /**
   * Busca barbeiro por ID
   */
  async getById(id: string): Promise<ApiResponse<Barbeiro>> {
    console.log('🔄 Buscando barbeiro por ID:', id);
    const response = await httpClient.get<Barbeiro>(`/barbeiros/${id}`);
    if (response.success) {
      console.log('📡 Barbeiro encontrado:', response.data);
    }
    return response;
  }

  /**
   * Cria novo barbeiro
   */
  async create(barbeiro: Omit<Barbeiro, 'id'>): Promise<ApiResponse<Barbeiro>> {
    console.log('🔄 Criando barbeiro:', barbeiro);
    const response = await httpClient.post<Barbeiro>('/barbeiros', barbeiro);
    if (response.success) {
      console.log('✅ Barbeiro criado com sucesso!');
    }
    return response;
  }

  /**
   * Atualiza barbeiro existente
   */
  async update(id: string, barbeiro: Partial<Barbeiro>): Promise<ApiResponse<Barbeiro>> {
    console.log('🔄 Atualizando barbeiro:', id, barbeiro);
    const response = await httpClient.put<Barbeiro>(`/barbeiros/${id}`, barbeiro);
    if (response.success) {
      console.log('✅ Barbeiro atualizado com sucesso!');
    }
    return response;
  }

  /**
   * Remove barbeiro
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    console.log('🗑️ Excluindo barbeiro:', id);
    const response = await httpClient.delete<void>(`/barbeiros/${id}`);
    if (response.success) {
      console.log('✅ Barbeiro excluído com sucesso!');
    }
    return response;
  }
}

export const barbeirosApi = new BarbeirosApi();