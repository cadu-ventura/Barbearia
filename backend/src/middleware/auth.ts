import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { param, validationResult } from 'express-validator';
import { JWTPayload, AuthenticatedRequest, UserRole } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

/**
 * Middleware para autenticar token JWT
 */
export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ 
      success: false, 
      message: 'Token de acesso requerido' 
    });
    return;
  }

  try {
    // Permitir tokens mock durante desenvolvimento
    if (token.startsWith('mock_token_')) {
      req.user = {
        userId: token.replace('mock_token_', ''),
        email: 'admin@barbearia.com',
        role: 'admin' as UserRole
      };
      next();
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ 
      success: false, 
      message: 'Token inválido ou expirado' 
    });
    return;
  }
};

/**
 * Middleware para autorização baseada em roles
 */
export const authorize = (allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ 
        success: false, 
        message: 'Usuário não autenticado' 
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ 
        success: false, 
        message: 'Acesso negado: permissões insuficientes' 
      });
      return;
    }

    next();
  };
};

/**
 * Middleware para validar ID nos parâmetros da rota
 */
export const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID deve ser um número inteiro positivo')
    .toInt(),
  
  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'ID inválido',
        errors: errors.array()
      });
      return;
    }
    next();
  }
];

/**
 * Verifica se o usuário logado pode acessar recursos específicos
 */
export const checkResourceOwnership = (resourceOwnerField = 'userId') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ 
        success: false, 
        message: 'Usuário não autenticado' 
      });
      return;
    }

    // Admin pode acessar qualquer recurso
    if (req.user.role === 'admin') {
      next();
      return;
    }

    // Para outros roles, verificar se é dono do recurso
    const resourceOwnerId = req.params[resourceOwnerField] || req.body[resourceOwnerField];
    
    if (resourceOwnerId && resourceOwnerId !== req.user.userId) {
      res.status(403).json({ 
        success: false, 
        message: 'Acesso negado: você só pode acessar seus próprios recursos' 
      });
      return;
    }

    next();
  };
};