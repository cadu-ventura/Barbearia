export interface Barbeiro {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  cpf?: string;
  especialidades: string[];
  comissao?: number;
  ativo: boolean;
  totalAtendimentos: number;
  avaliacaoMedia: number;
  dataCadastro: Date;
}

export interface BarbeiroInput {
  nome: string;
  email?: string;
  telefone?: string;
  cpf?: string;
  especialidades: string[];
  comissao?: number;
  ativo?: boolean;
}

export interface BarbeiroDB {
  id: number;
  nome: string;
  email?: string;
  telefone?: string;
  cpf?: string;
  especialidades: string;
  comissao?: number;
  ativo: number;
  total_atendimentos: number;
  avaliacao_media: number;
  created_at: string;
  updated_at?: string;
}