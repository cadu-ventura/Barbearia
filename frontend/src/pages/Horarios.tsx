import React, { useState } from 'react';
import { Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAgendamentos } from '../contexts/agendamentos';
import { useBarbeiros } from '../contexts/barbeiros';
import { useClientes } from '../contexts/clientes';
import { useServicos } from '../contexts/servicos';
import type { Agendamento, Barbeiro, Cliente, Servico } from '../types';

const Horarios: React.FC = () => {
  const { items: agendamentos } = useAgendamentos();
  const { items: barbeiros } = useBarbeiros();
  const { items: clientes } = useClientes();
  const { items: servicos } = useServicos();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [selectedBarbeiro, setSelectedBarbeiro] = useState<string>('todos');
  const [showAvailable, setShowAvailable] = useState(false);

  // Função para navegar entre datas
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    
    setCurrentDate(newDate);
  };

  // Função para obter horários da semana
  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Segunda-feira
    startOfWeek.setDate(diff);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDays.push(date);
    }
    return weekDays;
  };

  // Função para obter agendamentos de uma data específica
  const getAgendamentosForDate = (date: Date) => {
    return agendamentos.filter((agendamento: Agendamento) => {
      const agendamentoDate = new Date(agendamento.dataHora);
      return agendamentoDate.toDateString() === date.toDateString() &&
             (selectedBarbeiro === 'todos' || agendamento.barbeiroId === selectedBarbeiro) &&
             agendamento.status !== 'cancelado';
    });
  };

  // Função para gerar horários disponíveis
  const getHorariosDisponiveis = (date: Date, barbeiroId: string) => {
    const horarios = [];
    const startHour = 8; // 8:00
    const endHour = 18; // 18:00
    const intervalMinutes = 30;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        const horario = new Date(date);
        horario.setHours(hour, minute, 0, 0);
        
        // Verificar se já existe agendamento neste horário
        const ocupado = agendamentos.some((ag: Agendamento) => {
          if (ag.barbeiroId !== barbeiroId) return false;
          const agDate = new Date(ag.dataHora);
          return agDate.getTime() === horario.getTime() && ag.status !== 'cancelado';
        });

        horarios.push({
          horario,
          disponivel: !ocupado && horario > new Date()
        });
      }
    }
    return horarios;
  };

  // Renderização da visualização semanal
  const renderWeekView = () => {
    const weekDays = getWeekDays();
    const horarios = Array.from({ length: 20 }, (_, i) => 8 + i * 0.5); // 8:00 às 18:00

    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {/* Header dos dias */}
        <div className="grid grid-cols-8 border-b border-slate-200">
          <div className="p-4 bg-slate-50 border-r border-slate-200">
            <span className="text-sm font-medium text-slate-600">Horário</span>
          </div>
          {weekDays.map((day, index) => (
            <div key={index} className="p-4 bg-slate-50 text-center border-r border-slate-200 last:border-r-0">
              <div className="text-sm font-medium text-slate-800">
                {day.toLocaleDateString('pt-BR', { weekday: 'short' })}
              </div>
              <div className="text-lg font-bold text-slate-900">
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Grid de horários */}
        <div className="max-h-96 overflow-y-auto">
          {horarios.map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b border-slate-100">
              <div className="p-3 bg-slate-50 border-r border-slate-200 text-sm text-slate-600">
                {Math.floor(hour)}:{hour % 1 === 0 ? '00' : '30'}
              </div>
              {weekDays.map((day, dayIndex) => {
                const dayAgendamentos = getAgendamentosForDate(day);
                const hourAgendamentos = dayAgendamentos.filter((ag: Agendamento) => {
                  const agHour = new Date(ag.dataHora).getHours() + new Date(ag.dataHora).getMinutes() / 60;
                  return Math.abs(agHour - hour) < 0.25;
                });

                return (
                  <div key={`${hour}-${dayIndex}`} className="p-1 border-r border-slate-200 last:border-r-0 min-h-[60px]">
                    {hourAgendamentos.map((agendamento: Agendamento) => {
                      const cliente = clientes.find((c: Cliente) => c.id === agendamento.clienteId);
                      const barbeiro = barbeiros.find((b: Barbeiro) => b.id === agendamento.barbeiroId);
                      const servicosNomes = agendamento.servicoIds.map((id: string) => 
                        servicos.find((s: Servico) => s.id === id)?.nome
                      ).filter((nome): nome is string => !!nome);

                      return (
                        <div 
                          key={agendamento.id}
                          className={`text-xs p-2 rounded mb-1 ${
                            agendamento.status === 'agendado' ? 'bg-blue-100 text-blue-800' :
                            agendamento.status === 'em_andamento' ? 'bg-yellow-100 text-yellow-800' :
                            agendamento.status === 'concluido' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <div className="font-medium truncate">{cliente?.nome}</div>
                          <div className="truncate">{barbeiro?.nome}</div>
                          <div className="truncate">{servicosNomes.join(', ')}</div>
                          <div>{new Date(agendamento.dataHora).toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}</div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Renderização da visualização diária
  const renderDayView = () => {
    const dayAgendamentos = getAgendamentosForDate(currentDate);
    const barbeirosAtivos = barbeiros.filter((b: Barbeiro) => b.ativo);

    return (
      <div className="space-y-6">
        {barbeirosAtivos.map((barbeiro: Barbeiro) => {
          const barbeiroAgendamentos = dayAgendamentos.filter((ag: Agendamento) => ag.barbeiroId === barbeiro.id);
          const horariosDisponiveis = showAvailable ? getHorariosDisponiveis(currentDate, barbeiro.id) : [];

          return (
            <div key={barbeiro.id} className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-4 border-b border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{barbeiro.nome}</h3>
                      <p className="text-sm text-slate-600">
                        {barbeiroAgendamentos.length} agendamentos
                      </p>
                    </div>
                  </div>
                  <button className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-lg text-sm">
                    Novo Agendamento
                  </button>
                </div>
              </div>

              <div className="p-4">
                {barbeiroAgendamentos.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-600">Nenhum agendamento para hoje</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {barbeiroAgendamentos
                      .sort((a: Agendamento, b: Agendamento) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime())
                      .map((agendamento: Agendamento) => {
                        const cliente = clientes.find((c: Cliente) => c.id === agendamento.clienteId);
                        const servicosNomes = agendamento.servicoIds.map((id: string) => 
                          servicos.find((s: Servico) => s.id === id)?.nome
                        ).filter((nome): nome is string => !!nome);

                        return (
                          <div key={agendamento.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                            <div className="text-sm font-medium text-slate-800 min-w-[60px]">
                              {new Date(agendamento.dataHora).toLocaleTimeString('pt-BR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-slate-800">{cliente?.nome}</div>
                              <div className="text-sm text-slate-600">{servicosNomes.join(', ')}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                agendamento.status === 'agendado' ? 'bg-blue-100 text-blue-800' :
                                agendamento.status === 'em_andamento' ? 'bg-yellow-100 text-yellow-800' :
                                agendamento.status === 'concluido' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {agendamento.status === 'agendado' ? 'Agendado' :
                                 agendamento.status === 'em_andamento' ? 'Em Andamento' :
                                 agendamento.status === 'concluido' ? 'Concluído' : 'Cancelado'}
                              </span>
                              <span className="text-sm font-medium text-green-600">
                                R$ {agendamento.valorTotal.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}

                {/* Horários disponíveis */}
                {showAvailable && horariosDisponiveis.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-slate-200">
                    <h4 className="text-sm font-medium text-slate-700 mb-3">Horários Disponíveis</h4>
                    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                      {horariosDisponiveis
                        .filter(h => h.disponivel)
                        .slice(0, 16)
                        .map((horario, index) => (
                          <button
                            key={index}
                            className="px-2 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-800 rounded transition-colors"
                          >
                            {horario.horario.toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Renderização da visualização mensal (calendário)
  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);
    
    while (current <= lastDay || days.length < 42) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {/* Header dos dias da semana */}
        <div className="grid grid-cols-7 border-b border-slate-200">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
            <div key={day} className="p-4 text-center bg-slate-50 text-sm font-medium text-slate-600">
              {day}
            </div>
          ))}
        </div>

        {/* Grid do calendário */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const dayAgendamentos = getAgendamentosForDate(day);
            const isCurrentMonth = day.getMonth() === month;
            const isToday = day.toDateString() === new Date().toDateString();

            return (
              <div 
                key={index}
                className={`min-h-[120px] p-2 border-r border-b border-slate-200 ${
                  !isCurrentMonth ? 'bg-slate-50' : ''
                } ${isToday ? 'bg-amber-50' : ''}`}
              >
                <div className={`text-sm font-medium mb-2 ${
                  !isCurrentMonth ? 'text-slate-400' : 
                  isToday ? 'text-amber-600' : 'text-slate-800'
                }`}>
                  {day.getDate()}
                </div>
                <div className="space-y-1">
                  {dayAgendamentos.slice(0, 3).map((agendamento: Agendamento) => {
                    const cliente = clientes.find((c: Cliente) => c.id === agendamento.clienteId);
                    return (
                      <div 
                        key={agendamento.id}
                        className="text-xs p-1 bg-blue-100 text-blue-800 rounded truncate"
                      >
                        {new Date(agendamento.dataHora).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })} - {cliente?.nome}
                      </div>
                    );
                  })}
                  {dayAgendamentos.length > 3 && (
                    <div className="text-xs text-slate-500">
                      +{dayAgendamentos.length - 3} mais
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const formatDateHeader = () => {
    if (viewMode === 'day') {
      return currentDate.toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } else if (viewMode === 'week') {
      const weekDays = getWeekDays();
      const start = weekDays[0];
      const end = weekDays[6];
      return `${start.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    } else {
      return currentDate.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-4 lg:p-6">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-1 lg:mb-2">Horários</h1>
          <p className="text-slate-600 text-sm lg:text-base">Visualize e gerencie a agenda da barbearia</p>
        </div>

        {/* Controles do calendário */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Navegação de data */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigateDate('prev')}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-600" />
                </button>
                <h2 className="text-xl font-semibold text-slate-800 min-w-[200px] text-center">
                  {formatDateHeader()}
                </h2>
                <button
                  onClick={() => navigateDate('next')}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                >
                  Hoje
                </button>
              </div>

              {/* Controles de visualização */}
              <div className="flex items-center gap-4">
                {/* Filtro por barbeiro */}
                <select
                  value={selectedBarbeiro}
                  onChange={(e) => setSelectedBarbeiro(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-sm"
                >
                  <option value="todos">Todos os Barbeiros</option>
                  {barbeiros.filter((b: Barbeiro) => b.ativo).map((barbeiro: Barbeiro) => (
                    <option key={barbeiro.id} value={barbeiro.id}>
                      {barbeiro.nome}
                    </option>
                  ))}
                </select>

                {/* Toggle horários disponíveis */}
                {viewMode === 'day' && (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showAvailable}
                      onChange={(e) => setShowAvailable(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-slate-700">Mostrar disponíveis</span>
                  </label>
                )}

                {/* Seletor de visualização */}
                <div className="flex bg-slate-100 rounded-lg p-1">
                  {[
                    { mode: 'day', label: 'Dia' },
                    { mode: 'week', label: 'Semana' },
                    { mode: 'month', label: 'Mês' }
                  ].map(({ mode, label }) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode as 'day' | 'week' | 'month')}
                      className={`px-3 py-1 text-sm rounded transition-colors ${
                        viewMode === mode
                          ? 'bg-white text-slate-800 shadow-sm'
                          : 'text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visualização do calendário */}
        {viewMode === 'day' && renderDayView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'month' && renderMonthView()}
      </div>
    </div>
  );
};

export default Horarios;