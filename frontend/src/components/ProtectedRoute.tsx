import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Login from '../pages/Login';
import Register from '../pages/Register';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading, login, register } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const handleLogin = async (email: string, password: string) => {
      try {
        await login(email, password);
      } catch (error) {
        console.error('Erro no login:', error);
        // O componente Login vai lidar com o erro
        throw error;
      }
    };

    const handleRegister = async (userData: {
      nome: string;
      email: string;
      senha: string;
      confirmarSenha: string;
      telefone?: string;
      tipo?: 'admin' | 'barbeiro' | 'recepcionista';
    }) => {
      try {
        await register(userData);
        // Após cadastro bem-sucedido, volta para o login
        setShowRegister(false);
      } catch (error) {
        console.error('Erro no cadastro:', error);
        // O componente Register vai lidar com o erro
        throw error;
      }
    };

    if (showRegister) {
      return (
        <Register 
          onRegister={handleRegister}
          onBackToLogin={() => setShowRegister(false)}
        />
      );
    }

    return (
      <Login 
        onLogin={handleLogin}
        onNavigateToRegister={() => setShowRegister(true)}
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;