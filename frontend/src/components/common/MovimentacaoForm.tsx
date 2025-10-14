import React, { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import type { MovimentacaoFinanceira, TipoMovimentacao, CategoriaFinanceira, FormaPagamento } from '../../types';

interface MovimentacaoFormProps {
  movimentacao?: MovimentacaoFinanceira;
  onClose: () => void;
  onSave: () => void;
}

const MovimentacaoForm: React.FC<MovimentacaoFormProps> = ({ movimentacao, onClose, onSave }) => {
  const { adicionarMovimentacao, atualizarMovimentacao } = useApp();
  const isEditing = !!movimentacao;

  const [formData, setFormData] = useState({
    tipo: movimentacao?.tipo || 'receita' as TipoMovimentacao,
    valor: movimentacao?.valor?.toString() || '',
    descricao: movimentacao?.descricao || '',
    categoria: movimentacao?.categoria || 'servico' as CategoriaFinanceira,
    data: movimentacao?.data 
      ? new Date(movimentacao.data).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    formaPagamento: movimentacao?.formaPagamento || 'dinheiro' as FormaPagamento
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categoriasReceita: CategoriaFinanceira[] = ['servico', 'produto', 'outros'];
  const categoriasDespesa: CategoriaFinanceira[] = ['comissao', 'aluguel', 'energia', 'agua', 'internet', 'material', 'marketing', 'outros'];

  const categorias = formData.tipo === 'receita' ? categoriasReceita : categoriasDespesa;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };

      // Se mudou o tipo, ajustar categoria se necessário
      if (name === 'tipo') {
        const novasCategorias = value === 'receita' ? categoriasReceita : categoriasDespesa;
        if (!novasCategorias.includes(prev.categoria)) {
          newData.categoria = novasCategorias[0];
        }
      }

      return newData;
    });

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

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }

    if (!formData.valor.trim()) {
      newErrors.valor = 'Valor é obrigatório';
    } else if (isNaN(Number(formData.valor)) || Number(formData.valor) <= 0) {
      newErrors.valor = 'Valor deve ser um número válido maior que zero';
    }

    if (!formData.data) {
      newErrors.data = 'Data é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const movimentacaoData = {
      tipo: formData.tipo,
      valor: Number(formData.valor),
      descricao: formData.descricao,
      categoria: formData.categoria,
      data: new Date(formData.data),
      formaPagamento: formData.formaPagamento
    };

    if (isEditing && movimentacao) {
      atualizarMovimentacao(movimentacao.id, movimentacaoData);
    } else {
      adicionarMovimentacao(movimentacaoData);
    }

    onSave();
    onClose();
  };

  const categoriasLabels: Record<CategoriaFinanceira, string> = {
    servico: 'Serviços',
    comissao: 'Comissão',
    produto: 'Produtos',
    aluguel: 'Aluguel',
    energia: 'Energia Elétrica',
    agua: 'Água',
    internet: 'Internet',
    material: 'Material',
    marketing: 'Marketing',
    outros: 'Outros'
  };

  const formasPagamentoLabels: Record<FormaPagamento, string> = {
    dinheiro: 'Dinheiro',
    cartao_credito: 'Cartão de Crédito',
    cartao_debito: 'Cartão de Débito',
    pix: 'PIX',
    outros: 'Outros'
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tipo de Movimentação */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tipo de Movimentação *
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="tipo"
                value="receita"
                checked={formData.tipo === 'receita'}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-green-600 font-medium">Receita</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="tipo"
                value="despesa"
                checked={formData.tipo === 'despesa'}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-red-600 font-medium">Despesa</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Valor (R$) *
          </label>
          <input
            type="number"
            name="valor"
            value={formData.valor}
            onChange={handleChange}
            step="0.01"
            min="0"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
              errors.valor ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="0.00"
          />
          {errors.valor && <p className="text-red-500 text-sm mt-1">{errors.valor}</p>}
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
          placeholder="Descreva a movimentação financeira..."
        />
        {errors.descricao && <p className="text-red-500 text-sm mt-1">{errors.descricao}</p>}
      </div>

      {/* Categoria e Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            {categorias.map(cat => (
              <option key={cat} value={cat}>
                {categoriasLabels[cat]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Data *
          </label>
          <input
            type="date"
            name="data"
            value={formData.data}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
              errors.data ? 'border-red-500' : 'border-slate-300'
            }`}
          />
          {errors.data && <p className="text-red-500 text-sm mt-1">{errors.data}</p>}
        </div>
      </div>

      {/* Forma de Pagamento */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Forma de Pagamento
        </label>
        <select
          name="formaPagamento"
          value={formData.formaPagamento}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        >
          {Object.entries(formasPagamentoLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Preview */}
      <div className={`p-4 rounded-lg ${formData.tipo === 'receita' ? 'bg-green-50' : 'bg-red-50'}`}>
        <h3 className="font-medium text-slate-800 mb-2">Preview da Movimentação:</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-600">Tipo:</span>
            <p className={`font-medium ${formData.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
              {formData.tipo === 'receita' ? 'Receita' : 'Despesa'}
            </p>
          </div>
          <div>
            <span className="text-slate-600">Valor:</span>
            <p className={`font-medium ${formData.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
              {formData.tipo === 'receita' ? '+' : '-'} R$ {formData.valor || '0,00'}
            </p>
          </div>
          <div>
            <span className="text-slate-600">Categoria:</span>
            <p className="font-medium text-slate-800">
              {categoriasLabels[formData.categoria]}
            </p>
          </div>
          <div>
            <span className="text-slate-600">Pagamento:</span>
            <p className="font-medium text-slate-800">
              {formasPagamentoLabels[formData.formaPagamento]}
            </p>
          </div>
        </div>
      </div>

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
          className={`px-4 py-2 text-white rounded-lg transition-colors ${
            formData.tipo === 'receita' 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {isEditing ? 'Atualizar' : 'Registrar'} {formData.tipo === 'receita' ? 'Receita' : 'Despesa'}
        </button>
      </div>
    </form>
  );
};

export default MovimentacaoForm;