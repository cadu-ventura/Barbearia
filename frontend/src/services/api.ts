// API Client para Barbearia Hoshirara
export interface Agendamento {
  id: string;
  clienteId: string;
  barbeiroId: string;
  servicoId: string;
  servicoIds?: string[];
  dataHora: string;
  status: 'agendado' | 'em_andamento' | 'concluido' | 'cancelado' | 'nao_compareceu';
  observacoes?: string;
  valorTotal?: number;
  formaPagamento?: string;
}

export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  dataUltimoCorte?: string;
  observacoes?: string;
}

export interface Barbeiro {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  especialidades: string[];
  ativo: boolean;
}

export interface Servico {
  id: string;
  nome: string;
  preco: number;
  duracao: number;
  ativo: boolean;
}

export interface MovimentacaoFinanceira {
  id: string;
  tipo: 'receita' | 'despesa';
  valor: number;
  descricao: string;
  categoria: string;
  data: string;
  agendamentoId?: string;
  barbeiroId?: string;
  formaPagamento?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private readonly baseUrl = 'http://localhost:3001/api';

    async getAgendamentos(): Promise<ApiResponse<Agendamento[]>> {
    try {
      console.log('🔄 Buscando agendamentos');
      const response = await fetch(`${this.baseUrl}/agendamentos`);
      const data = await response.json();
      console.log('📡 Agendamentos encontrados:', data.length);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao buscar agendamentos:', error);
      return { success: false, error: 'Erro ao buscar agendamentos' };
    }
  }

  async getAgendamentoById(id: string): Promise<ApiResponse<Agendamento>> {
    try {
      console.log('🔄 Buscando agendamento por ID:', id);
      const response = await fetch(`${this.baseUrl}/agendamentos/${id}`);
      const data = await response.json();
      console.log('📡 Agendamento encontrado:', data);
      return { success: response.ok, data };
    } catch (error) {
      console.error('❌ Erro ao buscar agendamento:', error);
      return { success: false, error: 'Erro ao buscar agendamento' };
    }
  }

