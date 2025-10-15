import React, { useState } from 'react';
import { User, Plus, Search, Star, Clock, DollarSign, Edit, Trash2 } from 'lucide-react';
import { useBarbeiros } from '../contexts';
import Modal from '../components/common/Modal';
import BarbeiroForm from '../components/common/BarbeiroForm';

const Barbeiros: React.FC = () => {
  const { items: barbeiros, remove: excluirBarbeiro } = useBarbeiros();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBarbeiro, setSelectedBarbeiro] = useState<typeof barbeiros[0] | null>(null);

  const filteredBarbeiros = barbeiros.filter(barbeiro =>
    barbeiro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (barbeiro.email && barbeiro.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    barbeiro.especialidades.some((esp) => esp.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEdit = (barbeiro: typeof barbeiros[0]) => {
    setSelectedBarbeiro(barbeiro);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, nome: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o barbeiro "${nome}"?`)) {
      await excluirBarbeiro(id);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedBarbeiro(null);
  };

  const handleModalSave = () => {
    // Modal será fechado pelo formulário após salvar
  };

  // Calcular estatísticas
  const barbeirosAtivos = barbeiros.filter(b => b.ativo);
  const comissaoMedia = barbeirosAtivos.length > 0 
    ? barbeirosAtivos.reduce((sum, b) => sum + (b.comissao || 0), 0) / barbeirosAtivos.length 
    : 0;
  const totalAtendimentos = barbeiros.reduce((sum, b) => sum + (b.totalAtendimentos || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-4 lg:p-6">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-1 lg:mb-2">Barbeiros</h1>
          <p className="text-slate-600 text-sm lg:text-base">Gerencie a equipe de profissionais da barbearia</p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-white p-3 lg:p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-xs lg:text-sm font-medium">Total</p>
                <p className="text-xl lg:text-2xl font-bold text-slate-800">{barbeirosAtivos.length}</p>
              </div>
              <div className="p-2 lg:p-3 bg-blue-100 rounded-lg">
                <User className="w-4 lg:w-6 h-4 lg:h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-3 lg:p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-xs lg:text-sm font-medium">Comissão</p>
                <p className="text-xl lg:text-2xl font-bold text-slate-800">{comissaoMedia.toFixed(1)}%</p>
              </div>
              <div className="p-2 lg:p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-4 lg:w-6 h-4 lg:h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-3 lg:p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-xs lg:text-sm font-medium">Atendimentos</p>
                <p className="text-xl lg:text-2xl font-bold text-slate-800">{totalAtendimentos}</p>
              </div>
              <div className="p-2 lg:p-3 bg-purple-100 rounded-lg">
                <Clock className="w-4 lg:w-6 h-4 lg:h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-3 lg:p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-xs lg:text-sm font-medium">Avaliação</p>
                <p className="text-xl lg:text-2xl font-bold text-slate-800">
                  N/A
                </p>
              </div>
              <div className="p-2 lg:p-3 bg-yellow-100 rounded-lg">
                <Star className="w-4 lg:w-6 h-4 lg:h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Barbeiros */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-4 lg:p-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <h2 className="text-lg lg:text-xl font-semibold text-slate-800">Equipe de Barbeiros</h2>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar barbeiros..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent w-full sm:w-64"
                  />
                </div>
                
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Novo Barbeiro</span>
                </button>
              </div>
            </div>
          </div>

          {filteredBarbeiros.length === 0 ? (
            <div className="p-12 text-center">
              <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">
                {searchTerm ? 'Nenhum barbeiro encontrado' : 'Nenhum barbeiro cadastrado'}
              </h3>
              <p className="text-slate-500 mb-6">
                {searchTerm 
                  ? 'Tente usar outros termos de busca' 
                  : 'Comece adicionando os profissionais da sua equipe'
                }
              </p>
              {!searchTerm && (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Adicionar Primeiro Barbeiro
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 p-4 lg:p-6">
              {filteredBarbeiros.map((barbeiro) => (
                <div key={barbeiro.id} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  {/* Header do Card */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 text-lg">{barbeiro.nome}</h3>
                        <p className="text-slate-600 text-sm">{barbeiro.email}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      barbeiro.ativo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {barbeiro.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>

                  {/* Informações do Barbeiro */}
                  <div className="space-y-4">
                    {/* Especialidades */}
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-2">Especialidades:</p>
                      <div className="flex flex-wrap gap-2">
                        {barbeiro.especialidades.map((especialidade: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {especialidade}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Estatísticas */}
                    <div className="grid grid-cols-3 gap-4 bg-slate-50 p-3 rounded-lg">
                      <div className="text-center">
                        <p className="text-lg font-bold text-slate-800">{barbeiro.comissao}%</p>
                        <p className="text-xs text-slate-600">Comissão</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <p className="text-lg font-bold text-slate-800">N/A</p>
                        </div>
                        <p className="text-xs text-slate-600">Avaliação</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-slate-800">{barbeiro.totalAtendimentos}</p>
                        <p className="text-xs text-slate-600">Atendimentos</p>
                      </div>
                    </div>

                    {/* Horário de Trabalho */}
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-2">Horário de Trabalho:</p>
                      <div className="space-y-1 max-h-24 overflow-y-auto">
                        {barbeiro.horarioTrabalho && typeof barbeiro.horarioTrabalho === 'string' && (
                          <p className="text-sm text-slate-800">{barbeiro.horarioTrabalho}</p>
                        )}
                        {!barbeiro.horarioTrabalho && (
                          <p className="text-sm text-slate-500">Não informado</p>
                        )}
                      </div>
                    </div>

                    {/* Informações de Contato */}
                    <div className="border-t pt-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-600">Telefone:</p>
                          <p className="font-medium text-slate-800">{barbeiro.telefone}</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Cadastro:</p>
                          <p className="font-medium text-slate-800">
                            {barbeiro.dataCadastro ? new Date(barbeiro.dataCadastro).toLocaleDateString() : 'Não informado'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2 pt-3">
                      <button 
                        onClick={() => handleEdit(barbeiro)}
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 px-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(barbeiro.id, barbeiro.nome)}
                        className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 px-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Formulário */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={selectedBarbeiro ? 'Editar Barbeiro' : 'Novo Barbeiro'}
        size="xl"
      >
        <BarbeiroForm
          barbeiro={selectedBarbeiro || undefined}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      </Modal>
    </div>
  );
};

export default Barbeiros;