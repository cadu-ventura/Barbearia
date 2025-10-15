// Tipos unificados do sistema da Barbearia

export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  dataNascimento?: string;
  observacoes?: string;
  ativo?: boolean;
  dataCadastro?: Date;
  totalAtendimentos?: number;
  ultimoAtendimento?: Date;
}

export interface Barbeiro {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  cpf?: string;
  especialidades: string[];
  ativo: boolean;
  comissao?: number;
  horarioTrabalho?: string;
  totalAtendimentos?: number;
  dataCadastro?: Date | string;
  avaliacaoMedia?: number;
}

export interface Servico {
  id: string;
  nome: string;
  preco: number;
  duracao: number;
  ativo: boolean;
  categoria?: string;
  descricao?: string;
  comissaoBarbeiro?: number;
}

export interface Agendamento {
  id: string;
  clienteId: string;
  barbeiroId: string;
  servicoIds: string[];
  dataHora: string | Date;
  status: 'agendado' | 'em_andamento' | 'concluido' | 'cancelado' | 'nao_compareceu';
  observacoes?: string;
  valorTotal: number;
  formaPagamento?: string;
}

export interface MovimentacaoFinanceira {
  id: string;
  tipo: 'receita' | 'despesa';
  valor: number;
  descricao: string;
  categoria: string;
  data: string;
  agendamentoId?: string;
  barbeiroId?: string;
  formaPagamento?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Tipos para contexto da aplicação
export interface AppContextType {
  // Estados principais
  clientes: Cliente[];
  barbeiros: Barbeiro[];
  servicos: Servico[];
  agendamentos: Agendamento[];
  movimentacoes: MovimentacaoFinanceira[];
  
  // Estados de carregamento
  isLoading: boolean;
  
  // Funções CRUD
  adicionarCliente: (cliente: Omit<Cliente, 'id'>) => Promise<void>;
  editarCliente: (id: string, cliente: Partial<Cliente>) => Promise<void>;
  removerCliente: (id: string) => Promise<void>;
  
  adicionarBarbeiro: (barbeiro: Omit<Barbeiro, 'id'>) => Promise<void>;
  editarBarbeiro: (id: string, barbeiro: Partial<Barbeiro>) => Promise<void>;
  removerBarbeiro: (id: string) => Promise<void>;
  
  adicionarServico: (servico: Omit<Servico, 'id'>) => Promise<void>;
  editarServico: (id: string, servico: Partial<Servico>) => Promise<void>;
  removerServico: (id: string) => Promise<void>;
  
  adicionarAgendamento: (agendamento: Omit<Agendamento, 'id'>) => Promise<void>;
  editarAgendamento: (id: string, agendamento: Partial<Agendamento>) => Promise<void>;
  removerAgendamento: (id: string) => Promise<void>;
  
  adicionarMovimentacao: (movimentacao: Omit<MovimentacaoFinanceira, 'id'>) => Promise<void>;
  editarMovimentacao: (id: string, movimentacao: Partial<MovimentacaoFinanceira>) => Promise<void>;
  removerMovimentacao: (id: string) => Promise<void>;
  
  // Função para recarregar dados
  recarregarDados: () => Promise<void>;
}