import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { User, UserInput, UserDB, LoginCredentials, AuthResponse, JWTPayload } from '../types';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// Lista de tokens invalidados (blacklist) - em produção usar Redis
const tokenBlacklist = new Set<string>();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary:  Fazer login no sistema
 *     description: Autentica um usuário e retorna um token JWT para acesso às rotas protegidas
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             admin:
 *               summary: Login como Admin
 *               value:
 *                 email: "admin@hoshirara.com"
 *                 password: "admin123"
 *             funcionario:
 *               summary: Login como Funcionário
 *               value:
 *                 email: "funcionario@hoshirara.com"
 *                 password: "func123"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Dados de login inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary:  Registrar novo usuário (Admin apenas)
 *     description: Cria um novo usuário no sistema (apenas administradores podem executar)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           examples:
 *             funcionario:
 *               summary: Registrar Funcionário
 *               value:
 *                 nome: "Maria Silva"
 *                 email: "maria@hoshirara.com"
 *                 password: "MinhaSenh@123"
 *                 role: "funcionario"
 *             barbeiro:
 *               summary: Registrar Barbeiro
 *               value:
 *                 nome: "Carlos Santos"
 *                 email: "carlos@hoshirara.com"
 *                 password: "MinhaSenh@456"
 *                 role: "barbeiro"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Usuario'
 *                 message:
 *                   type: string
 *                   example: "Usuário criado com sucesso"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Email já está em uso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', [
  body('nome')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  
  body('email')
    .isEmail()
    .withMessage('Email deve ser válido')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Senha deve ter pelo menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial'),
  
  body('role')
    .isIn(['admin', 'funcionario', 'barbeiro'])
    .withMessage('Role deve ser admin, funcionario ou barbeiro')
], async (req: any, res: Response): Promise<any> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const userData: UserInput = req.body;

    // Verificar se o email já existe
    const existingUser = await req.db.get(
      'SELECT id FROM usuarios WHERE email = ?',
      [userData.email]
    ) as UserDB | undefined;

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email já está em uso'
      });
    }

    // Hash da senha
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(userData.password, saltRounds);

    // Inserir usuário no banco
    const result = await req.db.run(`
      INSERT INTO usuarios (nome, email, senha, role, ativo)
      VALUES (?, ?, ?, ?, ?)
    `, [userData.nome, userData.email, passwordHash, userData.role, true]);

    const newUser: Partial<User> = {
      id: result.lastID?.toString(),
      nome: userData.nome,
      email: userData.email,
      role: userData.role,
      ativo: true,
      dataCadastro: new Date()
    };

    res.status(201).json({
      success: true,
      data: newUser,
      message: 'Usuário criado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Login
router.post('/login', [
  body('email')
    .isEmail()
    .withMessage('Email deve ser válido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória')
], async (req: any, res: Response): Promise<any> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const credentials: LoginCredentials = req.body;

    // Buscar usuário por email
    const user = await req.db.get(`
      SELECT id, nome, email, senha, role, ativo 
      FROM usuarios 
      WHERE email = ?
    `, [credentials.email]) as UserDB | undefined;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    // Verificar se o usuário está ativo
    if (!user.ativo) {
      return res.status(401).json({
        success: false,
        message: 'Usuário desativado'
      });
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(credentials.password, user.senha);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    // Gerar token JWT
    const tokenPayload: JWTPayload = {
      userId: user.id.toString(),
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { 
      expiresIn: '24h' 
    });

    const authResponse: AuthResponse = {
      success: true,
      token,
      user: {
        id: user.id.toString(),
        nome: user.nome,
        email: user.email,
        role: user.role
      },
      message: 'Login realizado com sucesso'
    };

    res.json(authResponse);
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/auth/verify:
 *   get:
 *     summary:  Verificar token JWT
 *     description: Verifica se o token JWT está válido e retorna informações do usuário
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "1"
 *                     email:
 *                       type: string
 *                       example: "admin@hoshirara.com"
 *                     role:
 *                       type: string
 *                       example: "admin"
 *       401:
 *         description: Token não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Token inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/verify', async (req: Request, res: Response): Promise<any> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token não fornecido'
      });
    }

    // Verificar se o token está na blacklist
    if (tokenBlacklist.has(token)) {
      return res.status(403).json({
        success: false,
        message: 'Token foi invalidado'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    
    res.json({
      success: true,
      user: {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role
      }
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      message: 'Token inválido'
    });
  }
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary:  Fazer logout do sistema
 *     description: Invalida o token JWT atual, removendo o acesso do usuário
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Logout realizado com sucesso"
 *       401:
 *         description: Token não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Token inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/logout', async (req: Request, res: Response): Promise<any> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token não fornecido'
      });
    }

    try {
      // Verificar se o token é válido antes de invalidar
      jwt.verify(token, JWT_SECRET) as JWTPayload;
      
      // Adicionar token à blacklist
      tokenBlacklist.add(token);
      
      res.json({
        success: true,
        message: 'Logout realizado com sucesso'
      });
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: 'Token inválido'
      });
    }
  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary:  Renovar token JWT
 *     description: Gera um novo token JWT baseado no token atual (mesmo que expirado)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token renovado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   description: Novo token JWT
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 message:
 *                   type: string
 *                   example: "Token renovado com sucesso"
 *       401:
 *         description: Token não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Token inválido para renovação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/refresh', async (req: Request, res: Response): Promise<any> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token não fornecido'
      });
    }

    // Verificar se o token está na blacklist
    if (tokenBlacklist.has(token)) {
      return res.status(403).json({
        success: false,
        message: 'Token foi invalidado'
      });
    }

    // Verificar token mesmo que expirado (para refresh)
    const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true }) as JWTPayload;
    
    // Invalidar token antigo
    tokenBlacklist.add(token);
    
    // Gerar novo token
    const newTokenPayload: JWTPayload = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    const newToken = jwt.sign(newTokenPayload, JWT_SECRET, { 
      expiresIn: '24h' 
    });

    res.json({
      success: true,
      token: newToken,
      message: 'Token renovado com sucesso'
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      message: 'Token inválido para renovação'
    });
  }
});

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary:  Listar usuários (Admin apenas)
 *     description: Lista todos os usuários cadastrados no sistema (apenas administradores)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Usuario'
 *                 message:
 *                   type: string
 *                   example: "Usuários listados com sucesso"
 *       401:
 *         description: Token não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Acesso negado - Apenas administradores
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/users', async (req: any, res: Response): Promise<any> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token não fornecido'
      });
    }

    // Verificar se o token está na blacklist
    if (tokenBlacklist.has(token)) {
      return res.status(403).json({
        success: false,
        message: 'Token foi invalidado'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    
    // Verificar se é admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Apenas administradores podem listar usuários'
      });
    }

    // Buscar todos os usuários (exceto senhas)
    const users = await req.db.all(`
      SELECT id, nome, email, role, ativo, created_at 
      FROM usuarios 
      ORDER BY nome ASC
    `) as UserDB[];

    const formattedUsers = users.map(user => ({
      id: user.id.toString(),
      nome: user.nome,
      email: user.email,
      role: user.role,
      ativo: user.ativo,
      dataCadastro: user.created_at
    }));

    res.json({
      success: true,
      data: formattedUsers,
      message: 'Usuários listados com sucesso'
    });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary:  Obter perfil do usuário logado
 *     description: Retorna informações do perfil do usuário autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Usuario'
 *                 message:
 *                   type: string
 *                   example: "Perfil obtido com sucesso"
 *       401:
 *         description: Token não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Token inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/profile', async (req: any, res: Response): Promise<any> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token não fornecido'
      });
    }

    // Verificar se o token está na blacklist
    if (tokenBlacklist.has(token)) {
      return res.status(403).json({
        success: false,
        message: 'Token foi invalidado'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    
    // Buscar dados completos do usuário
    const user = await req.db.get(`
      SELECT id, nome, email, role, ativo, created_at
      FROM usuarios 
      WHERE id = ?
    `, [decoded.userId]) as UserDB | undefined;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id.toString(),
        nome: user.nome,
        email: user.email,
        role: user.role,
        ativo: user.ativo,
        dataCadastro: user.created_at
      },
      message: 'Perfil obtido com sucesso'
    });
  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;