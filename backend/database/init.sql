-- Inicialização do banco de dados PostgreSQL para Barbearia Hoshirara
-- Este arquivo será executado automaticamente quando o container PostgreSQL for iniciado

-- Criar extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Clientes
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255),
    data_nascimento DATE,
    observacoes TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Barbeiros
CREATE TABLE IF NOT EXISTS barbeiros (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255),
    especialidades TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Serviços
CREATE TABLE IF NOT EXISTS servicos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    duracao INTEGER NOT NULL, -- em minutos
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Agendamentos
CREATE TABLE IF NOT EXISTS agendamentos (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes(id) ON DELETE CASCADE,
    barbeiro_id INTEGER REFERENCES barbeiros(id) ON DELETE SET NULL,
    servico_id INTEGER REFERENCES servicos(id) ON DELETE SET NULL,
    data_hora TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'agendado' CHECK (status IN ('agendado', 'confirmado', 'em_andamento', 'concluido', 'cancelado')),
    observacoes TEXT,
    preco_final DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Movimentações Financeiras
CREATE TABLE IF NOT EXISTS movimentacoes (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('entrada', 'saida')),
    categoria VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_movimentacao TIMESTAMP NOT NULL,
    agendamento_id INTEGER REFERENCES agendamentos(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Usuários (para autenticação)
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'funcionario' CHECK (role IN ('admin', 'funcionario')),
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_clientes_telefone ON clientes(telefone);
CREATE INDEX IF NOT EXISTS idx_clientes_nome ON clientes(nome);
CREATE INDEX IF NOT EXISTS idx_barbeiros_nome ON barbeiros(nome);
CREATE INDEX IF NOT EXISTS idx_agendamentos_data_hora ON agendamentos(data_hora);
CREATE INDEX IF NOT EXISTS idx_agendamentos_cliente ON agendamentos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_barbeiro ON agendamentos(barbeiro_id);
CREATE INDEX IF NOT EXISTS idx_movimentacoes_data ON movimentacoes(data_movimentacao);
CREATE INDEX IF NOT EXISTS idx_movimentacoes_tipo ON movimentacoes(tipo);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_barbeiros_updated_at BEFORE UPDATE ON barbeiros FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_servicos_updated_at BEFORE UPDATE ON servicos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agendamentos_updated_at BEFORE UPDATE ON agendamentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_movimentacoes_updated_at BEFORE UPDATE ON movimentacoes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Dados iniciais de exemplo
INSERT INTO usuarios (nome, email, senha, role) VALUES 
('Administrador', 'admin@barbearia.com', '$2a$12$nQmJgBmOyZ5jLjKqM9iL0uoOFJH5Pv0LH8K8Z8mCqV3eRx2tG9mKr.', 'admin')
ON CONFLICT (email) DO NOTHING; -- senha: Admin123!

INSERT INTO servicos (nome, descricao, preco, duracao) VALUES 
('Corte Simples', 'Corte de cabelo tradicional', 25.00, 30),
('Corte + Barba', 'Corte de cabelo + barba', 35.00, 45),
('Apenas Barba', 'Aparar e modelar barba', 15.00, 20),
('Corte Premium', 'Corte estilizado com acabamento', 40.00, 60),
('Sobrancelha', 'Design de sobrancelha masculina', 10.00, 15)
ON CONFLICT DO NOTHING;

INSERT INTO barbeiros (nome, telefone, email, especialidades) VALUES 
('João Silva', '11999887766', 'joao@barbearia.com', 'Cortes clássicos, Barbas'),
('Pedro Santos', '11988776655', 'pedro@barbearia.com', 'Cortes modernos, Design')
ON CONFLICT (telefone) DO NOTHING;

-- Comentários nas tabelas
COMMENT ON TABLE clientes IS 'Cadastro de clientes da barbearia';
COMMENT ON TABLE barbeiros IS 'Cadastro de barbeiros/funcionários';
COMMENT ON TABLE servicos IS 'Catálogo de serviços oferecidos';
COMMENT ON TABLE agendamentos IS 'Agendamentos de serviços';
COMMENT ON TABLE movimentacoes IS 'Controle financeiro - entradas e saídas';
COMMENT ON TABLE usuarios IS 'Usuários do sistema para autenticação';

-- Mostrar estrutura criada
SELECT 'Banco de dados inicializado com sucesso!' as status;