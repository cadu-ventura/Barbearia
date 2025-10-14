import React, { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import type { Barbeiro } from '../../types';

interface BarbeiroFormProps {
  barbeiro?: Barbeiro;
  onClose: () => void;
  onSave: () => void;
}

const BarbeiroForm: React.FC<BarbeiroFormProps> = ({ barbeiro, onClose, onSave }) => {
  const { adicionarBarbeiro, atualizarBarbeiro } = useApp();
  const isEditing = !!barbeiro;

  const [formData, setFormData] = useState({
    nome: barbeiro?.nome || '',
    telefone: barbeiro?.telefone || '',
    email: barbeiro?.email || '',
    cpf: barbeiro?.cpf || '',
    dataCadastro: barbeiro?.dataCadastro || new Date().toISOString().split('T')[0],
    comissao: barbeiro?.comissao?.toString() || '',
    especialidades: barbeiro?.especialidades || [],
    horarioTrabalho: {
      inicio: '08:00',
      fim: '18:00',
      diasSemana: [1, 2, 3, 4, 5, 6]
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [novaEspecialidade, setNovaEspecialidade] = useState('');

  const diasSemana = [
    { id: 0, nome: 'Domingo' },
    { id: 1, nome: 'Segunda' },
    { id: 2, nome: 'Terça' },
    { id: 3, nome: 'Quarta' },
    { id: 4, nome: 'Quinta' },
    { id: 5, nome: 'Sexta' },
    { id: 6, nome: 'Sábado' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('horario.')) {
      const horarioField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        horarioTrabalho: {
          ...prev.horarioTrabalho,
          [horarioField]: value
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

  const handleDiaChange = (diaId: number) => {
    setFormData(prev => ({
      ...prev,
      horarioTrabalho: {
        ...prev.horarioTrabalho,
        diasSemana: prev.horarioTrabalho.diasSemana.includes(diaId)
          ? prev.horarioTrabalho.diasSemana.filter(d => d !== diaId)
          : [...prev.horarioTrabalho.diasSemana, diaId]
      }
    }));
  };

  const adicionarEspecialidade = () => {
    if (novaEspecialidade.trim() && !formData.especialidades.includes(novaEspecialidade.trim())) {
      setFormData(prev => ({
        ...prev,
        especialidades: [...prev.especialidades, novaEspecialidade.trim()]
      }));
      setNovaEspecialidade('');
    }
  };

  const removerEspecialidade = (especialidade: string) => {
    setFormData(prev => ({
      ...prev,
      especialidades: prev.especialidades.filter(e => e !== especialidade)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else if (formData.telefone.length < 10) {
      newErrors.telefone = 'Telefone deve ter pelo menos 10 dígitos';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email deve ter um formato válido';
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    }

    if (!formData.comissao.trim()) {
      newErrors.comissao = 'Comissão padrão é obrigatória';
    } else if (isNaN(Number(formData.comissao)) || Number(formData.comissao) < 0 || Number(formData.comissao) > 100) {
      newErrors.comissao = 'Comissão deve ser um número entre 0 e 100';
    }

    if (formData.horarioTrabalho.diasSemana.length === 0) {
      newErrors.diasSemana = 'Selecione pelo menos um dia de trabalho';
    }

    if (formData.horarioTrabalho.inicio >= formData.horarioTrabalho.fim) {
      newErrors.horario = 'Horário de início deve ser anterior ao horário de fim';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Converter horário simples para formato HorarioTrabalho[]
    const horarioTrabalhoFormatado = formData.horarioTrabalho.diasSemana.map(dia => ({
      diaSemana: dia,
      horaInicio: formData.horarioTrabalho.inicio,
      horaFim: formData.horarioTrabalho.fim
    }));

    const barbeiroData = {
      nome: formData.nome,
      telefone: formData.telefone,
      email: formData.email,
      cpf: formData.cpf,
      especialidades: formData.especialidades,
      comissao: Number(formData.comissao),
      horarioTrabalho: horarioTrabalhoFormatado,
      ativo: barbeiro?.ativo ?? true,
      dataCadastro: typeof formData.dataCadastro === 'string' ? new Date(formData.dataCadastro) : formData.dataCadastro,
      totalAtendimentos: barbeiro?.totalAtendimentos ?? 0
    };

    if (isEditing && barbeiro) {
      atualizarBarbeiro(barbeiro.id, barbeiroData);
    } else {
      adicionarBarbeiro(barbeiroData);
    }

    onSave();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Informações Pessoais */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2">
          Informações Pessoais
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nome Completo *
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                errors.nome ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="Ex: João Silva"
            />
            {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
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
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                errors.telefone ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="(11) 99999-9999"
            />
            {errors.telefone && <p className="text-red-500 text-sm mt-1">{errors.telefone}</p>}
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
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                errors.email ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="joao@exemplo.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              CPF *
            </label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                errors.cpf ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="000.000.000-00"
            />
            {errors.cpf && <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Data de Cadastro
            </label>
            <input
              type="date"
              name="dataCadastro"
              value={typeof formData.dataCadastro === 'string' ? formData.dataCadastro : formData.dataCadastro.toISOString().split('T')[0]}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Comissão Padrão (%) *
            </label>
            <input
              type="number"
              name="comissao"
              value={formData.comissao}
              onChange={handleChange}
              min="0"
              max="100"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                errors.comissao ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="50"
            />
            {errors.comissao && <p className="text-red-500 text-sm mt-1">{errors.comissao}</p>}
          </div>
        </div>
      </div>

      {/* Especialidades */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2">
          Especialidades
        </h3>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={novaEspecialidade}
            onChange={(e) => setNovaEspecialidade(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarEspecialidade())}
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="Ex: Corte masculino, Barba, Sobrancelha..."
          />
          <button
            type="button"
            onClick={adicionarEspecialidade}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
          >
            Adicionar
          </button>
        </div>

        {formData.especialidades.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.especialidades.map((especialidade, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
              >
                {especialidade}
                <button
                  type="button"
                  onClick={() => removerEspecialidade(especialidade)}
                  className="hover:text-red-600 ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Horário de Trabalho */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2">
          Horário de Trabalho
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Início *
            </label>
            <input
              type="time"
              name="horario.inicio"
              value={formData.horarioTrabalho.inicio}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Fim *
            </label>
            <input
              type="time"
              name="horario.fim"
              value={formData.horarioTrabalho.fim}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>

        {errors.horario && <p className="text-red-500 text-sm">{errors.horario}</p>}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Dias de Trabalho *
          </label>
          <div className="grid grid-cols-7 gap-2">
            {diasSemana.map((dia) => (
              <label key={dia.id} className="flex flex-col items-center">
                <input
                  type="checkbox"
                  checked={formData.horarioTrabalho.diasSemana.includes(dia.id)}
                  onChange={() => handleDiaChange(dia.id)}
                  className="mb-1"
                />
                <span className="text-xs text-center">{dia.nome}</span>
              </label>
            ))}
          </div>
          {errors.diasSemana && <p className="text-red-500 text-sm mt-1">{errors.diasSemana}</p>}
        </div>
      </div>

      {/* Preview */}
      {formData.horarioTrabalho.diasSemana.length > 0 && (
        <div className="bg-slate-50 p-4 rounded-lg">
          <h3 className="font-medium text-slate-800 mb-2">Preview do Horário:</h3>
          <p className="text-sm text-slate-600">
            <strong>Horário:</strong> {formData.horarioTrabalho.inicio} às {formData.horarioTrabalho.fim}
          </p>
          <p className="text-sm text-slate-600">
            <strong>Dias:</strong> {formData.horarioTrabalho.diasSemana
              .map(id => diasSemana.find(d => d.id === id)?.nome)
              .join(', ')}
          </p>
        </div>
      )}

      {/* Botões */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
        >
          {isEditing ? 'Atualizar' : 'Cadastrar'} Barbeiro
        </button>
      </div>
    </form>
  );
};

export default BarbeiroForm;