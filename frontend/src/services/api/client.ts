// Cliente HTTP base para todas as requisições
import type { ApiResponse } from '../../types';

export class HttpClient {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  }

  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      const data = await response.json();
      return { success: response.ok, data, message: data.message };
    } catch (error) {
      console.error(`❌ Erro ao fazer GET ${endpoint}:`, error);
      return { success: false, error: `Erro ao buscar dados de ${endpoint}` };
    }
  }

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(body)
      });
      const data = await response.json();
      return { success: response.ok, data, message: data.message };
    } catch (error) {
      console.error(`❌ Erro ao fazer POST ${endpoint}:`, error);
      return { success: false, error: `Erro ao criar dados em ${endpoint}` };
    }
  }

  async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(body)
      });
      const data = await response.json();
      return { success: response.ok, data, message: data.message };
    } catch (error) {
      console.error(`❌ Erro ao fazer PUT ${endpoint}:`, error);
      return { success: false, error: `Erro ao atualizar dados em ${endpoint}` };
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      const data = await response.json();
      return { success: response.ok, data, message: data.message };
    } catch (error) {
      console.error(`❌ Erro ao fazer DELETE ${endpoint}:`, error);
      return { success: false, error: `Erro ao deletar dados de ${endpoint}` };
    }
  }
}

export const httpClient = new HttpClient();