import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getGlobalDatabaseConnection, closeDatabaseConnection } from './config/database';

// Importar middlewares de segurança
import { securityHeaders, generalRateLimit, sanitizeInput } from './middleware/security';

// Importar rotas
import clientesRoutes from './routes/clientes';
import agendamentosRoutes from './routes/agendamentos';
import barbeirosRoutes from './routes/barbeiros';
import servicosRoutes from './routes/servicos';
import financeiroRoutes from './routes/financeiro';
import authRoutes from './routes/auth';
import { swaggerUi, specs } from './config/swagger';

// Configuração do ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware para adicionar o banco nas requests
app.use(async (req: any, res: Response, next: NextFunction) => {
  try {
    req.db = await getGlobalDatabaseConnection();
    next();
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:', error);
    res.status(500).json({
      success: false,
      message: 'Erro de conexão com banco de dados'
    });
  }
});

// Middlewares de segurança
app.use(securityHeaders);
app.use(generalRateLimit);
app.use(sanitizeInput);

// Middlewares básicos
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    process.env.FRONTEND_URL || ''
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API da Barbearia Hoshirara funcionando!',
    timestamp: new Date().toISOString(),
    version: '2.0.0-ts'
  });
});

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .scheme-container { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
  `,
  customSiteTitle: "Barbearia Hoshirara API",
  customfavIcon: "/favicon.ico"
}));

// Rota para JSON da documentação
app.get('/api-docs.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

// Rotas da API
app.use('/api/clientes', clientesRoutes);
app.use('/api/agendamentos', agendamentosRoutes);
app.use('/api/barbeiros', barbeirosRoutes);
app.use('/api/servicos', servicosRoutes);
app.use('/api/financeiro', financeiroRoutes);
app.use('/api/auth', authRoutes);

// Middleware de tratamento de erros
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Erro não tratado:', err);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor'
  });
});

// Middleware para rotas não encontradas
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Inicializar servidor
const server = app.listen(PORT, () => {
  console.log('🚀 Servidor rodando na porta ' + PORT);
  console.log('🌐 Frontend URL: http://localhost:5173');
  console.log('📊 API URL: http://localhost:' + PORT + '/api');
  console.log('� Swagger Docs: http://localhost:' + PORT + '/api-docs');
  console.log('�🔒 Executando com TypeScript e segurança aprimorada');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📡 Recebido SIGTERM, fechando servidor...');
  server.close(async () => {
    console.log('✅ Servidor fechado');
    try {
      await closeDatabaseConnection();
      process.exit(0);
    } catch (error) {
      console.error('❌ Erro ao fechar banco:', error);
      process.exit(1);
    }
  });
});

process.on('SIGINT', () => {
  console.log('📡 Recebido SIGINT, fechando servidor...');
  server.close(async () => {
    console.log('✅ Servidor fechado');
    try {
      await closeDatabaseConnection();
      process.exit(0);
    } catch (error) {
      console.error('❌ Erro ao fechar banco:', error);
      process.exit(1);
    }
  });
});

export default app;