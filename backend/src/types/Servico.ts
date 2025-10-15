export interface Servico {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  duracao: number; // em minutos
  categoria: string;
  ativo: boolean;
  dataCadastro: Date;
}

export interface ServicoInput {
  nome: string;
  descricao?: string;
  preco: number;
  duracao: number;
  categoria: string;
  ativo?: boolean;
}

export interface ServicoDB {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
  duracao: number;
  ativo: number;
  data_cadastro: string;
  data_atualizacao?: string;
}