import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

interface User {
  id: string;
  nome: string;
  email: string;
  tipo: string;
}

interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  telefone?: string;
  tipo?: 'admin' | 'barbeiro' | 'recepcionista';
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<any>;
  register: (userData: RegisterData) => Promise<any>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar token ao carregar a aplicação
  useEffect(() => {
    // Para desenvolvimento: sempre mostrar tela de login
    // Limpar token existente para forçar novo login
    localStorage.removeItem('auth_token');
    setLoading(false);
    
    // Caso queira manter login persistente, descomente as linhas abaixo:
    // const token = localStorage.getItem('auth_token');
    // if (token) {
    //   verifyToken();
    // } else {
    //   setLoading(false);
    // }
  }, []);

  // const verifyToken = async () => {
  //   try {
  //     // Como estamos usando dados mock, simular verificação
  //     const token = localStorage.getItem('auth_token');
  //     if (token) {
  //       // Simular usuário logado
  //       setUser({
  //         id: '1',
  //         nome: 'Usuário Admin',
  //         email: 'admin@hoshirara.com',
  //         tipo: 'admin'
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Token inválido:', error);
  //     localStorage.removeItem('auth_token');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const login = async (email: string, senha: string) => {
    try {
      const response = await api.login(email, senha);
      
      if (response.success && response.data) {
        const userData = {
          id: response.data.user.id,
          nome: response.data.user.nome,
          email: response.data.user.email,
          tipo: response.data.user.tipo || 'admin'
        };
        
        setUser(userData);
        localStorage.setItem('auth_token', response.data.token);
        
        return {
          success: true,
          message: response.message,
          data: { user: userData, token: response.data.token }
        };
      } else {
        throw new Error(response.error || 'Erro ao fazer login');
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await api.register(userData);
      
      if (response.success && response.data) {
        const user = {
          id: response.data.user.id,
          nome: response.data.user.nome,
          email: response.data.user.email,
          tipo: response.data.user.tipo || 'admin'
        };
        
        setUser(user);
        localStorage.setItem('auth_token', response.data.token);
        
        return {
          success: true,
          message: response.message,
          data: { user, token: response.data.token }
        };
      } else {
        throw new Error(response.error || 'Erro ao fazer cadastro');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};