  async updateAgendamento(id: string, updateData: Partial<Agendamento>): Promise<ApiResponse> {
    try {
      console.log('🔄 Atualizando agendamento:', id, updateData);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${this.baseUrl}/agendamentos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });
      const data = await response.json();
      console.log('📡 Resposta da API:', data);
      return { success: response.ok, message: data.message };
    } catch (error) {
      console.error('❌ Erro ao atualizar agendamento:', error);
      return { success: false, error: 'Erro ao atualizar agendamento' };
    }
  }

  async createAgendamento(data: Omit<Agendamento, 'id'>): Promise<ApiResponse<Agendamento>> {
    try {
      console.log('🔄 Criando agendamento:', data);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${this.baseUrl}/agendamentos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      console.log('📡 Resposta da API:', result);
      return { success: response.ok, data: result, message: result.message };
    } catch (error) {
      console.error('❌ Erro ao criar agendamento:', error);
      return { success: false, error: 'Erro ao criar agendamento' };
    }
  }

  async getClientes(): Promise<ApiResponse<Cliente[]>> {
    try {
      console.log('🔄 Buscando clientes');
      const response = await fetch(`${this.baseUrl}/clientes`);
      const data = await response.json();
      console.log('📡 Clientes encontrados:', data.length);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao buscar clientes:', error);
      return { success: false, error: 'Erro ao buscar clientes' };
    }
  }

  async getClienteById(id: string): Promise<ApiResponse<Cliente>> {
    try {
      console.log('🔄 Buscando cliente por ID:', id);
      const response = await fetch(`${this.baseUrl}/clientes/${id}`);
      const data = await response.json();
      console.log('📡 Cliente encontrado:', data);
      return { success: response.ok, data };
    } catch (error) {
      console.error('❌ Erro ao buscar cliente:', error);
      return { success: false, error: 'Erro ao buscar cliente' };
    }
  }

  async createCliente(data: Omit<Cliente, 'id'>): Promise<ApiResponse<Cliente>> {
    try {
      console.log('🔄 Criando cliente:', data);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${this.baseUrl}/clientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      console.log('📡 Resposta da API:', result);
      return { success: response.ok, data: result, message: result.message };
    } catch (error) {
      console.error('❌ Erro ao criar cliente:', error);
      return { success: false, error: 'Erro ao criar cliente' };
    }
  }

  async updateCliente(id: string, data: Partial<Cliente>): Promise<ApiResponse> {
    try {
      console.log('🔄 Atualizando cliente:', id, data);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${this.baseUrl}/clientes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      console.log('📡 Resposta da API:', result);
      return { success: response.ok, message: result.message };
    } catch (error) {
      console.error('❌ Erro ao atualizar cliente:', error);
      return { success: false, error: 'Erro ao atualizar cliente' };
    }
  }

  async deleteCliente(id: string): Promise<ApiResponse> {
    try {
      console.log('🗑️ Excluindo cliente:', id);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${this.baseUrl}/clientes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log('📡 Resposta da API:', data);
      return { success: response.ok, message: data.message };
    } catch (error) {
      console.error('❌ Erro ao excluir cliente:', error);
      return { success: false, error: 'Erro ao excluir cliente' };
    }
  }

  async getBarbeiros(): Promise<ApiResponse<Barbeiro[]>> {
    try {
      console.log('🔄 Buscando barbeiros');
      const response = await fetch(`${this.baseUrl}/barbeiros`);
      const data = await response.json();
      console.log('📡 Barbeiros encontrados:', data.length);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao buscar barbeiros:', error);
      return { success: false, error: 'Erro ao buscar barbeiros' };
    }
  }

  async getBarbeiroById(id: string): Promise<ApiResponse<Barbeiro>> {
    try {
      console.log('🔄 Buscando barbeiro por ID:', id);
      const response = await fetch(`${this.baseUrl}/barbeiros/${id}`);
      const data = await response.json();
      console.log('📡 Barbeiro encontrado:', data);
      return { success: response.ok, data };
    } catch (error) {
      console.error('❌ Erro ao buscar barbeiro:', error);
      return { success: false, error: 'Erro ao buscar barbeiro' };
    }
  }

  async createBarbeiro(data: Omit<Barbeiro, 'id'>): Promise<ApiResponse<Barbeiro>> {
    try {
      console.log('🔄 Criando barbeiro:', data);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${this.baseUrl}/barbeiros`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      console.log('📡 Resposta da API:', result);
      return { success: response.ok, data: result, message: result.message };
    } catch (error) {
      console.error('❌ Erro ao criar barbeiro:', error);
      return { success: false, error: 'Erro ao criar barbeiro' };
    }
  }

  async updateBarbeiro(id: string, data: Partial<Barbeiro>): Promise<ApiResponse> {
    try {
      console.log('🔄 Atualizando barbeiro:', id, data);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${this.baseUrl}/barbeiros/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      console.log('📡 Resposta da API:', result);
      return { success: response.ok, message: result.message };
    } catch (error) {
      console.error('❌ Erro ao atualizar barbeiro:', error);
      return { success: false, error: 'Erro ao atualizar barbeiro' };
    }
  }

  async deleteBarbeiro(id: string): Promise<ApiResponse> {
    try {
      console.log('🗑️ Excluindo barbeiro:', id);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${this.baseUrl}/barbeiros/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log('📡 Resposta da API:', data);
      return { success: response.ok, message: data.message };
    } catch (error) {
      console.error('❌ Erro ao excluir barbeiro:', error);
      return { success: false, error: 'Erro ao excluir barbeiro' };
    }
  }

  async getServicos(): Promise<ApiResponse<Servico[]>> {
    try {
      console.log('🔄 Buscando serviços');
      const response = await fetch(`${this.baseUrl}/servicos`);
      const data = await response.json();
      console.log('📡 Serviços encontrados:', data.length);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao buscar serviços:', error);
      return { success: false, error: 'Erro ao buscar serviços' };
    }
  }

  async getServicoById(id: string): Promise<ApiResponse<Servico>> {
    try {
      console.log('🔄 Buscando serviço por ID:', id);
      const response = await fetch(`${this.baseUrl}/servicos/${id}`);
      const data = await response.json();
      console.log('📡 Serviço encontrado:', data);
      return { success: response.ok, data };
    } catch (error) {
      console.error('❌ Erro ao buscar serviço:', error);
      return { success: false, error: 'Erro ao buscar serviço' };
    }
  }

  async createServico(data: Omit<Servico, 'id'>): Promise<ApiResponse<Servico>> {
    try {
      console.log('🔄 Criando serviço:', data);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${this.baseUrl}/servicos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      console.log('📡 Resposta da API:', result);
      return { success: response.ok, data: result, message: result.message };
    } catch (error) {
      console.error('❌ Erro ao criar serviço:', error);
      return { success: false, error: 'Erro ao criar serviço' };
    }
  }

  async updateServico(id: string, data: Partial<Servico>): Promise<ApiResponse> {
    try {
      console.log('🔄 Atualizando serviço:', id, data);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${this.baseUrl}/servicos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      console.log('📡 Resposta da API:', result);
      return { success: response.ok, message: result.message };
    } catch (error) {
      console.error('❌ Erro ao atualizar serviço:', error);
      return { success: false, error: 'Erro ao atualizar serviço' };
    }
  }

  async deleteServico(id: string): Promise<ApiResponse> {
    try {
      console.log('🗑️ Excluindo serviço:', id);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${this.baseUrl}/servicos/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log('📡 Resposta da API:', data);
      return { success: response.ok, message: data.message };
    } catch (error) {
      console.error('❌ Erro ao excluir serviço:', error);
      return { success: false, error: 'Erro ao excluir serviço' };
    }
  }

  async deleteAgendamento(id: string): Promise<ApiResponse> {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${this.baseUrl}/agendamentos/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return { success: response.ok, message: data.message };
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error);
      return { success: false, error: 'Erro ao excluir agendamento' };
    }
  }

  // ============== OPERAÇÕES FINANCEIRAS ==============
  async getMovimentacoesFinanceiras(): Promise<ApiResponse<MovimentacaoFinanceira[]>> {
    try {
      console.log('🔄 Buscando movimentações financeiras');
      const response = await fetch(`${this.baseUrl}/financeiro`);
      const data = await response.json();
      console.log('📡 Movimentações encontradas:', data.length);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao buscar movimentações:', error);
      return { success: false, error: 'Erro ao buscar movimentações financeiras' };
    }
  }

  async createMovimentacaoFinanceira(data: Omit<MovimentacaoFinanceira, 'id'>): Promise<ApiResponse<MovimentacaoFinanceira>> {
    try {
      console.log('🔄 Criando movimentação financeira:', data);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${this.baseUrl}/financeiro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      console.log('📡 Resposta da API:', result);
      return { success: response.ok, data: result, message: result.message };
    } catch (error) {
      console.error('❌ Erro ao criar movimentação:', error);
      return { success: false, error: 'Erro ao criar movimentação financeira' };
    }
  }

  async updateMovimentacaoFinanceira(id: string, data: Partial<MovimentacaoFinanceira>): Promise<ApiResponse> {
    try {
      console.log('🔄 Atualizando movimentação financeira:', id, data);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${this.baseUrl}/financeiro/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      console.log('📡 Resposta da API:', result);
      return { success: response.ok, message: result.message };
    } catch (error) {
      console.error('❌ Erro ao atualizar movimentação:', error);
      return { success: false, error: 'Erro ao atualizar movimentação financeira' };
    }
  }

  async deleteMovimentacaoFinanceira(id: string): Promise<ApiResponse> {
    try {
      console.log('🗑️ Excluindo movimentação financeira:', id);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${this.baseUrl}/financeiro/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log('📡 Resposta da API:', data);
      return { success: response.ok, message: data.message };
    } catch (error) {
      console.error('❌ Erro ao excluir movimentação:', error);
      return { success: false, error: 'Erro ao excluir movimentação financeira' };
    }
  }

  // ============== AUTENTICAÇÃO ==============
  async login(email: string, senha: string): Promise<ApiResponse<{token: string, user: any}>> {
    try {
      console.log('� Tentando login com API real:', email);
      
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: senha }),
      });
      
      const data = await response.json();
      console.log('📡 Resposta do login:', data);
      
      if (response.ok && data.token) {
        return {
          success: true,
          message: 'Login realizado com sucesso!',
          data: {
            token: data.token,
            user: data.user || {
              id: '1',
              email,
              nome: data.nome || 'Usuário'
            }
          }
        };
      } else {
        return {
          success: false,
          error: data.message || 'Credenciais inválidas'
        };
      }
    } catch (error) {
      console.error('❌ Erro na requisição de login:', error);
      
      // Fallback para mock em caso de erro
      console.log('🔄 Usando autenticação mock como fallback');
      if (email && senha) {
        return {
          success: true,
          message: 'Login realizado com sucesso (modo desenvolvimento)!',
          data: {
            token: `mock_token_${Date.now()}`,
            user: {
              id: '1',
              email,
              nome: 'Usuário Admin (Dev)'
            }
          }
        };
      } else {
        return {
          success: false,
          error: 'Email e senha são obrigatórios'
        };
      }
    }
  }

  async register(userData: {
    nome: string;
    email: string;
    senha: string;
    confirmarSenha: string;
    telefone?: string;
    tipo?: 'admin' | 'barbeiro' | 'recepcionista';
  }): Promise<ApiResponse<{token: string, user: any}>> {
    try {
      console.log('🔄 Tentando cadastro com API real:', userData.email);
      
      // Validar se as senhas coincidem
      if (userData.senha !== userData.confirmarSenha) {
        return {
          success: false,
          error: 'As senhas não coincidem'
        };
      }

      // Validar força da senha
      if (userData.senha.length < 6) {
        return {
          success: false,
          error: 'A senha deve ter pelo menos 6 caracteres'
        };
      }

      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: userData.nome,
          email: userData.email,
          password: userData.senha,
          role: userData.tipo === 'recepcionista' ? 'funcionario' : userData.tipo || 'admin'
        }),
      });
      
      const data = await response.json();
      console.log('📡 Resposta do cadastro:', data);
      
      if (response.ok) {
        return {
          success: true,
          message: 'Cadastro realizado com sucesso!',
          data: {
            token: data.token,
            user: data.user || {
              id: data.id || Date.now().toString(),
              email: userData.email,
              nome: userData.nome
            }
          }
        };
      } else {
        return {
          success: false,
          error: data.message || 'Erro ao realizar cadastro'
        };
      }
    } catch (error) {
      console.error('❌ Erro na requisição de cadastro:', error);
      
      // Fallback para mock em caso de erro
      console.log('🔄 Usando cadastro mock como fallback');
      
      // Validações básicas mesmo no mock
      if (!userData.nome || !userData.email || !userData.senha) {
        return {
          success: false,
          error: 'Nome, email e senha são obrigatórios'
        };
      }

      if (userData.senha !== userData.confirmarSenha) {
        return {
          success: false,
          error: 'As senhas não coincidem'
        };
      }

      return {
        success: true,
        message: 'Cadastro realizado com sucesso (modo desenvolvimento)!',
        data: {
          token: `mock_token_${Date.now()}`,
          user: {
            id: Date.now().toString(),
            email: userData.email,
            nome: userData.nome,
            tipo: userData.tipo || 'admin'
          }
        }
      };
    }
  }

  // Métodos de Relatórios e Estatísticas
  async getRelatorioFinanceiro(params?: {
    dataInicio?: string;
    dataFim?: string;
    barbeiroId?: string;
  }): Promise<ApiResponse<any>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.dataInicio) queryParams.append('dataInicio', params.dataInicio);
      if (params?.dataFim) queryParams.append('dataFim', params.dataFim);
      if (params?.barbeiroId) queryParams.append('barbeiroId', params.barbeiroId);
      
      const url = `${this.baseUrl}/relatorios/financeiro${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      console.log('🔄 Buscando relatório financeiro:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      console.log('📡 Relatório financeiro:', data);
      return { success: response.ok, data };
    } catch (error) {
      console.error('❌ Erro ao buscar relatório financeiro:', error);
      return { success: false, error: 'Erro ao buscar relatório financeiro' };
    }
  }

  async getRelatorioAtendimentos(params?: {
    dataInicio?: string;
    dataFim?: string;
    barbeiroId?: string;
  }): Promise<ApiResponse<any>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.dataInicio) queryParams.append('dataInicio', params.dataInicio);
      if (params?.dataFim) queryParams.append('dataFim', params.dataFim);
      if (params?.barbeiroId) queryParams.append('barbeiroId', params.barbeiroId);
      
      const url = `${this.baseUrl}/relatorios/atendimentos${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      console.log('🔄 Buscando relatório de atendimentos:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      console.log('📡 Relatório de atendimentos:', data);
      return { success: response.ok, data };
    } catch (error) {
      console.error('❌ Erro ao buscar relatório de atendimentos:', error);
      return { success: false, error: 'Erro ao buscar relatório de atendimentos' };
    }
  }

  async getEstatisticas(): Promise<ApiResponse<any>> {
    try {
      console.log('🔄 Buscando estatísticas');
      const response = await fetch(`${this.baseUrl}/estatisticas`);
      const data = await response.json();
      console.log('📡 Estatísticas:', data);
      return { success: response.ok, data };
    } catch (error) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      return { success: false, error: 'Erro ao buscar estatísticas' };
    }
  }

  async getFinanceiro(): Promise<ApiResponse<any[]>> {
    try {
      console.log('🔄 Buscando dados financeiros');
      const response = await fetch(`${this.baseUrl}/financeiro`);
      const data = await response.json();
      console.log('📡 Dados financeiros encontrados:', data.length);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao buscar dados financeiros:', error);
      return { success: false, error: 'Erro ao buscar dados financeiros' };
    }
  }
}

export const api = new ApiClient();
export default api;
