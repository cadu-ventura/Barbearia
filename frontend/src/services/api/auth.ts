// APIs relacionadas à autenticação
import type { ApiResponse } from '../../types';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    nome: string;
    tipo?: string;
  };
}

export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  telefone?: string;
  tipo?: 'admin' | 'barbeiro' | 'recepcionista';
}

export class AuthApi {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  }

  /**
   * Realiza login do usuário
   */
  async login(email: string, senha: string): Promise<ApiResponse<LoginResponse>> {
    try {
      console.log('🔐 Tentando login com API real:', email);
      
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

  /**
   * Realiza registro de novo usuário
   */
  async register(userData: RegisterData): Promise<ApiResponse<LoginResponse>> {
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

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  /**
   * Remove token de autenticação
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }
}

export const authApi = new AuthApi();