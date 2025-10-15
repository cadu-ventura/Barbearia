import React, { useState } from 'react';
import { Scissors, Clock, DollarSign, TrendingUp, Search, Plus, Edit, Trash2 } from 'lucide-react';
import { useServicos } from '../contexts';
import Modal from '../components/common/Modal';
import ServicoForm from '../components/common/ServicoForm';

const Servicos: React.FC = () => {
  const { items: servicos, remove: excluirServico } = useServicos();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServico, setSelectedServico] = useState<typeof servicos[0] | null>(null);

  const filteredServicos = servicos.filter(servico =>
    servico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (servico.categoria && servico.categoria.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (servico.descricao && servico.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEdit = (servico: typeof servicos[0]) => {
    setSelectedServico(servico);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, nome: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o serviço "${nome}"?`)) {
      excluirServico(id);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedServico(null);
  };

  const handleModalSave = () => {
    // Modal será fechado pelo formulário após salvar
  };

  // Calcular estatísticas
  const servicosAtivos = servicos.filter(s => s.ativo);
  const precoMedio = servicosAtivos.length > 0 
    ? servicosAtivos.reduce((sum, s) => sum + s.preco, 0) / servicosAtivos.length 
    : 0;
  const duracaoMedia = servicosAtivos.length > 0 
    ? servicosAtivos.reduce((sum, s) => sum + s.duracao, 0) / servicosAtivos.length 
    : 0;

  // Encontrar serviço mais caro (como proxy para "mais vendido")
  const servicoDestaque = servicosAtivos.reduce((max, servico) => 
    servico.preco > max.preco ? servico : max, servicosAtivos[0] || { nome: 'N/A', preco: 0 }
  );

  const categoriasLabels = {
    corte: 'Corte',
    barba: 'Barba',
    sobrancelha: 'Sobrancelha',
    hidratacao: 'Hidratação',
    combo: 'Combo',
    outros: 'Outros'
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-4 lg:p-6">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-1 lg:mb-2">Serviços</h1>
          <p className="text-slate-600 text-sm lg:text-base">Gerencie os serviços oferecidos pela barbearia</p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-white p-3 lg:p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-xs lg:text-sm font-medium">Total</p>
                <p className="text-xl lg:text-2xl font-bold text-slate-800">{servicosAtivos.length}</p>
              </div>
              <div className="p-2 lg:p-3 bg-amber-100 rounded-lg">
                <Scissors className="w-4 lg:w-6 h-4 lg:h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Preço Médio</p>
                <p className="text-2xl font-bold text-slate-800">R$ {precoMedio.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Duração Média</p>
                <p className="text-2xl font-bold text-slate-800">{Math.round(duracaoMedia)}min</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Mais Caro</p>
                <p className="text-2xl font-bold text-slate-800 truncate">{servicoDestaque.nome}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Serviços */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800">Lista de Serviços</h2>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar serviços..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent w-full sm:w-64"
                  />
                </div>
                
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Novo Serviço
                </button>
              </div>
            </div>
          </div>

          {filteredServicos.length === 0 ? (
            <div className="p-12 text-center">
              <Scissors className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">
                {searchTerm ? 'Nenhum serviço encontrado' : 'Nenhum serviço cadastrado'}
              </h3>
              <p className="text-slate-500 mb-6">
                {searchTerm 
                  ? 'Tente usar outros termos de busca' 
                  : 'Comece adicionando os serviços oferecidos pela barbearia'
                }
              </p>
              {!searchTerm && (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Adicionar Primeiro Serviço
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
                    <th className="text-left p-4 font-medium text-slate-700">Serviço</th>
                    <th className="text-left p-4 font-medium text-slate-700">Categoria</th>
                    <th className="text-left p-4 font-medium text-slate-700">Preço</th>
                    <th className="text-left p-4 font-medium text-slate-700">Duração</th>
                    <th className="text-left p-4 font-medium text-slate-700">Comissão</th>
                    <th className="text-left p-4 font-medium text-slate-700">Status</th>
                    <th className="text-left p-4 font-medium text-slate-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServicos.map((servico) => (
                    <tr key={servico.id} className="border-t border-slate-200 hover:bg-slate-50">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-slate-800">{servico.nome}</p>
                          <p className="text-sm text-slate-600 line-clamp-2">{servico.descricao}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          {categoriasLabels[servico.categoria as keyof typeof categoriasLabels] || servico.categoria}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-green-600">R$ {servico.preco.toFixed(2)}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-slate-600">{servico.duracao}min</span>
                      </td>
                      <td className="p-4">
                        <span className="text-slate-600">{servico.comissaoBarbeiro}%</span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          servico.ativo 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {servico.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEdit(servico)}
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                            title="Editar serviço"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(servico.id, servico.nome)}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                            title="Excluir serviço"
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
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
              {filteredServicos.map((servico) => (
                <div key={servico.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                  {/* Header do Card */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 text-base truncate">{servico.nome}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-1">{servico.descricao}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium shrink-0 ml-2 ${
                      servico.ativo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {servico.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>

                  {/* Categoria */}
                  <div className="mb-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      {categoriasLabels[servico.categoria as keyof typeof categoriasLabels] || servico.categoria}
                    </span>
                  </div>

                  {/* Informações */}
                  <div className="grid grid-cols-3 gap-3 mb-3 text-center bg-slate-50 p-2 rounded">
                    <div>
                      <p className="text-sm font-semibold text-green-600">R$ {servico.preco.toFixed(2)}</p>
                      <p className="text-xs text-slate-600">Preço</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{servico.duracao}min</p>
                      <p className="text-xs text-slate-600">Duração</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{servico.comissaoBarbeiro}%</p>
                      <p className="text-xs text-slate-600">Comissão</p>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(servico)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(servico.id, servico.nome)}
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
        title={selectedServico ? 'Editar Serviço' : 'Novo Serviço'}
        size="lg"
      >
        <ServicoForm
          servico={selectedServico || undefined}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      </Modal>
    </div>
  );
};

export default Servicos;