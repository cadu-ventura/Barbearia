import React, { useState } from 'react';
import { Calendar, Clock, Plus, User, Scissors, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useAgendamentos, useClientes, useBarbeiros, useServicos } from '../contexts';

const Agendamentos: React.FC = () => {
  const { items: agendamentos, create: adicionarAgendamento, update: atualizarAgendamento, remove: excluirAgendamento } = useAgendamentos();
  const { items: clientes } = useClientes();
  const { items: barbeiros } = useBarbeiros();
  const { items: servicos } = useServicos();
  
  const [showModal, setShowModal] = useState(false);
  const [novoAgendamento, setNovoAgendamento] = useState({
    clienteId: '',
    barbeiroId: '',
    servicoIds: [] as string[],
    dataHora: '',
    observacoes: ''
  });

  const handleExcluirAgendamento = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      await excluirAgendamento(id);
    }
  };

  const [erros, setErros] = useState<string[]>([]);
  const [sucesso, setSucesso] = useState<string>('');

  const handleFecharModal = () => {
    setShowModal(false);
    setErros([]);
    setNovoAgendamento({
      clienteId: '',
      barbeiroId: '',
      servicoIds: [],
      dataHora: '',
      observacoes: ''
    });
  };

  const handleAdicionarAgendamento = (e: React.FormEvent) => {
    e.preventDefault();
    
    const novosErros: string[] = [];
    
    if (!novoAgendamento.clienteId) {
      novosErros.push('Selecione um cliente');
    }
    if (!novoAgendamento.barbeiroId) {
      novosErros.push('Selecione um barbeiro');
    }
    if (novoAgendamento.servicoIds.length === 0) {
      novosErros.push('Selecione pelo menos um serviço');
    }
    if (!novoAgendamento.dataHora) {
      novosErros.push('Selecione data e hora');
    } else {
      const dataAgendamento = new Date(novoAgendamento.dataHora);
      const agora = new Date();
      if (dataAgendamento < agora) {
        novosErros.push('A data e hora devem ser no futuro');
      }
      
      // Verificar conflito de horário com o mesmo barbeiro
      const conflito = agendamentos.find(a => 
        a.barbeiroId === novoAgendamento.barbeiroId &&
        a.status !== 'cancelado' &&
        Math.abs(new Date(a.dataHora).getTime() - dataAgendamento.getTime()) < 30 * 60 * 1000 // 30 minutos
      );
      
      if (conflito) {
        novosErros.push('Já existe um agendamento próximo a este horário para o barbeiro selecionado');
      }
    }
    
    if (novosErros.length > 0) {
      setErros(novosErros);
      return;
    }
    
    setErros([]);

    const agendamento = {
      clienteId: novoAgendamento.clienteId,
      barbeiroId: novoAgendamento.barbeiroId,
      servicoIds: novoAgendamento.servicoIds,
      dataHora: new Date(novoAgendamento.dataHora),
      status: 'agendado' as const,
      observacoes: novoAgendamento.observacoes,
      valorTotal: novoAgendamento.servicoIds.reduce((total, servicoId) => {
        const servico = servicos.find(s => s.id === servicoId);
        return total + (servico?.preco || 0);
      }, 0),
      dataCriacao: new Date(),
      dataAtualizacao: new Date()
    };

    adicionarAgendamento(agendamento);
    setSucesso('Agendamento criado com sucesso!');
    handleFecharModal();
    
    // Limpar mensagem de sucesso após 3 segundos
    setTimeout(() => setSucesso(''), 3000);
  };

  const handleAtualizarStatus = (id: string, novoStatus: 'agendado' | 'em_andamento' | 'concluido' | 'cancelado' | 'nao_compareceu') => {
    atualizarAgendamento(id, { 
      status: novoStatus
    });
  };

  const getClienteNome = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.nome || 'Cliente não encontrado';
  };

  const getBarbeiroNome = (barbeiroId: string) => {
    const barbeiro = barbeiros.find(b => b.id === barbeiroId);
    return barbeiro?.nome || 'Barbeiro não encontrado';
  };

  const getServicosNomes = (servicoIds: string[]) => {
    return servicoIds.map(id => {
      const servico = servicos.find(s => s.id === id);
      return servico?.nome || 'Serviço não encontrado';
    }).join(', ');
  };

  const formatarDataHora = (data: Date | string) => {
    try {
      const dataObj = typeof data === 'string' ? new Date(data) : data;
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(dataObj);
    } catch {
      return 'Data inválida';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'em_andamento':
        return <Clock className="w-4 h-4 text-purple-500" />;
      case 'concluido':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'cancelado':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'em_andamento': return 'bg-purple-100 text-purple-800';
      case 'concluido': return 'bg-blue-100 text-blue-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      case 'nao_compareceu': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800'; // agendado
    }
  };

  const handleServicoToggle = (servicoId: string) => {
    setNovoAgendamento(prev => ({
      ...prev,
      servicoIds: prev.servicoIds.includes(servicoId)
        ? prev.servicoIds.filter(id => id !== servicoId)
        : [...prev.servicoIds, servicoId]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Mensagem de Sucesso */}
      {sucesso && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <div className="flex">
            <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-800">{sucesso}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-600" />
              Agendamentos
            </h1>
            <p className="text-gray-600 mt-1">
              Gerencie os agendamentos da barbearia
            </p>
          </div>
          <button
            onClick={() => {
              setErros([]);
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Agendamento
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{agendamentos.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Agendados</p>
              <p className="text-2xl font-bold text-yellow-600">
                {agendamentos.filter(a => a.status === 'agendado').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Em Andamento</p>
              <p className="text-2xl font-bold text-purple-600">
                {agendamentos.filter(a => a.status === 'em_andamento').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Concluídos</p>
              <p className="text-2xl font-bold text-blue-600">
                {agendamentos.filter(a => a.status === 'concluido').length}
              </p>
            </div>
            <Scissors className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Lista de Agendamentos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Lista de Agendamentos</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Barbeiro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serviços
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data/Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {agendamentos.map((agendamento) => (
                <tr key={agendamento.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        {getClienteNome(agendamento.clienteId)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getBarbeiroNome(agendamento.barbeiroId)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {getServicosNomes(agendamento.servicoIds)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatarDataHora(agendamento.dataHora)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agendamento.status)}`}>
                      {getStatusIcon(agendamento.status)}
                      {agendamento.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    R$ {agendamento.valorTotal?.toFixed(2) || '0,00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {agendamento.status === 'agendado' && (
                      <button
                        onClick={() => handleAtualizarStatus(agendamento.id, 'em_andamento')}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        Iniciar
                      </button>
                    )}
                    {agendamento.status === 'em_andamento' && (
                      <button
                        onClick={() => handleAtualizarStatus(agendamento.id, 'concluido')}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Concluir
                      </button>
                    )}
                    <button
                      onClick={() => handleExcluirAgendamento(agendamento.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {agendamentos.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Nenhum agendamento encontrado</p>
              <p className="text-gray-400 text-sm mt-1">Clique em "Novo Agendamento" para começar</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Novo Agendamento */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Novo Agendamento</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAdicionarAgendamento} className="space-y-4">
              {erros.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="flex">
                    <AlertCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-red-800 mb-1">
                        Corrija os seguintes erros:
                      </h3>
                      <ul className="text-sm text-red-700 list-disc list-inside">
                        {erros.map((erro, index) => (
                          <li key={index}>{erro}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente *
                </label>
                <select
                  value={novoAgendamento.clienteId}
                  onChange={(e) => setNovoAgendamento({...novoAgendamento, clienteId: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione um cliente</option>
                  {clientes.filter(c => c.ativo).map(cliente => (
                    <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Barbeiro *
                </label>
                <select
                  value={novoAgendamento.barbeiroId}
                  onChange={(e) => setNovoAgendamento({...novoAgendamento, barbeiroId: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione um barbeiro</option>
                  {barbeiros.filter(b => b.ativo).map(barbeiro => (
                    <option key={barbeiro.id} value={barbeiro.id}>{barbeiro.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serviços * (selecione um ou mais)
                </label>
                <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                  {servicos.filter(s => s.ativo).map(servico => (
                    <label key={servico.id} className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        checked={novoAgendamento.servicoIds.includes(servico.id)}
                        onChange={() => handleServicoToggle(servico.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        {servico.nome} - R$ {servico.preco.toFixed(2)}
                      </span>
                    </label>
                  ))}
                </div>
                {novoAgendamento.servicoIds.length > 0 && (
                  <p className="text-sm text-blue-600 mt-1">
                    Total: R$ {novoAgendamento.servicoIds.reduce((total, servicoId) => {
                      const servico = servicos.find(s => s.id === servicoId);
                      return total + (servico?.preco || 0);
                    }, 0).toFixed(2)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data e Hora *
                </label>
                <input
                  type="datetime-local"
                  value={novoAgendamento.dataHora}
                  onChange={(e) => setNovoAgendamento({...novoAgendamento, dataHora: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações
                </label>
                <textarea
                  value={novoAgendamento.observacoes}
                  onChange={(e) => setNovoAgendamento({...novoAgendamento, observacoes: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Observações sobre o agendamento..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleFecharModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Salvar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agendamentos;