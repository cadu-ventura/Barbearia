import React from 'react';
import { useApp } from '../hooks/useApp';

const Dashboard: React.FC = () => {
  const { clientes, agendamentos, movimentacoes, barbeiros } = useApp();

  // Calcular estatísticas em tempo real
  const totalClientes = clientes.filter(c => c.ativo).length;
  const agendamentosHoje = agendamentos.filter(a => {
    const hoje = new Date();
    const dataAgendamento = new Date(a.dataHora);
    return dataAgendamento.toDateString() === hoje.toDateString();
  }).length;
  
  const receitaMensal = movimentacoes
    .filter(m => m.tipo === 'receita')
    .reduce((acc, m) => acc + m.valor, 0);

  // Dados para próximos agendamentos (se não houver, mostrar mensagem padrão)
  const agendamentosProximos = agendamentos.length > 0 
    ? agendamentos.slice(0, 5).map(a => {
        const cliente = clientes.find(c => c.id === a.clienteId);
        const barbeiro = barbeiros.find(b => b.id === a.barbeiroId);
        return {
          id: a.id,
          cliente: cliente?.nome || 'Cliente',
          servicos: ['Serviço'],
          horario: new Date(a.dataHora).toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          barbeiro: barbeiro?.nome || 'Barbeiro',
          valor: a.valorTotal
        };
      })
    : [];

  // Status dos barbeiros (se não houver, mostrar mensagem padrão)
  const barbeirosStatus = barbeiros.length > 0
    ? barbeiros.map(b => ({
        id: b.id,
        nome: b.nome,
        status: 'disponivel' as const
      }))
    : [];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-4xl font-bold text-slate-800 mb-1 lg:mb-2">
          Dashboard
        </h1>
        <p className="hidden lg:block text-slate-600">
          Gerencie sua barbearia com eficiência e estilo
        </p>
        <p className="lg:hidden text-sm text-slate-600">
          Barbearia Hoshirara
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
        <div className="bg-white p-3 lg:p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-slate-600">Hoje</p>
              <p className="text-xl lg:text-3xl font-bold text-slate-900">{agendamentosHoje}</p>
            </div>
            <div className="w-8 lg:w-12 h-8 lg:h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <span className="text-lg lg:text-2xl">📅</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-3 lg:p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-slate-600">Clientes</p>
              <p className="text-xl lg:text-3xl font-bold text-slate-900">{totalClientes.toLocaleString()}</p>
            </div>
            <div className="w-8 lg:w-12 h-8 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-lg lg:text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-3 lg:p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-slate-600">Receita</p>
              <p className="text-xl lg:text-3xl font-bold text-slate-900">
                R$ {receitaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-8 lg:w-12 h-8 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-lg lg:text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-3 lg:p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-slate-600">Avaliação</p>
              <p className="text-xl lg:text-3xl font-bold text-slate-900">N/A</p>
            </div>
            <div className="w-8 lg:w-12 h-8 lg:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-lg lg:text-2xl">⭐</span>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg lg:text-xl font-bold text-slate-800 mb-4">Próximos Agendamentos</h2>
          <div className="space-y-3 lg:space-y-4">
            {agendamentosProximos.length > 0 ? agendamentosProximos.map((agendamento) => (
              <div key={agendamento.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 lg:p-4 bg-slate-50 rounded-lg gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 text-sm lg:text-base truncate">{agendamento.cliente}</p>
                  <p className="text-xs lg:text-sm text-slate-600 truncate">{agendamento.servicos.join(', ')}</p>
                </div>
                <div className="flex justify-between sm:flex-col sm:text-right sm:shrink-0 text-xs lg:text-sm">
                  <p className="font-medium text-slate-800">{agendamento.horario}</p>
                  <p className="text-slate-600 hidden sm:block">Barbeiro: {agendamento.barbeiro}</p>
                  <p className="text-green-600 font-medium">
                    R$ {agendamento.valor.toFixed(2)}
                  </p>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <p className="text-slate-600">Nenhum agendamento encontrado</p>
                <p className="text-sm text-slate-500">Os agendamentos aparecerão aqui</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg lg:text-xl font-bold text-slate-800 mb-4">Barbeiros em Atividade</h2>
          <div className="space-y-3 lg:space-y-4">
            {barbeirosStatus.length > 0 ? barbeirosStatus.map((barbeiro) => (
              <div key={barbeiro.id} className="flex items-center space-x-3 lg:space-x-4">
                <div className={`w-8 lg:w-10 h-8 lg:h-10 rounded-full flex items-center justify-center ${
                  barbeiro.status === 'disponivel' ? 'bg-green-500' : 'bg-amber-500'
                }`}>
                  <span className="text-white text-xs lg:text-sm font-bold">
                    {barbeiro.nome.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 text-sm lg:text-base truncate">{barbeiro.nome}</p>
                  <p className="text-xs lg:text-sm text-slate-600">
                    {barbeiro.status === 'disponivel' ? 'Disponível' : 'Atendendo cliente'}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full shrink-0 ${
                  barbeiro.status === 'disponivel' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {barbeiro.status === 'disponivel' ? 'Online' : 'Ocupado'}
                </span>
              </div>
            )) : (
              <div className="text-center py-8">
                <p className="text-slate-600">Nenhum barbeiro cadastrado</p>
                <p className="text-sm text-slate-500">Cadastre barbeiros para vê-los aqui</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;