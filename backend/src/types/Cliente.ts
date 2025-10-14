export interface Cliente {
  id: string;
  nome: string;
  email?: string;
  telefone: string;
  cpf?: string;
  dataNascimento?: Date;
  endereco?: {
    cep: string;
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    complemento?: string;
  };
  ativo: boolean;
  totalAtendimentos: number;
  avaliacaoMedia: number;
  ultimoAtendimento?: Date;
  dataCadastro: Date;
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
  telefone: string;
  cpf?: string;
  data_nascimento?: string;
  endereco_cep?: string;
  endereco_logradouro?: string;
  endereco_numero?: string;
  endereco_bairro?: string;
  endereco_cidade?: string;
  endereco_estado?: string;
  endereco_complemento?: string;
  ativo: number;
  total_atendimentos: number;
  avaliacao_media: number;
  ultimo_atendimento?: string;
  created_at: string;
  updated_at?: string;
}