export type StatusAgendamento = 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado';
export type FormaPagamento = 'dinheiro' | 'cartao_debito' | 'cartao_credito' | 'pix' | 'transferencia';

export interface Agendamento {
  id: string;
  clienteId: string;
  barbeiroId: string;
  dataHora: Date;
  servicoIds: string[];
  valorTotal: number;
  status: StatusAgendamento;
  observacoes?: string;
  formaPagamento?: FormaPagamento;
  dataCadastro: Date;
  // Dados relacionados (joins)
  clienteNome?: string;
  barbeiroNome?: string;
  servicos?: {
    id: string;
    nome: string;
    preco: number;
    duracao: number;
  }[];
}

export interface AgendamentoInput {
  clienteId: string;
  barbeiroId: string;
  dataHora: string;
  servicoIds: string[];
  valorTotal: number;
  status?: StatusAgendamento;
  observacoes?: string;
  formaPagamento?: FormaPagamento;
}

export interface AgendamentoDB {
  id: number;
  cliente_id: number;
  barbeiro_id: number;
  data_hora: string;
  servico_ids: string;
  valor_total: number;
  status: StatusAgendamento;
  observacoes?: string;
  forma_pagamento?: FormaPagamento;
  created_at: string;
  updated_at?: string;
  // Campos de join
  cliente_nome?: string;
  barbeiro_nome?: string;
}