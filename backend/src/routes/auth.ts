import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { User, UserInput, UserDB, LoginCredentials, AuthResponse, JWTPayload } from '../types';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 🔐 Fazer login no sistema
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
 *                 senha: "admin123"
 *             funcionario:
 *               summary: Login como Funcionário
 *               value:
 *                 email: "funcionario@hoshirara.com"
 *                 senha: "func123"
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

// Registrar novo usuário (apenas admin pode criar outros usuários)
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

// Verificar token
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

// Refresh token
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

    // Verificar token mesmo que expirado (para refresh)
    const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true }) as JWTPayload;
    
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

export default router;