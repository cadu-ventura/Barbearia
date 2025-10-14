export type TipoMovimentacao = 'receita' | 'despesa';

export interface MovimentacaoFinanceira {
  id: string;
  tipo: TipoMovimentacao;
  categoria: string;
  descricao: string;
  valor: number;
  data: Date;
  agendamentoId?: string;
  observacoes?: string;
  dataCadastro: Date;
}

export interface MovimentacaoFinanceiraInput {
  tipo: TipoMovimentacao;
  categoria: string;
  descricao: string;
  valor: number;
  data: string;
  agendamentoId?: string;
  observacoes?: string;
}

export interface MovimentacaoFinanceiraDB {
  id: number;
  tipo: TipoMovimentacao;
  categoria: string;
  descricao: string;
  valor: number;
  data: string;
  agendamento_id?: number;
  observacoes?: string;
  created_at: string;
  updated_at?: string;
}

export interface ResumoFinanceiro {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  receitasPorCategoria: { categoria: string; total: number }[];
  despesasPorCategoria: { categoria: string; total: number }[];
}