import React, { useState } from 'react';
import { Eye, EyeOff, Scissors, User, Lock, Star, Mail, Phone, UserCheck, ArrowLeft } from 'lucide-react';

interface RegisterProps {
  onRegister: (userData: {
    nome: string;
    email: string;
    senha: string;
    confirmarSenha: string;
    telefone?: string;
    tipo?: 'admin' | 'barbeiro' | 'recepcionista';
  }) => Promise<void>;
  onBackToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onBackToLogin }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
    tipo: 'admin' as 'admin' | 'barbeiro' | 'recepcionista'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.nome || !formData.email || !formData.senha || !formData.confirmarSenha) {
      return 'Por favor, preencha todos os campos obrigatórios';
    }

    if (formData.senha !== formData.confirmarSenha) {
      return 'As senhas não coincidem';
    }

    if (formData.senha.length < 8) {
      return 'A senha deve ter pelo menos 8 caracteres';
    }

    // Verificar complexidade da senha
    const hasLower = /[a-z]/.test(formData.senha);
    const hasUpper = /[A-Z]/.test(formData.senha);
    const hasNumber = /\d/.test(formData.senha);
    const hasSpecial = /[@$!%*?&]/.test(formData.senha);

    if (!hasLower || !hasUpper || !hasNumber || !hasSpecial) {
      return 'A senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial (@$!%*?&)';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return 'Digite um email válido';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    
    try {
      await onRegister(formData);
      setSuccess('Cadastro realizado com sucesso!');
      
      // Limpar formulário após sucesso
      setTimeout(() => {
        setFormData({
          nome: '',
          email: '',
          senha: '',
          confirmarSenha: '',
          telefone: '',
          tipo: 'admin'
        });
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Erro no cadastro');
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
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4 shadow-2xl border-4 border-blue-300">
            <Scissors className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 mb-2">
            Novo Cadastro
          </h1>
          <p className="text-blue-200 text-sm">Barbearia Hoshirara</p>
          
          <div className="flex justify-center mt-2 space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-blue-400 fill-current" />
            ))}
          </div>
        </div>

        {/* Formulário de Cadastro */}
        <div className="bg-gradient-to-br from-blue-50/20 to-indigo-50/20 backdrop-blur-xl rounded-3xl border-2 border-blue-300/30 p-6 shadow-2xl shadow-blue-900/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo Nome */}
            <div>
              <label htmlFor="nome" className="block text-sm font-semibold text-blue-100 mb-1">
                Nome Completo *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-blue-400" />
                </div>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-blue-50/10 border-2 border-blue-300/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all backdrop-blur-sm"
                  placeholder="Digite seu nome completo"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Campo Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-blue-100 mb-1">
                Email *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-blue-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-blue-50/10 border-2 border-blue-300/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all backdrop-blur-sm"
                  placeholder="Digite seu email"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Campo Telefone */}
            <div>
              <label htmlFor="telefone" className="block text-sm font-semibold text-blue-100 mb-1">
                Telefone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-blue-400" />
                </div>
                <input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-blue-50/10 border-2 border-blue-300/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all backdrop-blur-sm"
                  placeholder="(11) 99999-9999"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Campo Tipo de Usuário */}
            <div>
              <label htmlFor="tipo" className="block text-sm font-semibold text-blue-100 mb-1">
                Tipo de Usuário
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserCheck className="h-5 w-5 text-blue-400" />
                </div>
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-blue-50/10 border-2 border-blue-300/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all backdrop-blur-sm"
                  disabled={isLoading}
                >
                  <option value="admin" className="bg-blue-900 text-white">Administrador</option>
                  <option value="barbeiro" className="bg-blue-900 text-white">Barbeiro</option>
                  <option value="recepcionista" className="bg-blue-900 text-white">Recepcionista</option>
                </select>
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <label htmlFor="senha" className="block text-sm font-semibold text-blue-100 mb-1">
                Senha *
              </label>
              <p className="text-xs text-blue-300 mb-2">
                Mínimo 8 caracteres: 1 maiúscula, 1 minúscula, 1 número e 1 especial (@$!%*?&)
              </p>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-blue-400" />
                </div>
                <input
                  id="senha"
                  name="senha"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.senha}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-blue-50/10 border-2 border-blue-300/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all backdrop-blur-sm"
                  placeholder="Digite sua senha (mín. 8 chars, 1 maiúsc, 1 minúsc, 1 núm, 1 especial)"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-blue-300 hover:text-blue-100 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-blue-300 hover:text-blue-100 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Campo Confirmar Senha */}
            <div>
              <label htmlFor="confirmarSenha" className="block text-sm font-semibold text-blue-100 mb-1">
                Confirmar Senha *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-blue-400" />
                </div>
                <input
                  id="confirmarSenha"
                  name="confirmarSenha"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmarSenha}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-blue-50/10 border-2 border-blue-300/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all backdrop-blur-sm"
                  placeholder="Confirme sua senha"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-blue-300 hover:text-blue-100 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-blue-300 hover:text-blue-100 transition-colors" />
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

            {/* Mensagem de Sucesso */}
            {success && (
              <div className="bg-green-600/30 border-2 border-green-400/50 rounded-xl p-3 backdrop-blur-sm">
                <p className="text-green-100 text-sm font-medium">{success}</p>
              </div>
            )}

            {/* Botões */}
            <div className="space-y-3">
              {/* Botão de Cadastro */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-green-400/50 disabled:to-emerald-500/50 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Criando Conta...
                  </>
                ) : (
                  <>
                    <UserCheck className="w-5 h-5 mr-2" />
                    Criar Conta
                  </>
                )}
              </button>

              {/* Botão Voltar */}
              <button
                type="button"
                onClick={onBackToLogin}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-700/30 disabled:from-blue-400/10 disabled:to-indigo-500/10 text-blue-100 font-medium py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center border-2 border-blue-400/30 hover:border-blue-300/50"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar ao Login
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
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

export default Register;