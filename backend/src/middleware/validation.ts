import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

/**
 * Validação de CPF usando algoritmo oficial
 */
const validarCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/[^\d]+/g, '');
  
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) {
    return false;
  }
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(10))) return false;
  
  return true;
};

/**
 * Middleware para tratamento de erros de validação
 */
const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: errors.array()
    });
    return;
  }
  next();
};

/**
 * Validação para clientes
 */
export const clienteValidation = [
  body('nome')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres')
    .matches(/^[A-Za-zÀ-ÿ\u00f1\u00d1 ]+$/)
    .withMessage('Nome deve conter apenas letras e espaços'),
  
  body('email')
    .optional({ nullable: true, checkFalsy: true })
    .isEmail()
    .withMessage('Email deve ser válido')
    .normalizeEmail(),
  
  body('telefone')
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)
    .withMessage('Telefone deve estar no formato (11) 99999-9999'),
  
  body('cpf')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value: string) => {
      if (value && !validarCPF(value)) {
        throw new Error('CPF inválido');
      }
      return true;
    }),

  body('dataNascimento')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage('Data de nascimento deve ser válida')
    .custom((value: string) => {
      if (value) {
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age < 0 || age > 120) {
          throw new Error('Data de nascimento inválida');
        }
      }
      return true;
    }),

  body('endereco.cep')
    .optional({ nullable: true, checkFalsy: true })
    .matches(/^\d{5}-?\d{3}$/)
    .withMessage('CEP deve estar no formato 12345-678'),

  handleValidationErrors
];

/**
 * Validação para agendamentos
 */
export const agendamentoValidation = [
  body('clienteId')
    .isInt({ min: 1 })
    .withMessage('Cliente ID deve ser um número válido'),
  
  body('barbeiroId')
    .isInt({ min: 1 })
    .withMessage('Barbeiro ID deve ser um número válido'),
  
  body('dataHora')
    .isISO8601()
    .withMessage('Data/hora deve ser válida')
    .custom((value: string) => {
      const agendamento = new Date(value);
      const agora = new Date();
      
      if (agendamento <= agora) {
        throw new Error('Data/hora deve ser futura');
      }
      
      const horario = agendamento.getHours();
      if (horario < 8 || horario > 18) {
        throw new Error('Horário deve estar entre 08:00 e 18:00');
      }
      
      return true;
    }),
  
  body('servicoIds')
    .isArray({ min: 1, max: 5 })
    .withMessage('Deve ter entre 1 e 5 serviços')
    .custom((value: number[]) => {
      if (!value.every(id => Number.isInteger(id) && id > 0)) {
        throw new Error('IDs de serviços devem ser números válidos');
      }
      return true;
    }),

  body('valorTotal')
    .isFloat({ min: 0.01, max: 10000 })
    .withMessage('Valor total deve estar entre R$ 0,01 e R$ 10.000,00'),

  body('status')
    .optional()
    .isIn(['agendado', 'confirmado', 'em_andamento', 'concluido', 'cancelado'])
    .withMessage('Status inválido'),

  body('formaPagamento')
    .optional({ nullable: true, checkFalsy: true })
    .isIn(['dinheiro', 'cartao_debito', 'cartao_credito', 'pix', 'transferencia'])
    .withMessage('Forma de pagamento inválida'),

  handleValidationErrors
];

/**
 * Validação para serviços
 */
export const servicoValidation = [
  body('nome')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  
  body('descricao')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 500 })
    .withMessage('Descrição deve ter no máximo 500 caracteres'),
  
  body('preco')
    .isFloat({ min: 0.01, max: 1000 })
    .withMessage('Preço deve estar entre R$ 0,01 e R$ 1.000,00'),
  
  body('duracao')
    .isInt({ min: 5, max: 480 })
    .withMessage('Duração deve estar entre 5 e 480 minutos'),
  
  body('categoria')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Categoria deve ter entre 2 e 50 caracteres'),

  handleValidationErrors
];

/**
 * Validação para barbeiros
 */
export const barbeiroValidation = [
  body('nome')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres')
    .matches(/^[A-Za-zÀ-ÿ\u00f1\u00d1 ]+$/)
    .withMessage('Nome deve conter apenas letras e espaços'),
  
  body('email')
    .optional({ nullable: true, checkFalsy: true })
    .isEmail()
    .withMessage('Email deve ser válido')
    .normalizeEmail(),
  
  body('telefone')
    .optional({ nullable: true, checkFalsy: true })
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)
    .withMessage('Telefone deve estar no formato (11) 99999-9999'),
  
  body('cpf')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value: string) => {
      if (value && !validarCPF(value)) {
        throw new Error('CPF inválido');
      }
      return true;
    }),

  body('especialidades')
    .isArray({ min: 1, max: 10 })
    .withMessage('Deve ter entre 1 e 10 especialidades')
    .custom((value: string[]) => {
      const validEspecialidades = ['Corte', 'Barba', 'Bigode', 'Sobrancelha', 'Tratamento Capilar'];
      if (!value.every(esp => validEspecialidades.includes(esp))) {
        throw new Error('Especialidades inválidas');
      }
      return true;
    }),

  body('comissao')
    .optional({ nullable: true })
    .isFloat({ min: 0, max: 100 })
    .withMessage('Comissão deve estar entre 0 e 100%'),

  handleValidationErrors
];

/**
 * Validação para movimentações financeiras
 */
export const financeiroValidation = [
  body('tipo')
    .isIn(['receita', 'despesa'])
    .withMessage('Tipo deve ser receita ou despesa'),
  
  body('categoria')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Categoria deve ter entre 2 e 50 caracteres'),
  
  body('descricao')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Descrição deve ter entre 2 e 200 caracteres'),
  
  body('valor')
    .isFloat({ min: 0.01, max: 100000 })
    .withMessage('Valor deve estar entre R$ 0,01 e R$ 100.000,00'),
  
  body('data')
    .isISO8601()
    .withMessage('Data deve ser válida')
    .custom((value: string) => {
      const dataMovimentacao = new Date(value);
      const hoje = new Date();
      const umAnoAtras = new Date();
      umAnoAtras.setFullYear(hoje.getFullYear() - 1);
      
      if (dataMovimentacao > hoje || dataMovimentacao < umAnoAtras) {
        throw new Error('Data deve estar entre um ano atrás e hoje');
      }
      return true;
    }),

  body('agendamentoId')
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage('ID do agendamento deve ser um número válido'),

  handleValidationErrors
];

/**
 * Validação para IDs em parâmetros de rota
 */
export const idValidation = [
  body('id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID deve ser um número inteiro positivo'),
  
  handleValidationErrors
];