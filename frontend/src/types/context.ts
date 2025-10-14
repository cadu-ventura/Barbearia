import type { Cliente, Barbeiro, Servico, Agendamento, MovimentacaoFinanceira } from '../types';

export interface AppContextType {
  // Estados
  clientes: Cliente[];
  barbeiros: Barbeiro[];
  servicos: Servico[];
  agendamentos: Agendamento[];
  movimentacoes: MovimentacaoFinanceira[];
  
  // Ações para Clientes
  adicionarCliente: (cliente: Omit<Cliente, 'id'>) => Promise<void>;
  atualizarCliente: (id: string, cliente: Partial<Cliente>) => Promise<void>;
  excluirCliente: (id: string) => Promise<void>;
  
  // Ações para Barbeiros
  adicionarBarbeiro: (barbeiro: Omit<Barbeiro, 'id'>) => Promise<void>;
  atualizarBarbeiro: (id: string, barbeiro: Partial<Barbeiro>) => Promise<void>;
  excluirBarbeiro: (id: string) => Promise<void>;
  
  // Ações para Serviços
  adicionarServico: (servico: Omit<Servico, 'id'>) => Promise<void>;
  atualizarServico: (id: string, servico: Partial<Servico>) => Promise<void>;
  excluirServico: (id: string) => Promise<void>;
  
  // Ações para Agendamentos
  adicionarAgendamento: (agendamento: Omit<Agendamento, 'id'>) => Promise<void>;
  atualizarAgendamento: (id: string, agendamento: Partial<Agendamento>) => Promise<void>;
  excluirAgendamento: (id: string) => Promise<void>;
  
  // Ações para Movimentações Financeiras
  adicionarMovimentacao: (movimentacao: Omit<MovimentacaoFinanceira, 'id'>) => void;
  atualizarMovimentacao: (id: string, movimentacao: Partial<MovimentacaoFinanceira>) => void;
  excluirMovimentacao: (id: string) => Promise<void>;
}