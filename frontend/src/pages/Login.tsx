import React, { useState } from 'react';
import { Eye, EyeOff, Scissors, User, Lock, Star } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onNavigateToRegister?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    
    try {
      await onLogin(email, password);
    } catch (err: any) {
      setError(err.message || 'Erro no login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 rotate-12">
          <Scissors className="w-24 h-24 text-blue-300" />
        </div>
        <div className="absolute top-40 right-20 -rotate-12">
          <Scissors className="w-16 h-16 text-indigo-300" />
        </div>
        <div className="absolute bottom-20 left-20 rotate-45">
          <Scissors className="w-20 h-20 text-blue-400" />
        </div>
        <div className="absolute bottom-40 right-10 -rotate-45">
          <Scissors className="w-12 h-12 text-indigo-400" />
        </div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4 shadow-2xl border-4 border-blue-300">
            <Scissors className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 mb-2">
            Barbearia Hoshirara
          </h1>
          
          <div className="flex justify-center mt-2 space-x-1">
            {[...Array()].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-blue-400 fill-current" />
            ))}
          </div>
        </div>

        {/* Formulário de Login */}
        <div className="bg-gradient-to-br from-blue-50/20 to-indigo-50/20 backdrop-blur-xl rounded-3xl border-2 border-blue-300/30 p-8 shadow-2xl shadow-blue-900/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-blue-100 mb-2">
                Email do Profissional
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-blue-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-white/90 border-2 border-blue-300/30 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all backdrop-blur-sm"
                  placeholder="Digite seu email profissional"
                  disabled={isLoading}
                  style={{ color: '#000000' }}
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-blue-100 mb-2">
                Senha de Acesso
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-blue-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-8 pr-10 py-2 bg-white/90 border-2 border-blue-300/30 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all backdrop-blur-sm"
                  placeholder="Digite sua senha"
                  disabled={isLoading}
                  style={{ color: '#000000' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-2 flex items-center"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-blue-300 hover:text-blue-100 transition-colors" />
                  ) : (
                    <Eye className="h-4 w-4 text-blue-300 hover:text-blue-100 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Mensagem de Erro */}
            {error && (
              <div className="bg-red-600/30 border-2 border-red-400/50 rounded-xl p-3 backdrop-blur-sm">
                <p className="text-red-100 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-blue-400/50 disabled:to-indigo-500/50 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Acessando Barbearia...
                </>
              ) : (
                <>
                  <Scissors className="w-5 h-5 mr-2" />
                  Entrar na Barbearia
                </>
              )}
            </button>

            {/* Link para Cadastro */}
            {onNavigateToRegister && (
              <div className="text-center mt-4">
                <p className="text-blue-200 text-sm mb-2">
                  Ainda não tem uma conta?
                </p>
                <button
                  type="button"
                  onClick={onNavigateToRegister}
                  disabled={isLoading}
                  className="text-blue-300 hover:text-blue-100 font-medium text-sm underline hover:no-underline transition-all duration-200"
                >
                  Criar nova conta
                </button>
              </div>
            )}
          </form>

          {/* Credenciais de Exemplo */}
          
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <div className="flex justify-center items-center mb-2">
            <Scissors className="w-4 h-4 text-blue-400 mr-2" />
            <span className="text-blue-300 text-sm font-medium">Desde 2025</span>
            <Scissors className="w-4 h-4 text-blue-400 ml-2 rotate-180" />
          </div>
          <p className="text-blue-200/80 text-sm">
            © 2025 Barbearia Hoshirara 
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;