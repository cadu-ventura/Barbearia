import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useApp } from '../hooks/useApp';
import Modal from '../components/common/Modal';
import MovimentacaoForm from '../components/common/MovimentacaoForm';

const Financeiro: React.FC = () => {
  const { movimentacoes, excluirMovimentacao } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovimentacao, setSelectedMovimentacao] = useState<any>(null);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');

  const filteredMovimentacoes = movimentacoes.filter(mov => {
    const matchBusca = mov.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo = filtroTipo === 'todos' || mov.tipo === filtroTipo;
    return matchBusca && matchTipo;
  });

  const handleEdit = (movimentacao: any) => {
    setSelectedMovimentacao(movimentacao);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, descricao: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a movimentação "${descricao}"?`)) {
      excluirMovimentacao(id);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMovimentacao(null);
  };

  const handleModalSave = () => {
    // Modal será fechado pelo formulário após salvar
  };

  // Calcular estatísticas
  const totalReceitas = movimentacoes
    .filter(m => m.tipo === 'receita')
    .reduce((acc, m) => acc + m.valor, 0);

  const totalDespesas = movimentacoes
    .filter(m => m.tipo === 'despesa')
    .reduce((acc, m) => acc + m.valor, 0);

  const saldoTotal = totalReceitas - totalDespesas;

  const categoriasLabels = {
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

  const formasPagamentoLabels = {
    dinheiro: 'Dinheiro',
    cartao_credito: 'Cartão de Crédito',
    cartao_debito: 'Cartão de Débito',
    pix: 'PIX',
    outros: 'Outros'
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-4 lg:p-6">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-1 lg:mb-2">Financeiro</h1>
          <p className="text-slate-600 text-sm lg:text-base">Controle completo das movimentações financeiras</p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Receitas</p>
                <p className="text-2xl font-bold text-green-600">R$ {totalReceitas.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Despesas</p>
                <p className="text-2xl font-bold text-red-600">R$ {totalDespesas.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Saldo</p>
                <p className={`text-2xl font-bold ${saldoTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {saldoTotal.toFixed(2)}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${saldoTotal >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <DollarSign className={`w-6 h-6 ${saldoTotal >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Movimentações</p>
                <p className="text-2xl font-bold text-slate-800">{movimentacoes.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Movimentações */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800">Movimentações Financeiras</h2>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar movimentações..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent w-full sm:w-64"
                  />
                </div>

                <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="todos">Todos os Tipos</option>
                  <option value="receita">Receitas</option>
                  <option value="despesa">Despesas</option>
                </select>
                
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nova Movimentação
                </button>
              </div>
            </div>
          </div>

          {filteredMovimentacoes.length === 0 ? (
            <div className="p-12 text-center">
              <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">
                {searchTerm ? 'Nenhuma movimentação encontrada' : 'Nenhuma movimentação cadastrada'}
              </h3>
              <p className="text-slate-500 mb-6">
                {searchTerm 
                  ? 'Tente usar outros termos de busca' 
                  : 'Comece registrando as receitas e despesas da barbearia'
                }
              </p>
              {!searchTerm && (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Registrar Primeira Movimentação
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop - Tabela */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left p-4 font-medium text-slate-700">Data</th>
                      <th className="text-left p-4 font-medium text-slate-700">Descrição</th>
                      <th className="text-left p-4 font-medium text-slate-700">Categoria</th>
                      <th className="text-left p-4 font-medium text-slate-700">Tipo</th>
                      <th className="text-left p-4 font-medium text-slate-700">Valor</th>
                      <th className="text-left p-4 font-medium text-slate-700">Pagamento</th>
                      <th className="text-left p-4 font-medium text-slate-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMovimentacoes.map((movimentacao) => (
                      <tr key={movimentacao.id} className="border-t border-slate-200 hover:bg-slate-50">
                        <td className="p-4">
                          <span className="text-slate-800">
                            {new Date(movimentacao.data).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-slate-800">{movimentacao.descricao}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {categoriasLabels[movimentacao.categoria as keyof typeof categoriasLabels] || movimentacao.categoria}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            movimentacao.tipo === 'receita' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {movimentacao.tipo === 'receita' ? 'Receita' : 'Despesa'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`font-medium ${
                            movimentacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {movimentacao.tipo === 'receita' ? '+' : '-'} R$ {movimentacao.valor.toFixed(2)}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-slate-600">
                            {formasPagamentoLabels[movimentacao.formaPagamento as keyof typeof formasPagamentoLabels] || movimentacao.formaPagamento}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEdit(movimentacao)}
                              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                              title="Editar movimentação"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(movimentacao.id, movimentacao.descricao)}
                              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                              title="Excluir movimentação"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile - Cards */}
              <div className="lg:hidden divide-y divide-slate-200 p-4">
                {filteredMovimentacoes.map((movimentacao) => (
                  <div key={movimentacao.id} className="py-4">
                    {/* Header do Card */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-800 text-sm truncate">{movimentacao.descricao}</h3>
                        <p className="text-xs text-slate-600">{new Date(movimentacao.data).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <span className={`font-semibold text-sm ${
                          movimentacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {movimentacao.tipo === 'receita' ? '+' : '-'} R$ {movimentacao.valor.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        movimentacao.tipo === 'receita' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {movimentacao.tipo === 'receita' ? 'Receita' : 'Despesa'}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {categoriasLabels[movimentacao.categoria as keyof typeof categoriasLabels] || movimentacao.categoria}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {formasPagamentoLabels[movimentacao.formaPagamento as keyof typeof formasPagamentoLabels] || movimentacao.formaPagamento}
                      </span>
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(movimentacao)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(movimentacao.id, movimentacao.descricao)}
                        className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal de Formulário */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={selectedMovimentacao ? 'Editar Movimentação' : 'Nova Movimentação'}
        size="lg"
      >
        <MovimentacaoForm
          movimentacao={selectedMovimentacao}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      </Modal>
    </div>
  );
};

export default Financeiro;