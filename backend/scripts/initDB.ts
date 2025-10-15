import bcrypt from 'bcryptjs';
import { createDatabaseConnection, DatabaseConnection } from '../src/config/database';

async function initDatabase() {
  let db: DatabaseConnection | null = null;
  
  try {
    db = await createDatabaseConnection();
    console.log('✅ Conectado ao banco de dados');
    
    // Criar tabela de usuários
    await db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'funcionario', 'barbeiro')),
        ativo BOOLEAN DEFAULT 1,
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
        data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabela users criada');

    // Criar tabela de clientes
    await db.run(`
      CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome VARCHAR(100) NOT NULL,
        telefone VARCHAR(20),
        email VARCHAR(255),
        data_nascimento DATE,
        observacoes TEXT,
        ativo BOOLEAN DEFAULT 1,
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
        data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabela clientes criada');

    // Criar tabela de barbeiros
    await db.run(`
      CREATE TABLE IF NOT EXISTS barbeiros (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome VARCHAR(100) NOT NULL,
        telefone VARCHAR(20),
        email VARCHAR(255),
        especialidades TEXT,
        comissao DECIMAL(5,2) DEFAULT 0.00,
        ativo BOOLEAN DEFAULT 1,
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
        data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabela barbeiros criada');

    // Criar tabela de serviços
    await db.run(`
      CREATE TABLE IF NOT EXISTS servicos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome VARCHAR(100) NOT NULL,
        descricao TEXT,
        preco DECIMAL(10,2) NOT NULL,
        duracao INTEGER NOT NULL,
        ativo BOOLEAN DEFAULT 1,
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
        data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabela servicos criada');

    // Criar tabela de agendamentos
    await db.run(`
      CREATE TABLE IF NOT EXISTS agendamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER NOT NULL,
        barbeiro_id INTEGER NOT NULL,
        servico_id INTEGER NOT NULL,
        data_agendamento DATETIME NOT NULL,
        status VARCHAR(20) DEFAULT 'agendado' CHECK (status IN ('agendado', 'confirmado', 'em_andamento', 'concluido', 'cancelado')),
        observacoes TEXT,
        valor DECIMAL(10,2),
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
        data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id),
        FOREIGN KEY (barbeiro_id) REFERENCES barbeiros(id),
        FOREIGN KEY (servico_id) REFERENCES servicos(id)
      )
    `);
    console.log('✅ Tabela agendamentos criada');

    // Criar tabela de movimentações financeiras
    await db.run(`
      CREATE TABLE IF NOT EXISTS movimentacoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('entrada', 'saida')),
        categoria VARCHAR(50) NOT NULL,
        descricao TEXT,
        valor DECIMAL(10,2) NOT NULL,
        data_movimentacao DATE NOT NULL,
        agendamento_id INTEGER,
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (agendamento_id) REFERENCES agendamentos(id)
      )
    `);
    console.log('✅ Tabela movimentacoes criada');

    // Verificar se já existe um usuário admin
    const adminExists = await db.get('SELECT id FROM users WHERE role = ? LIMIT 1', ['admin']);

    if (!adminExists) {
      // Criar usuário admin padrão
      const adminPassword = await bcrypt.hash('admin123', 12);
      
      await db.run(`
        INSERT INTO users (nome, email, password_hash, role)
        VALUES (?, ?, ?, ?)
      `, ['Administrador', 'admin@hoshirara.com', adminPassword, 'admin']);
      
      console.log('✅ Usuário admin criado (email: admin@hoshirara.com, senha: admin123)');
    } else {
      console.log('ℹ️ Usuário admin já existe');
    }

    // Inserir alguns dados de exemplo se as tabelas estiverem vazias
    const clienteExists = await db.get('SELECT id FROM clientes LIMIT 1');

    if (!clienteExists) {
      // Inserir clientes de exemplo
      const clientes = [
        ['João Silva', '(11) 99999-1111', 'joao@email.com', '1990-05-15'],
        ['Maria Santos', '(11) 99999-2222', 'maria@email.com', '1985-08-22'],
        ['Carlos Oliveira', '(11) 99999-3333', 'carlos@email.com', '1992-12-10']
      ];

      for (const cliente of clientes) {
        await db.run(`
          INSERT INTO clientes (nome, telefone, email, data_nascimento)
          VALUES (?, ?, ?, ?)
        `, cliente);
      }
      
      console.log('✅ Clientes de exemplo inseridos');
    }

    // Inserir barbeiros de exemplo
    const barbeiroExists = await db.get('SELECT id FROM barbeiros LIMIT 1');

    if (!barbeiroExists) {
      const barbeiros = [
        ['Pedro Cortes', '(11) 98888-1111', 'pedro@hoshirara.com', 'Corte masculino, Barba', 15.00],
        ['Ana Style', '(11) 98888-2222', 'ana@hoshirara.com', 'Corte feminino, Coloração', 20.00],
        ['Roberto Navalha', '(11) 98888-3333', 'roberto@hoshirara.com', 'Corte tradicional, Bigode', 12.50]
      ];

      for (const barbeiro of barbeiros) {
        await db.run(`
          INSERT INTO barbeiros (nome, telefone, email, especialidades, comissao)
          VALUES (?, ?, ?, ?, ?)
        `, barbeiro);
      }
      
      console.log('✅ Barbeiros de exemplo inseridos');
    }

    // Inserir serviços de exemplo
    const servicoExists = await db.get('SELECT id FROM servicos LIMIT 1');

    if (!servicoExists) {
      const servicos = [
        ['Corte Masculino', 'Corte tradicional masculino com máquina e tesoura', 25.00, 30],
        ['Corte + Barba', 'Corte masculino completo com barba', 40.00, 45],
        ['Corte Feminino', 'Corte feminino com lavagem', 35.00, 60],
        ['Barba', 'Aparar e modelar barba', 20.00, 20],
        ['Bigode', 'Aparar e modelar bigode', 15.00, 15],
        ['Sobrancelha', 'Aparar sobrancelha masculina', 10.00, 10]
      ];

      for (const servico of servicos) {
        await db.run(`
          INSERT INTO servicos (nome, descricao, preco, duracao)
          VALUES (?, ?, ?, ?)
        `, servico);
      }
      
      console.log('✅ Serviços de exemplo inseridos');
    }

    console.log('🎉 Banco de dados inicializado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao inicializar banco:', error);
    throw error;
  } finally {
    if (db) {
      await db.close();
    }
  }
}

// Executar se for chamado diretamente
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('✅ Inicialização completa');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erro na inicialização:', error);
      process.exit(1);
    });
}

export default initDatabase;