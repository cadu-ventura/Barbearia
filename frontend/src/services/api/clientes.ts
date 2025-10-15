// APIs relacionadas a clientes
import { httpClient } from './client';
import type { Cliente, ApiResponse } from '../../types';

export class ClientesApi {
  /**
   * Busca todos os clientes
   */
  async getAll(): Promise<ApiResponse<Cliente[]>> {
    console.log('🔄 Buscando clientes');
    const response = await httpClient.get<Cliente[]>('/clientes');
    if (response.success) {
      console.log('📡 Clientes encontrados:', response.data?.length);
    }
    return response;
  }

  /**
   * Busca cliente por ID
   */
  async getById(id: string): Promise<ApiResponse<Cliente>> {
    console.log('🔄 Buscando cliente por ID:', id);
    const response = await httpClient.get<Cliente>(`/clientes/${id}`);
    if (response.success) {
      console.log('📡 Cliente encontrado:', response.data);
    }
    return response;
  }

  /**
   * Cria novo cliente
   */
  async create(cliente: Omit<Cliente, 'id'>): Promise<ApiResponse<Cliente>> {
    console.log('🔄 Criando cliente:', cliente);
    const response = await httpClient.post<Cliente>('/clientes', cliente);
    if (response.success) {
      console.log('✅ Cliente criado com sucesso!');
    }
    return response;
  }

  /**
   * Atualiza cliente existente
   */
  async update(id: string, cliente: Partial<Cliente>): Promise<ApiResponse<Cliente>> {
    console.log('🔄 Atualizando cliente:', id, cliente);
    const response = await httpClient.put<Cliente>(`/clientes/${id}`, cliente);
    if (response.success) {
      console.log('✅ Cliente atualizado com sucesso!');
    }
    return response;
  }

  /**
   * Remove cliente
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    console.log('🗑️ Excluindo cliente:', id);
    const response = await httpClient.delete<void>(`/clientes/${id}`);
    if (response.success) {
      console.log('✅ Cliente excluído com sucesso!');
    }
    return response;
  }
}

export const clientesApi = new ClientesApi();