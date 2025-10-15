export interface Cliente {
  id: string;
  nome: string;
  email?: string;
  telefone: string;
  cpf?: string;
  dataNascimento?: string;
  observacoes?: string;
  ativo: boolean;
  totalAtendimentos?: number;
  avaliacaoMedia?: number;
  ultimoAtendimento?: Date;
  dataCadastro?: string;
}

export interface ClienteInput {
  nome: string;
  email?: string;
  telefone: string;
  cpf?: string;
  dataNascimento?: string;
  endereco?: {
    cep: string;
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    complemento?: string;
  };
  ativo?: boolean;
}

export interface ClienteDB {
  id: number;
  nome: string;
  email?: string;
  telefone?: string;
  data_nascimento?: string;
  observacoes?: string;
  ativo: number;
  created_at: string;
  updated_at?: string;
}