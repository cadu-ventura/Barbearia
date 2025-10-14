import React, { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import type { Cliente } from '../../types';

interface ClienteFormProps {
  cliente?: Cliente;
  onClose: () => void;
  onSave: () => void;
}

const ClienteForm: React.FC<ClienteFormProps> = ({ cliente, onClose, onSave }) => {
  const { adicionarCliente, atualizarCliente } = useApp();
  const isEditing = !!cliente;

  const [formData, setFormData] = useState({
    nome: cliente?.nome || '',
    email: cliente?.email || '',
    telefone: cliente?.telefone || '',
    cpf: cliente?.cpf || '',
    dataNascimento: cliente?.dataNascimento ? cliente.dataNascimento.toISOString().split('T')[0] : '',
    endereco: {
      cep: cliente?.endereco?.cep || '',
      logradouro: cliente?.endereco?.logradouro || '',
      numero: cliente?.endereco?.numero || '',
      complemento: cliente?.endereco?.complemento || '',
      bairro: cliente?.endereco?.bairro || '',
      cidade: cliente?.endereco?.cidade || '',
      estado: cliente?.endereco?.estado || ''
    },
    observacoes: cliente?.observacoes || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('endereco.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const clienteData = {
      nome: formData.nome,
      email: formData.email,
      telefone: formData.telefone,
      cpf: formData.cpf || undefined,
      dataNascimento: formData.dataNascimento ? new Date(formData.dataNascimento) : undefined,
      endereco: formData.endereco.cep ? formData.endereco : undefined,
      observacoes: formData.observacoes || undefined,
      ativo: cliente?.ativo ?? true,
      dataCadastro: cliente?.dataCadastro || new Date(),
      ultimoAtendimento: cliente?.ultimoAtendimento,
      totalAtendimentos: cliente?.totalAtendimentos || 0
    };

    if (isEditing && cliente) {
      atualizarCliente(cliente.id, clienteData);
    } else {
      adicionarCliente(clienteData);
    }

    onSave();
    onClose();
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
            CPF
          </label>
          <input
            type="text"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
            placeholder="000.000.000-00"
          />
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

      {/* Endereço */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-slate-800 mb-4">Endereço</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              CEP
            </label>
            <input
              type="text"
              name="endereco.cep"
              value={formData.endereco.cep}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="00000-000"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Logradouro
            </label>
            <input
              type="text"
              name="endereco.logradouro"
              value={formData.endereco.logradouro}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Rua, Avenida, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Número
            </label>
            <input
              type="text"
              name="endereco.numero"
              value={formData.endereco.numero}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="123"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Complemento
            </label>
            <input
              type="text"
              name="endereco.complemento"
              value={formData.endereco.complemento}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Apto, Bloco, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Bairro
            </label>
            <input
              type="text"
              name="endereco.bairro"
              value={formData.endereco.bairro}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Nome do bairro"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Cidade
            </label>
            <input
              type="text"
              name="endereco.cidade"
              value={formData.endereco.cidade}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Nome da cidade"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Estado
            </label>
            <input
              type="text"
              name="endereco.estado"
              value={formData.endereco.estado}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="SP"
              maxLength={2}
            />
          </div>
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