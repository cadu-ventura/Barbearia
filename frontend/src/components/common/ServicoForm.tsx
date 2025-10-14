import React, { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import type { Servico, CategoriaServico } from '../../types';

interface ServicoFormProps {
  servico?: Servico;
  onClose: () => void;
  onSave: () => void;
}

const ServicoForm: React.FC<ServicoFormProps> = ({ servico, onClose, onSave }) => {
  const { adicionarServico, atualizarServico } = useApp();
  const isEditing = !!servico;

  const [formData, setFormData] = useState({
    nome: servico?.nome || '',
    descricao: servico?.descricao || '',
    preco: servico?.preco?.toString() || '',
    duracao: servico?.duracao?.toString() || '',
    categoria: servico?.categoria || 'corte' as CategoriaServico,
    comissaoBarbeiro: servico?.comissaoBarbeiro?.toString() || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }

    if (!formData.preco.trim()) {
      newErrors.preco = 'Preço é obrigatório';
    } else if (isNaN(Number(formData.preco)) || Number(formData.preco) <= 0) {
      newErrors.preco = 'Preço deve ser um número válido maior que zero';
    }

    if (!formData.duracao.trim()) {
      newErrors.duracao = 'Duração é obrigatória';
    } else if (isNaN(Number(formData.duracao)) || Number(formData.duracao) <= 0) {
      newErrors.duracao = 'Duração deve ser um número válido maior que zero';
    }

    if (!formData.comissaoBarbeiro.trim()) {
      newErrors.comissaoBarbeiro = 'Comissão é obrigatória';
    } else if (isNaN(Number(formData.comissaoBarbeiro)) || Number(formData.comissaoBarbeiro) < 0 || Number(formData.comissaoBarbeiro) > 100) {
      newErrors.comissaoBarbeiro = 'Comissão deve ser um número entre 0 e 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const servicoData = {
      nome: formData.nome,
      descricao: formData.descricao,
      preco: Number(formData.preco),
      duracao: Number(formData.duracao),
      categoria: formData.categoria,
      comissaoBarbeiro: Number(formData.comissaoBarbeiro),
      ativo: servico?.ativo ?? true
    };

    if (isEditing && servico) {
      atualizarServico(servico.id, servicoData);
    } else {
      adicionarServico(servicoData);
    }

    onSave();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações Básicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Nome do Serviço *
          </label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
              errors.nome ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="Ex: Corte Masculino"
          />
          {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Categoria *
          </label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="corte">Corte</option>
            <option value="barba">Barba</option>
            <option value="sobrancelha">Sobrancelha</option>
            <option value="hidratacao">Hidratação</option>
            <option value="combo">Combo</option>
            <option value="outros">Outros</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Preço (R$) *
          </label>
          <input
            type="number"
            name="preco"
            value={formData.preco}
            onChange={handleChange}
            step="0.01"
            min="0"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
              errors.preco ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="35.00"
          />
          {errors.preco && <p className="text-red-500 text-sm mt-1">{errors.preco}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Duração (minutos) *
          </label>
          <input
            type="number"
            name="duracao"
            value={formData.duracao}
            onChange={handleChange}
            min="1"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
              errors.duracao ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="30"
          />
          {errors.duracao && <p className="text-red-500 text-sm mt-1">{errors.duracao}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Comissão do Barbeiro (%) *
          </label>
          <input
            type="number"
            name="comissaoBarbeiro"
            value={formData.comissaoBarbeiro}
            onChange={handleChange}
            min="0"
            max="100"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
              errors.comissaoBarbeiro ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="50"
          />
          {errors.comissaoBarbeiro && <p className="text-red-500 text-sm mt-1">{errors.comissaoBarbeiro}</p>}
        </div>
      </div>

      {/* Descrição */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Descrição *
        </label>
        <textarea
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          rows={3}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
            errors.descricao ? 'border-red-500' : 'border-slate-300'
          }`}
          placeholder="Descreva o serviço oferecido..."
        />
        {errors.descricao && <p className="text-red-500 text-sm mt-1">{errors.descricao}</p>}
      </div>

      {/* Preview de Cálculos */}
      {formData.preco && formData.comissaoBarbeiro && (
        <div className="bg-slate-50 p-4 rounded-lg">
          <h3 className="font-medium text-slate-800 mb-2">Preview de Valores:</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-600">Valor da Comissão:</span>
              <p className="font-medium text-amber-600">
                R$ {(Number(formData.preco) * Number(formData.comissaoBarbeiro) / 100).toFixed(2)}
              </p>
            </div>
            <div>
              <span className="text-slate-600">Valor da Casa:</span>
              <p className="font-medium text-green-600">
                R$ {(Number(formData.preco) * (100 - Number(formData.comissaoBarbeiro)) / 100).toFixed(2)}
              </p>
            </div>
          </div>
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
          {isEditing ? 'Atualizar' : 'Cadastrar'} Serviço
        </button>
      </div>
    </form>
  );
};

export default ServicoForm;