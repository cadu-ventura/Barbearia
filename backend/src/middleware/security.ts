import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

/**
 * Configuração do Helmet para headers de segurança
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

/**
 * Rate limiting geral
 */
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: {
    success: false,
    message: 'Muitas requisições. Tente novamente em 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiting específico para autenticação
 */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas de login por IP
  message: {
    success: false,
    message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiting para operações sensíveis
 */
export const sensitiveOperationsRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // máximo 10 operações sensíveis por hora
  message: {
    success: false,
    message: 'Limite de operações sensíveis excedido. Tente novamente em 1 hora.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Middleware para sanitização de dados de entrada
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction): void => {
  // Remove caracteres perigosos de strings
  const sanitizeString = (str: string): string => {
    return str
      .replace(/[<>\"'%;&()]/g, '') // Remove caracteres perigosos
      .trim(); // Remove espaços em branco
  };

  // Sanitiza recursivamente objetos
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      return sanitizeString(obj);
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          sanitized[key] = sanitizeObject(obj[key]);
        }
      }
      return sanitized;
    }
    
    return obj;
  };

  // Sanitiza body, query e params
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
};

/**
 * Middleware para logging de operações sensíveis
 */
export const logSensitiveOperations = (operation: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userInfo = (req as any).user ? `User: ${(req as any).user.email}` : 'Anonymous';
    const timestamp = new Date().toISOString();
    const ip = req.ip || req.connection.remoteAddress;
    
    console.log(`[SECURITY LOG] ${timestamp} - ${operation} - ${userInfo} - IP: ${ip}`);
    
    next();
  };
};

/**
 * Middleware para verificar origem das requisições
 */
export const checkOrigin = (req: Request, res: Response, next: NextFunction): void => {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL
  ].filter(Boolean);

  const origin = req.headers.origin;
  
  if (!origin || allowedOrigins.includes(origin)) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Origem não autorizada'
    });
  }
};