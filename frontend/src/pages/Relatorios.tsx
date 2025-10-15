import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Users, 
  DollarSign, 
  Clock, 
  Award,
  Download
} from 'lucide-react';
import { useAgendamentos } from '../contexts/agendamentos';
import { useBarbeiros } from '../contexts/barbeiros';
import { useClientes } from '../contexts/clientes';
import { useServicos } from '../contexts/servicos';

const Relatorios: React.FC = () => {
  const { items: agendamentos } = useAgendamentos();
  const { items: clientes } = useClientes();
  const { items: barbeiros } = useBarbeiros();
  const { items: servicos } = useServicos();
  
  const [periodoSelecionado, setPeriodoSelecionado] = useState<'7d' | '30d' | '3m' | '1a'>('30d');
  const [relatorioAtivo, setRelatorioAtivo] = useState<'financeiro' | 'agendamentos' | 'barbeiros' | 'clientes' | 'servicos'>('financeiro');

  // TODO: Implementar contexto de movimentações financeiras
  const movimentacoes = useMemo(() => [] as Array<{tipo: 'receita' | 'despesa', valor: number, data: Date | string}>, []); // Placeholder até implementar MovimentacoesContext

  // Função para calcular período
  const calcularPeriodo = (periodo: string) => {
    const hoje = new Date();
    const inicio = new Date();
    
    switch (periodo) {
      case '7d':
        inicio.setDate(hoje.getDate() - 7);
        break;
      case '30d':
        inicio.setDate(hoje.getDate() - 30);
        break;
      case '3m':
        inicio.setMonth(hoje.getMonth() - 3);
        break;
      case '1a':
        inicio.setFullYear(hoje.getFullYear() - 1);
        break;
    }
    
    return { inicio, fim: hoje };
  };

  // Dados filtrados por período
  const dadosPeriodo = useMemo(() => {
    const { inicio, fim } = calcularPeriodo(periodoSelecionado);
    
    const agendamentosFiltrados = agendamentos.filter(ag => {
      const data = new Date(ag.dataHora);
      return data >= inicio && data <= fim;
    });
    
    const movimentacoesFiltradas = movimentacoes.filter(mov => {
      const data = new Date(mov.data);
      return data >= inicio && data <= fim;
    });
    
    return { agendamentosFiltrados, movimentacoesFiltradas, inicio, fim };
  }, [agendamentos, movimentacoes, periodoSelecionado]);

  // Relatório Financeiro
  const relatorioFinanceiro = useMemo(() => {
    const { agendamentosFiltrados, movimentacoesFiltradas } = dadosPeriodo;
    
    const receitaAgendamentos = agendamentosFiltrados
      .filter(ag => ag.status === 'concluido')
      .reduce((total, ag) => total + ag.valorTotal, 0);
    
    const receitas = movimentacoesFiltradas
      .filter(mov => mov.tipo === 'receita')
      .reduce((total, mov) => total + mov.valor, 0);
    
    const despesas = movimentacoesFiltradas
      .filter(mov => mov.tipo === 'despesa')
      .reduce((total, mov) => total + mov.valor, 0);
    
    const receitaTotal = receitaAgendamentos + receitas;
    const lucroLiquido = receitaTotal - despesas;
    
    // Receita por método de pagamento
    const receitaPorPagamento = agendamentosFiltrados
      .filter(ag => ag.status === 'concluido')
      .reduce((acc, ag) => {
        const metodo = 'Dinheiro'; // Assumindo dinheiro como padrão
        acc[metodo] = (acc[metodo] || 0) + ag.valorTotal;
        return acc;
      }, {} as Record<string, number>);
    
    // Receita por dia (últimos 7 dias)
    const receitaPorDia = [];
    const hoje = new Date();
    for (let i = 6; i >= 0; i--) {
      const data = new Date(hoje);
      data.setDate(hoje.getDate() - i);
      const dataStr = data.toISOString().split('T')[0];
      
      const receitaDia = agendamentosFiltrados
        .filter(ag => {
          const agData = new Date(ag.dataHora).toISOString().split('T')[0];
          return agData === dataStr && ag.status === 'concluido';
        })
        .reduce((total, ag) => total + ag.valorTotal, 0);
      
      receitaPorDia.push({
        data: data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        valor: receitaDia
      });
    }
    
    return {
      receitaAgendamentos,
      receitas,
      despesas,
      receitaTotal,
      lucroLiquido,
      receitaPorPagamento,
      receitaPorDia,
      ticketMedio: agendamentosFiltrados.length > 0 ? receitaAgendamentos / agendamentosFiltrados.filter(ag => ag.status === 'concluido').length : 0
    };
  }, [dadosPeriodo]);

  // Relatório de Agendamentos
  const relatorioAgendamentos = useMemo(() => {
    const { agendamentosFiltrados } = dadosPeriodo;
    
    const totalAgendamentos = agendamentosFiltrados.length;
    const agendamentosConcluidos = agendamentosFiltrados.filter(ag => ag.status === 'concluido').length;
    const agendamentosCancelados = agendamentosFiltrados.filter(ag => ag.status === 'cancelado').length;
    const taxaConclusao = totalAgendamentos > 0 ? (agendamentosConcluidos / totalAgendamentos) * 100 : 0;
    const taxaCancelamento = totalAgendamentos > 0 ? (agendamentosCancelados / totalAgendamentos) * 100 : 0;
    
    // Agendamentos por status
    const agendamentosPorStatus = agendamentosFiltrados.reduce((acc, ag) => {
      acc[ag.status] = (acc[ag.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Horários mais populares
    const horariosMaisPopulares = agendamentosFiltrados.reduce((acc, ag) => {
      const hora = new Date(ag.dataHora).getHours();
      const horario = `${hora}:00`;
      acc[horario] = (acc[horario] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Dias da semana mais populares
    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const agendamentosPorDia = agendamentosFiltrados.reduce((acc, ag) => {
      const dia = diasSemana[new Date(ag.dataHora).getDay()];
      acc[dia] = (acc[dia] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalAgendamentos,
      agendamentosConcluidos,
      agendamentosCancelados,
      taxaConclusao,
      taxaCancelamento,
      agendamentosPorStatus,
      horariosMaisPopulares,
      agendamentosPorDia
    };
  }, [dadosPeriodo]);

  // Relatório de Barbeiros
  const relatorioBarbeiros = useMemo(() => {
    const { agendamentosFiltrados } = dadosPeriodo;
    
    const performanceBarbeiros = barbeiros.map(barbeiro => {
      const agendamentosBarbeiro = agendamentosFiltrados.filter(ag => ag.barbeiroId === barbeiro.id);
      const agendamentosConcluidos = agendamentosBarbeiro.filter(ag => ag.status === 'concluido');
      const receita = agendamentosConcluidos.reduce((total, ag) => total + ag.valorTotal, 0);
      const comissao = receita * 0.50; // 50% de comissão padrão
      
      return {
        ...barbeiro,
        totalAgendamentos: agendamentosBarbeiro.length,
        agendamentosConcluidos: agendamentosConcluidos.length,
        receita,
        comissao,
        ticketMedio: agendamentosConcluidos.length > 0 ? receita / agendamentosConcluidos.length : 0,
        taxaConclusao: agendamentosBarbeiro.length > 0 ? (agendamentosConcluidos.length / agendamentosBarbeiro.length) * 100 : 0
      };
    });
    
    return performanceBarbeiros.sort((a, b) => b.receita - a.receita);
  }, [barbeiros, dadosPeriodo]);

  // Relatório de Clientes
  const relatorioClientes = useMemo(() => {
    const { agendamentosFiltrados } = dadosPeriodo;
    
    const clientesAtivos = clientes.filter(cliente => 
      agendamentosFiltrados.some(ag => ag.clienteId === cliente.id)
    );
    
    const clientesComMaisAgendamentos = clientes.map(cliente => {
      const agendamentosCliente = agendamentosFiltrados.filter(ag => ag.clienteId === cliente.id);
      const gastoTotal = agendamentosCliente
        .filter(ag => ag.status === 'concluido')
        .reduce((total, ag) => total + ag.valorTotal, 0);
      
      return {
        ...cliente,
        totalAgendamentos: agendamentosCliente.length,
        gastoTotal,
        ultimoAgendamento: agendamentosCliente.length > 0 ? 
          Math.max(...agendamentosCliente.map(ag => new Date(ag.dataHora).getTime())) : 0
      };
    })
    .filter(cliente => cliente.totalAgendamentos > 0)
    .sort((a, b) => b.gastoTotal - a.gastoTotal);
    
    const novosCLientes = clientes.filter((cliente) => {
      const dataCadastro = cliente.dataCadastro ? new Date(cliente.dataCadastro) : new Date();
      const { inicio } = calcularPeriodo(periodoSelecionado);
      return dataCadastro >= inicio;
    });
    
    return {
      totalClientes: clientes.length,
      clientesAtivos: clientesAtivos.length,
      novosClientes: novosCLientes.length,
      clientesComMaisAgendamentos: clientesComMaisAgendamentos.slice(0, 10),
      ticketMedioCliente: clientesComMaisAgendamentos.length > 0 ? 
        clientesComMaisAgendamentos.reduce((acc: number, c) => acc + c.gastoTotal, 0) / clientesComMaisAgendamentos.length : 0
    };
  }, [clientes, dadosPeriodo, periodoSelecionado]);

  // Relatório de Serviços
  const relatorioServicos = useMemo(() => {
    const { agendamentosFiltrados } = dadosPeriodo;
    
    const servicosMaisPopulares = servicos.map(servico => {
      const vezesAgendado = agendamentosFiltrados.filter(ag => 
        ag.servicoIds.includes(servico.id)
      ).length;
      
      const receitaGerada = agendamentosFiltrados
        .filter(ag => ag.servicoIds.includes(servico.id) && ag.status === 'concluido')
        .reduce((total, ag) => {
          // Calcular proporcionalmente se há múltiplos serviços
          const proporcao = 1 / ag.servicoIds.length;
          return total + (ag.valorTotal * proporcao);
        }, 0);
      
      return {
        ...servico,
        vezesAgendado,
        receitaGerada,
        participacaoReceita: agendamentosFiltrados.length > 0 ? (vezesAgendado / agendamentosFiltrados.length) * 100 : 0
      };
    })
    .sort((a, b) => b.vezesAgendado - a.vezesAgendado);
    
    // Serviços por categoria
    const servicosPorCategoria = servicos.reduce((acc, servico) => {
      const vezesAgendado = agendamentosFiltrados.filter(ag => 
        ag.servicoIds.includes(servico.id)
      ).length;
      
      const categoria = servico.categoria || 'outros';
      acc[categoria] = (acc[categoria] || 0) + vezesAgendado;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      servicosMaisPopulares,
      servicosPorCategoria,
      totalServicosRealizados: agendamentosFiltrados.reduce((total, ag) => total + ag.servicoIds.length, 0)
    };
  }, [servicos, dadosPeriodo]);

  const renderRelatorioFinanceiro = () => (
    <div className="space-y-4 lg:space-y-6">
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Receita Total</p>
              <p className="text-2xl font-bold text-green-600">
                R$ {relatorioFinanceiro.receitaTotal.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-slate-600">Despesa Total</p>
              <p className="text-2xl font-bold text-red-600">
                R$ {relatorioFinanceiro.despesas.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Lucro Líquido</p>
              <p className={`text-2xl font-bold ${relatorioFinanceiro.lucroLiquido >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R$ {relatorioFinanceiro.lucroLiquido.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Ticket Médio</p>
              <p className="text-2xl font-bold text-amber-600">
                R$ {relatorioFinanceiro.ticketMedio.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de receita por dia */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Receita dos Últimos 7 Dias</h3>
        <div className="space-y-3">
          {relatorioFinanceiro.receitaPorDia.map((dia, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-slate-600">{dia.data}</span>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ 
                      width: `${Math.max(5, (dia.valor / Math.max(...relatorioFinanceiro.receitaPorDia.map(d => d.valor))) * 100)}%` 
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-slate-800 min-w-[80px] text-right">
                  R$ {dia.valor.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Receita por método de pagamento */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Receita por Método de Pagamento</h3>
        <div className="space-y-3">
          {Object.entries(relatorioFinanceiro.receitaPorPagamento).map(([metodo, valor]) => (
            <div key={metodo} className="flex items-center justify-between">
              <span className="text-sm text-slate-600">{metodo}</span>
              <span className="text-sm font-medium text-slate-800">
                R$ {valor.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRelatorioAgendamentos = () => (
    <div className="space-y-6">
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total de Agendamentos</p>
              <p className="text-2xl font-bold text-blue-600">
                {relatorioAgendamentos.totalAgendamentos}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Concluídos</p>
              <p className="text-2xl font-bold text-green-600">
                {relatorioAgendamentos.agendamentosConcluidos}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Taxa de Conclusão</p>
              <p className="text-2xl font-bold text-green-600">
                {relatorioAgendamentos.taxaConclusao.toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Taxa de Cancelamento</p>
              <p className="text-2xl font-bold text-red-600">
                {relatorioAgendamentos.taxaCancelamento.toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Horários mais populares */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Horários Mais Populares</h3>
          <div className="space-y-3">
            {Object.entries(relatorioAgendamentos.horariosMaisPopulares)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 6)
              .map(([horario, quantidade]) => (
                <div key={horario} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{horario}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ 
                          width: `${Math.max(10, (quantidade / Math.max(...Object.values(relatorioAgendamentos.horariosMaisPopulares))) * 100)}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-800 min-w-[30px] text-right">
                      {quantidade}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Dias da semana mais populares */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Dias Mais Movimentados</h3>
          <div className="space-y-3">
            {Object.entries(relatorioAgendamentos.agendamentosPorDia)
              .sort(([,a], [,b]) => b - a)
              .map(([dia, quantidade]) => (
                <div key={dia} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{dia}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-amber-500 h-2 rounded-full"
                        style={{ 
                          width: `${Math.max(10, (quantidade / Math.max(...Object.values(relatorioAgendamentos.agendamentosPorDia))) * 100)}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-800 min-w-[30px] text-right">
                      {quantidade}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRelatorioBarbeiros = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">Desempenho dos Barbeiros</h3>
        </div>
        {/* Desktop - Tabela */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Barbeiro</th>
                <th className="text-right p-4 text-sm font-medium text-slate-600">Agendamentos</th>
                <th className="text-right p-4 text-sm font-medium text-slate-600">Concluídos</th>
                <th className="text-right p-4 text-sm font-medium text-slate-600">Taxa Conclusão</th>
                <th className="text-right p-4 text-sm font-medium text-slate-600">Receita Gerada</th>
                <th className="text-right p-4 text-sm font-medium text-slate-600">Comissão</th>
                <th className="text-right p-4 text-sm font-medium text-slate-600">Ticket Médio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {relatorioBarbeiros.map((barbeiro) => (
                <tr key={barbeiro.id} className="hover:bg-slate-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">{barbeiro.nome}</div>
                        <div className="text-sm text-slate-600">{barbeiro.especialidades.join(', ')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right text-slate-800">{barbeiro.totalAgendamentos}</td>
                  <td className="p-4 text-right text-green-600 font-medium">{barbeiro.agendamentosConcluidos}</td>
                  <td className="p-4 text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      barbeiro.taxaConclusao >= 80 ? 'bg-green-100 text-green-800' :
                      barbeiro.taxaConclusao >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {barbeiro.taxaConclusao.toFixed(1)}%
                    </span>
                  </td>
                  <td className="p-4 text-right font-medium text-green-600">
                    R$ {barbeiro.receita.toFixed(2)}
                  </td>
                  <td className="p-4 text-right font-medium text-blue-600">
                    R$ {barbeiro.comissao.toFixed(2)}
                  </td>
                  <td className="p-4 text-right text-slate-800">
                    R$ {barbeiro.ticketMedio.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile - Cards */}
        <div className="lg:hidden divide-y divide-slate-200">
          {relatorioBarbeiros.map((barbeiro) => (
            <div key={barbeiro.id} className="p-4">
              {/* Header do Card */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-800 truncate">{barbeiro.nome}</h4>
                  <p className="text-sm text-slate-600 truncate">{barbeiro.especialidades.join(', ')}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  barbeiro.taxaConclusao >= 80 ? 'bg-green-100 text-green-800' :
                  barbeiro.taxaConclusao >= 60 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {barbeiro.taxaConclusao.toFixed(1)}%
                </span>
              </div>

              {/* Estatísticas */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg">
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-800">{barbeiro.totalAgendamentos}</p>
                  <p className="text-xs text-slate-600">Agendamentos</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-green-600">{barbeiro.agendamentosConcluidos}</p>
                  <p className="text-xs text-slate-600">Concluídos</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-green-600">R$ {barbeiro.receita.toFixed(2)}</p>
                  <p className="text-xs text-slate-600">Receita</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-blue-600">R$ {barbeiro.comissao.toFixed(2)}</p>
                  <p className="text-xs text-slate-600">Comissão</p>
                </div>
              </div>

              {/* Ticket Médio */}
              <div className="mt-2 text-center">
                <span className="text-sm text-slate-600">Ticket Médio: </span>
                <span className="text-sm font-semibold text-slate-800">R$ {barbeiro.ticketMedio.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRelatorioClientes = () => (
    <div className="space-y-6">
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total de Clientes</p>
              <p className="text-2xl font-bold text-blue-600">
                {relatorioClientes.totalClientes}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Clientes Ativos</p>
              <p className="text-2xl font-bold text-green-600">
                {relatorioClientes.clientesAtivos}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Novos Clientes</p>
              <p className="text-2xl font-bold text-amber-600">
                {relatorioClientes.novosClientes}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Ticket Médio</p>
              <p className="text-2xl font-bold text-green-600">
                R$ {relatorioClientes.ticketMedioCliente.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Top clientes */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">Top 10 Clientes por Faturamento</h3>
        </div>
        {/* Desktop - Tabela */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Cliente</th>
                <th className="text-right p-4 text-sm font-medium text-slate-600">Agendamentos</th>
                <th className="text-right p-4 text-sm font-medium text-slate-600">Gasto Total</th>
                <th className="text-right p-4 text-sm font-medium text-slate-600">Ticket Médio</th>
                <th className="text-right p-4 text-sm font-medium text-slate-600">Último Agendamento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {relatorioClientes.clientesComMaisAgendamentos.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-slate-50">
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-slate-800">{cliente.nome}</div>
                      <div className="text-sm text-slate-600">{cliente.telefone}</div>
                    </div>
                  </td>
                  <td className="p-4 text-right text-slate-800">{cliente.totalAgendamentos}</td>
                  <td className="p-4 text-right font-medium text-green-600">
                    R$ {cliente.gastoTotal.toFixed(2)}
                  </td>
                  <td className="p-4 text-right text-slate-800">
                    R$ {(cliente.gastoTotal / cliente.totalAgendamentos).toFixed(2)}
                  </td>
                  <td className="p-4 text-right text-slate-600">
                    {cliente.ultimoAgendamento ? new Date(cliente.ultimoAgendamento).toLocaleDateString('pt-BR') : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile - Cards */}
        <div className="lg:hidden divide-y divide-slate-200">
          {relatorioClientes.clientesComMaisAgendamentos.map((cliente) => (
            <div key={cliente.id} className="p-4">
              {/* Header do Card */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-800 truncate">{cliente.nome}</h4>
                  <p className="text-sm text-slate-600">{cliente.telefone}</p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="text-sm font-semibold text-green-600">R$ {cliente.gastoTotal.toFixed(2)}</p>
                  <p className="text-xs text-slate-600">Total gasto</p>
                </div>
              </div>

              {/* Estatísticas */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg">
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-800">{cliente.totalAgendamentos}</p>
                  <p className="text-xs text-slate-600">Agendamentos</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-800">R$ {(cliente.gastoTotal / cliente.totalAgendamentos).toFixed(2)}</p>
                  <p className="text-xs text-slate-600">Ticket Médio</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-slate-800">
                    {cliente.ultimoAgendamento ? new Date(cliente.ultimoAgendamento).toLocaleDateString('pt-BR') : '-'}
                  </p>
                  <p className="text-xs text-slate-600">Último</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRelatorioServicos = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Serviços mais populares */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800">Serviços Mais Populares</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {relatorioServicos.servicosMaisPopulares.slice(0, 8).map((servico) => (
                <div key={servico.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-slate-800">{servico.nome}</div>
                    <div className="text-sm text-slate-600">{servico.categoria}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-slate-800">{servico.vezesAgendado}x</div>
                    <div className="text-sm text-green-600">R$ {servico.receitaGerada.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Serviços por categoria */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800">Serviços por Categoria</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(relatorioServicos.servicosPorCategoria)
                .sort(([,a], [,b]) => b - a)
                .map(([categoria, quantidade]) => (
                  <div key={categoria} className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">{categoria}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-amber-500 h-2 rounded-full"
                          style={{ 
                            width: `${Math.max(10, (quantidade / Math.max(...Object.values(relatorioServicos.servicosPorCategoria))) * 100)}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-800 min-w-[40px] text-right">
                        {quantidade}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas gerais */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Estatísticas Gerais</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {relatorioServicos.totalServicosRealizados}
            </div>
            <div className="text-sm text-slate-600">Total de Serviços Realizados</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {servicos.length}
            </div>
            <div className="text-sm text-slate-600">Serviços Cadastrados</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600">
              {Object.keys(relatorioServicos.servicosPorCategoria).length}
            </div>
            <div className="text-sm text-slate-600">Categorias Ativas</div>
          </div>
        </div>
      </div>
    </div>
  );

  const periodoLabels = {
    '7d': 'Últimos 7 dias',
    '30d': 'Últimos 30 dias',
    '3m': 'Últimos 3 meses',
    '1a': 'Último ano'
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-1 lg:mb-2">Relatórios</h1>
          <p className="text-slate-600 text-sm lg:text-base">Análises e estatísticas detalhadas da barbearia</p>
        </div>

        {/* Controles */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
          <div className="p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 items-start sm:items-center justify-between">
              {/* Seletor de período */}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 lg:w-5 h-4 lg:h-5 text-slate-600" />
                <select
                  value={periodoSelecionado}
                  onChange={(e) => setPeriodoSelecionado(e.target.value as '7d' | '30d' | '3m' | '1a')}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-sm lg:text-base"
                >
                  {Object.entries(periodoLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Botão de exportação */}
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors text-sm lg:text-base">
                <Download className="w-4 h-4" />
                Exportar PDF
              </button>
            </div>
          </div>
        </div>

        {/* Tabs de relatórios */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
          <div className="border-b border-slate-200">
            <div className="flex overflow-x-auto">
              {[
                { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
                { id: 'agendamentos', label: 'Agendamentos', icon: Calendar },
                { id: 'barbeiros', label: 'Barbeiros', icon: Users },
                { id: 'clientes', label: 'Clientes', icon: Users },
                { id: 'servicos', label: 'Serviços', icon: Award }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setRelatorioAtivo(id as 'financeiro' | 'agendamentos' | 'barbeiros' | 'clientes' | 'servicos')}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium whitespace-nowrap transition-colors ${
                    relatorioAtivo === id
                      ? 'border-amber-500 text-amber-600'
                      : 'border-transparent text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Conteúdo do relatório */}
        <div>
          {relatorioAtivo === 'financeiro' && renderRelatorioFinanceiro()}
          {relatorioAtivo === 'agendamentos' && renderRelatorioAgendamentos()}
          {relatorioAtivo === 'barbeiros' && renderRelatorioBarbeiros()}
          {relatorioAtivo === 'clientes' && renderRelatorioClientes()}
          {relatorioAtivo === 'servicos' && renderRelatorioServicos()}
        </div>
      </div>
    </div>
  );
};

export default Relatorios;