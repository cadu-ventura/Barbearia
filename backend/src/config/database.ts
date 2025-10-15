import { Pool, PoolClient } from 'pg';

export type DatabaseType = 'postgresql';

export interface DatabaseConfig {
  type: DatabaseType;
  postgresql: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    ssl?: boolean;
  };
}

export interface DatabaseConnection {
  run: (sql: string, params?: any[]) => Promise<{ lastID?: number; changes?: number }>;
  get: (sql: string, params?: any[]) => Promise<any>;
  all: (sql: string, params?: any[]) => Promise<any[]>;
  close: () => Promise<void>;
}



class PostgreSQLConnection implements DatabaseConnection {
  private pool: Pool;

  constructor(config: NonNullable<DatabaseConfig['postgresql']>) {
    this.pool = new Pool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      ssl: config.ssl ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  private convertSQLiteToPostgreSQL(sql: string): string {
    // Converter sintaxe SQLite para PostgreSQL
    let convertedSql = sql
      // AUTOINCREMENT -> SERIAL
      .replace(/INTEGER PRIMARY KEY AUTOINCREMENT/gi, 'SERIAL PRIMARY KEY')
      // DATETIME -> TIMESTAMP
      .replace(/DATETIME/gi, 'TIMESTAMP')
      // BOOLEAN
      .replace(/BOOLEAN DEFAULT 1/gi, 'BOOLEAN DEFAULT TRUE')
      .replace(/BOOLEAN DEFAULT 0/gi, 'BOOLEAN DEFAULT FALSE')
      // VARCHAR sem limite -> TEXT
      .replace(/VARCHAR\(\d+\)/gi, 'VARCHAR($1)')
      // CURRENT_TIMESTAMP
      .replace(/CURRENT_TIMESTAMP/gi, 'CURRENT_TIMESTAMP');

    // Converter placeholders ? para $1, $2, $3...
    let paramIndex = 1;
    convertedSql = convertedSql.replace(/\?/g, () => `$${paramIndex++}`);

    return convertedSql;
  }

  async run(sql: string, params?: any[]): Promise<{ lastID?: number; changes?: number }> {
    const client = await this.pool.connect();
    try {
      const convertedSQL = this.convertSQLiteToPostgreSQL(sql);
      
      // Se for INSERT, tentar retornar o ID
      if (convertedSQL.trim().toUpperCase().startsWith('INSERT')) {
        const insertSQL = convertedSQL + ' RETURNING id';
        const result = await client.query(insertSQL, params);
        return { 
          lastID: result.rows[0]?.id, 
          changes: result.rowCount || 0 
        };
      } else {
        const result = await client.query(convertedSQL, params);
        return { changes: result.rowCount || 0 };
      }
    } finally {
      client.release();
    }
  }

  async get(sql: string, params?: any[]): Promise<any> {
    const client = await this.pool.connect();
    try {
      const convertedSQL = this.convertSQLiteToPostgreSQL(sql);
      const result = await client.query(convertedSQL, params);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  async all(sql: string, params?: any[]): Promise<any[]> {
    const client = await this.pool.connect();
    try {
      const convertedSQL = this.convertSQLiteToPostgreSQL(sql);
      const result = await client.query(convertedSQL, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

export function getDatabaseConfig(): DatabaseConfig {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (databaseUrl && databaseUrl.startsWith('postgres')) {
    // Parse DATABASE_URL (formato: postgres://user:password@host:port/database)
    try {
      const url = new URL(databaseUrl);
      return {
        type: 'postgresql',
        postgresql: {
          host: url.hostname,
          port: parseInt(url.port) || 5432,
          database: url.pathname.slice(1), // Remove leading slash
          user: url.username,
          password: url.password,
          ssl: url.searchParams.get('ssl') === 'true' && process.env.NODE_ENV === 'production'
        }
      };
    } catch (error) {
      console.error('❌ Erro ao parsear DATABASE_URL:', error);
      throw new Error(`DATABASE_URL inválida: ${databaseUrl}`);
    }
  } else {
    // Configuração manual PostgreSQL
    return {
      type: 'postgresql',
      postgresql: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'barbearia_hoshirara',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres123',
        ssl: process.env.DB_SSL === 'true' && process.env.NODE_ENV === 'production'
      }
    };
  }
}

export async function createDatabaseConnection(): Promise<DatabaseConnection> {
  const config = getDatabaseConfig();
  
  console.log(`🔌 Conectando ao banco: ${config.type.toUpperCase()}`);
  
  const connection = new PostgreSQLConnection(config.postgresql);
  
  // Testar conexão
  try {
    await connection.get('SELECT 1');
    console.log('✅ Conexão PostgreSQL estabelecida');
  } catch (error) {
    console.error('❌ Erro ao conectar PostgreSQL:', error);
    throw error;
  }
  
  return connection;
}

// Singleton para conexão global
let globalConnection: DatabaseConnection | null = null;

export async function getGlobalDatabaseConnection(): Promise<DatabaseConnection> {
  if (!globalConnection) {
    globalConnection = await createDatabaseConnection();
  }
  return globalConnection;
}

export async function closeDatabaseConnection(): Promise<void> {
  if (globalConnection) {
    await globalConnection.close();
    globalConnection = null;
    console.log('✅ Conexão com banco fechada');
  }
}