import React, { useState } from 'react';
import { useClientes } from '../../contexts';
import type { Cliente } from '../../types';

interface ClienteFormProps {
  cliente?: Cliente;
  onClose: () => void;
  onSave: () => void;
}

const ClienteForm: React.FC<ClienteFormProps> = ({ cliente, onClose, onSave }) => {
  const { create: adicionarCliente, update: editarCliente } = useClientes();
  const isEditing = !!cliente;

  const [formData, setFormData] = useState({
    nome: cliente?.nome || '',
    email: cliente?.email || '',
    telefone: cliente?.telefone || '',
    dataNascimento: cliente?.dataNascimento || '',
    observacoes: cliente?.observacoes || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const clienteData = {
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        telefone: formData.telefone.trim(),
        dataNascimento: formData.dataNascimento || undefined,
        observacoes: formData.observacoes?.trim() || undefined
      };

      console.log('🔄 Submetendo formulário cliente:', clienteData);

      if (isEditing && cliente) {
        await editarCliente(cliente.id, clienteData);
        console.log('✅ Cliente editado com sucesso!');
      } else {
        await adicionarCliente(clienteData);
        console.log('✅ Cliente criado com sucesso!');
      }

      // Chamar callbacks com segurança
      try {
        onSave?.();
      } catch (callbackError) {
        console.error('Erro no callback onSave:', callbackError);
      }
      
      try {
        onClose?.();
      } catch (callbackError) {
        console.error('Erro no callback onClose:', callbackError);
      }
    } catch (error) {
      console.error('❌ Erro ao salvar cliente:', error);
      alert('Erro ao salvar cliente. Verifique os dados e tente novamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* Informações Básicas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Nome *
          </label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base ${
              errors.nome ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="Digite o nome completo"
          />
          {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base ${
              errors.email ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="email@exemplo.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Telefone *
          </label>
          <input
            type="tel"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base ${
              errors.telefone ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="(11) 99999-9999"
          />
          {errors.telefone && <p className="text-red-500 text-sm mt-1">{errors.telefone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Data de Nascimento
          </label>
          <input
            type="date"
            name="dataNascimento"
            value={formData.dataNascimento}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Observações */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Observações
        </label>
        <textarea
          name="observacoes"
          value={formData.observacoes}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          placeholder="Observações sobre o cliente..."
        />
      </div>

      {/* Botões */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 sm:pt-6 border-t">
        <button
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-base"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors text-base"
        >
          {isEditing ? 'Atualizar' : 'Cadastrar'} Cliente
        </button>
      </div>
    </form>
  );
};

export default ClienteForm;