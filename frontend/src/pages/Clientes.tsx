import React, { useState } from 'react';
import { Users, Plus, Search, Filter, Phone, Mail, Calendar, Edit, Trash2 } from 'lucide-react';
import { useClientes } from '../contexts/clientes';
import Modal from '../components/common/Modal';
import ClienteForm from '../components/common/ClienteForm';
import type { Cliente } from '../types';

const Clientes: React.FC = () => {
  const { items: clientes, remove: removerCliente, loading } = useClientes();
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [modalAberto, setModalAberto] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | undefined>(undefined);

  const clientesFiltrados = clientes.filter(cliente => {
    const matchBusca = busca === '' || 
      cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (cliente.email && cliente.email.toLowerCase().includes(busca.toLowerCase())) ||
      cliente.telefone.includes(busca);
    
    const matchStatus = filtroStatus === 'todos' || 
      (filtroStatus === 'ativo' && cliente.ativo) ||
      (filtroStatus === 'inativo' && !cliente.ativo);
    
    return matchBusca && matchStatus;
  });

  const handleNovoCliente = () => {
    setClienteEditando(undefined);
    setModalAberto(true);
  };

  const handleEditarCliente = (cliente: Cliente) => {
    setClienteEditando(cliente);
    setModalAberto(true);
  };

  const handleExcluirCliente = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      await removerCliente(id);
    }
  };

  const handleCloseModal = () => {
    setModalAberto(false);
    setClienteEditando(undefined);
  };

  const handleSaveCliente = () => {
    try {
      // Função chamada após salvar o cliente no formulário
      // O formulário já gerencia a criação/atualização através do context
      console.log('✅ Callback de salvamento de cliente executado');
    } catch (error) {
      console.error('Erro no callback de salvamento:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl lg:text-4xl font-bold text-slate-800 mb-1">
            Clientes {loading.isLoading && <span className="text-amber-500">⟳</span>}
          </h1>
          <p className="text-slate-600 text-sm lg:text-base">Gerencie sua base de clientes</p>
        </div>
        <button 
          onClick={handleNovoCliente}
          className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-4 lg:w-5 h-4 lg:h-5" />
          <span className="text-sm lg:text-base">Novo Cliente</span>
        </button>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6 mb-6">
        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-slate-600">Total</p>
              <p className="text-xl lg:text-3xl font-bold text-slate-900">{clientes.length}</p>
            </div>
            <div className="w-8 lg:w-12 h-8 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-4 lg:w-6 h-4 lg:h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-slate-600">Ativos</p>
              <p className="text-xl lg:text-3xl font-bold text-slate-900">
                {clientes.filter(c => c.ativo).length}
              </p>
            </div>
            <div className="w-8 lg:w-12 h-8 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-lg lg:text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-slate-200 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-slate-600">Avaliação</p>
              <p className="text-xl lg:text-3xl font-bold text-slate-900">
                N/A
              </p>
            </div>
            <div className="w-8 lg:w-12 h-8 lg:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-lg lg:text-2xl">⭐</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 lg:w-5 h-4 lg:h-5" />
              <input
                type="text"
                placeholder="Buscar por nome, email ou telefone..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 lg:w-5 h-4 lg:h-5 text-slate-400" />
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="todos">Todos</option>
              <option value="ativo">Ativos</option>
              <option value="inativo">Inativos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Clientes */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 lg:p-6">
          <h2 className="text-lg lg:text-xl font-bold text-slate-800 mb-4">
            Clientes ({clientesFiltrados.length})
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 p-4 lg:p-6">
          {clientesFiltrados.map((cliente) => (
            <div key={cliente.id} className="border border-slate-200 rounded-lg p-4 lg:p-6 hover:shadow-md transition-shadow">
              {/* Header do Card */}
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <div className="w-10 lg:w-12 h-10 lg:h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-600 font-bold text-base lg:text-lg">
                    {cliente.nome.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  cliente.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {cliente.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </div>

              {/* Informações do Cliente */}
              <div className="space-y-2 lg:space-y-3">
                <div>
                  <h3 className="font-semibold text-slate-800 text-base lg:text-lg truncate">{cliente.nome}</h3>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span className="text-xs lg:text-sm truncate">{cliente.email}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-4 h-4 shrink-0" />
                  <span className="text-xs lg:text-sm">{cliente.telefone}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span className="text-xs lg:text-sm">
                    Desde {cliente.dataCadastro ? cliente.dataCadastro.toLocaleDateString('pt-BR') : 'N/A'}
                  </span>
                </div>

                {/* Estatísticas */}
                <div className="flex justify-between items-center pt-2 lg:pt-3 border-t border-slate-200">
                  <div className="text-center">
                    <p className="text-xs lg:text-sm font-medium text-slate-800">{cliente.totalAtendimentos}</p>
                    <p className="text-xs text-slate-600">Atendimentos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs lg:text-sm font-medium text-slate-800">
                      N/A
                    </p>
                    <p className="text-xs text-slate-600">Avaliação</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs lg:text-sm font-medium text-slate-800">
                      {cliente.ultimoAtendimento ? 
                        cliente.ultimoAtendimento.toLocaleDateString('pt-BR') : 
                        'Nunca'
                      }
                    </p>
                    <p className="text-xs text-slate-600">Último</p>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-2 pt-2 lg:pt-3">
                  <button 
                    onClick={() => handleEditarCliente(cliente)}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 px-3 rounded-lg text-xs lg:text-sm transition-colors flex items-center justify-center gap-1"
                  >
                    <Edit className="w-3 lg:w-4 h-3 lg:h-4" />
                    <span className="hidden sm:inline">Editar</span>
                    <span className="sm:hidden">✏️</span>
                  </button>
                  <button 
                    onClick={() => handleExcluirCliente(cliente.id)}
                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 px-3 rounded-lg text-xs lg:text-sm transition-colors flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3 lg:w-4 h-3 lg:h-4" />
                    <span className="hidden sm:inline">Excluir</span>
                    <span className="sm:hidden">🗑️</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {clientesFiltrados.length === 0 && (
          <div className="p-8 text-center">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">Nenhum cliente encontrado</p>
          </div>
        )}
      </div>

      {/* Modal de Cliente */}
      <Modal
        isOpen={modalAberto}
        onClose={handleCloseModal}
        title={clienteEditando ? 'Editar Cliente' : 'Novo Cliente'}
        size="lg"
      >
        <ClienteForm
          cliente={clienteEditando}
          onClose={handleCloseModal}
          onSave={handleSaveCliente}
        />
      </Modal>
    </div>
  );
};

export default Clientes;