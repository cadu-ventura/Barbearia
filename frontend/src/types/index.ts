// Tipos principais do sistema da Barbearia

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf?: string;
  dataNascimento?: Date;
  endereco?: Endereco;
  observacoes?: string;
  ativo: boolean;
  dataCadastro: Date;
  ultimoAtendimento?: Date;
  totalAtendimentos: number;
}

export interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface Barbeiro {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  especialidades: string[];
  comissao: number; // porcentagem
  ativo: boolean;
  horarioTrabalho: HorarioTrabalho[];
  totalAtendimentos: number;
  dataCadastro: Date;
}

export interface HorarioTrabalho {
  diaSemana: number; // 0-6 (domingo-sábado)
  horaInicio: string; // "08:00"
  horaFim: string; // "18:00"
  intervaloInicio?: string; // "12:00"
  intervaloFim?: string; // "13:00"
}

export interface Servico {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  duracao: number; // em minutos
  categoria: CategoriaServico;
  ativo: boolean;
  comissaoBarbeiro: number; // porcentagem
}

export type CategoriaServico = 'corte' | 'barba' | 'sobrancelha' | 'hidratacao' | 'combo' | 'outros';

export interface Agendamento {
  id: string;
  clienteId: string;
  barbeiroId: string;
  servicoIds: string[];
  dataHora: Date;
  status: StatusAgendamento;
  observacoes?: string;
  valorTotal: number;
  formaPagamento?: FormaPagamento;
  dataCriacao: Date;
  dataAtualizacao: Date;
}

export type StatusAgendamento = 'agendado' | 'em_andamento' | 'concluido' | 'cancelado' | 'nao_compareceu';

export type FormaPagamento = 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix' | 'outros';

export interface MovimentacaoFinanceira {
  id: string;
  tipo: TipoMovimentacao;
  valor: number;
  descricao: string;
  categoria: CategoriaFinanceira;
  data: Date;
  agendamentoId?: string;
  barbeiroId?: string;
  formaPagamento?: FormaPagamento;
}

export type TipoMovimentacao = 'receita' | 'despesa';

export type CategoriaFinanceira = 'servico' | 'comissao' | 'produto' | 'aluguel' | 'energia' | 'agua' | 'internet' | 'material' | 'marketing' | 'outros';

export interface ConfiguracaoSistema {
  id: string;
  nomeEmpresa: string;
  telefone: string;
  email: string;
  endereco: Endereco;
  horarioFuncionamento: HorarioTrabalho[];
  intervaloPadrao: number; // minutos entre agendamentos
  antecedenciaMinima: number; // horas
  antecedenciaMaxima: number; // dias
  permiteAgendamentoWeekend: boolean;
  valorComissaoPadrao: number;
}

// Tipos para relatórios e estatísticas
export interface EstatisticasDashboard {
  agendamentosHoje: number;
  clientesAtivos: number;
  receitaMensal: number;
  agendamentosProximos: AgendamentoResumo[];
  barbeirosStatus: BarbeiroStatus[];
}

export interface AgendamentoResumo {
  id: string;
  cliente: string;
  servicos: string[];
  barbeiro: string;
  horario: string;
  valor: number;
}

export interface BarbeiroStatus {
  id: string;
  nome: string;
  status: 'disponivel' | 'ocupado' | 'ausente';
  proximoAtendimento?: string;
}

export interface RelatorioVendas {
  periodo: string;
  totalVendas: number;
  quantidadeAtendimentos: number;
  ticketMedio: number;
  servicosMaisVendidos: ServicoVendas[];
  vendasPorBarbeiro: VendasBarbeiro[];
}

export interface ServicoVendas {
  servico: string;
  quantidade: number;
  receita: number;
}

export interface VendasBarbeiro {
  nome: string;
  atendimentos: number;
  receita: number;
  comissao: number;
}