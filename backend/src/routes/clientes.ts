import express, { Request, Response } from 'express';
import { authenticateToken, authorize, validateId } from '../middleware/auth';
import { clienteValidation } from '../middleware/validation';
import { Cliente, ClienteInput, ClienteDB } from '../types';

const router = express.Router();

/**
 * @swagger
 * /api/clientes:
 *   get:
 *     summary: 👥 Listar todos os clientes
 *     description: Retorna lista completa de clientes cadastrados no sistema
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: ativo
 *         schema:
 *           type: boolean
 *         description: Filtrar apenas clientes ativos
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nome ou telefone
 *     responses:
 *       200:
 *         description: Lista de clientes retornada com sucesso
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
 *                     $ref: '#/components/schemas/Cliente'
 *       401:
 *         description: Token de acesso inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Acesso negado - permissão insuficiente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: ➕ Cadastrar novo cliente
 *     description: Cria um novo cliente no sistema
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, telefone]
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "João Silva Santos"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "joao@email.com"
 *               telefone:
 *                 type: string
 *                 example: "(11) 99999-9999"
 *               cpf:
 *                 type: string
 *                 example: "123.456.789-00"
 *               observacoes:
 *                 type: string
 *                 example: "Cliente preferencial"
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

// Listar todos os clientes
router.get('/', authenticateToken, authorize(['admin', 'funcionario']), async (req: any, res: Response) => {
  try {
    const clientes = await req.db.all(`
      SELECT 
        id,
        nome,
        email,
        telefone,
        data_nascimento,
        observacoes,
        ativo,
        created_at,
        updated_at
      FROM clientes 
      ORDER BY nome ASC
    `) as ClienteDB[];

    // Converter campos para o formato esperado pelo frontend
    const clientesFormatados: Cliente[] = clientes.map(cliente => ({
      id: cliente.id.toString(),
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone || '',
      dataNascimento: cliente.data_nascimento,
      observacoes: cliente.observacoes,
      ativo: Boolean(cliente.ativo),
      totalAtendimentos: 0,
      avaliacaoMedia: 0,
      dataCadastro: cliente.created_at
    }));

    res.json({
      success: true,
      data: clientesFormatados
    });
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// Buscar cliente por ID
router.get('/:id', authenticateToken, authorize(['admin', 'funcionario']), validateId, async (req: any, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const cliente = await req.db.get(`
      SELECT * FROM clientes WHERE id = ?
    `, [id]) as ClienteDB | undefined;

    if (!cliente) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cliente não encontrado' 
      });
    }

    const clienteFormatado: Cliente = {
      id: cliente.id.toString(),
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone || '',
      dataNascimento: cliente.data_nascimento,
      observacoes: cliente.observacoes,
      ativo: Boolean(cliente.ativo),
      totalAtendimentos: 0,
      avaliacaoMedia: 0,
      dataCadastro: cliente.created_at
    };

    res.json({
      success: true,
      data: clienteFormatado
    });
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// Criar novo cliente
router.post('/', authenticateToken, authorize(['admin', 'funcionario']), clienteValidation, async (req: any, res: Response) => {
  try {
    console.log('=== CRIANDO CLIENTE ===');
    console.log('Body recebido:', req.body);
    
    const clienteData: ClienteInput = req.body;
    console.log('Cliente data processado:', clienteData);

    console.log('Executando INSERT...');
    const result = await req.db.run(`
      INSERT INTO clientes (
        nome, email, telefone, data_nascimento, observacoes, ativo
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, [
      clienteData.nome,
      clienteData.email || null,
      clienteData.telefone,
      clienteData.dataNascimento || null,
      (clienteData as any).observacoes || null,
      clienteData.ativo !== false
    ]);
    
    console.log('Resultado do INSERT:', result);

    const novoCliente: Partial<Cliente> = {
      id: result.lastID?.toString(),
      ...clienteData,
      dataNascimento: clienteData.dataNascimento,
      ativo: clienteData.ativo !== false,
      totalAtendimentos: 0,
      avaliacaoMedia: 0,
      dataCadastro: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      data: novoCliente,
      message: 'Cliente criado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// Atualizar cliente
router.put('/:id', authenticateToken, authorize(['admin', 'funcionario']), validateId, clienteValidation, async (req: any, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const clienteData: ClienteInput = req.body;

    const result = await req.db.run(`
      UPDATE clientes SET
        nome = ?,
        email = ?,
        telefone = ?,
        data_nascimento = ?,
        observacoes = ?,
        ativo = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      clienteData.nome,
      clienteData.email || null,
      clienteData.telefone,
      clienteData.dataNascimento || null,
      (clienteData as any).observacoes || null,
      clienteData.ativo !== false,
      id
    ]);

    if (result.changes === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cliente não encontrado' 
      });
    }

    res.json({
      success: true,
      message: 'Cliente atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// Deletar cliente (soft delete)
router.delete('/:id', authenticateToken, authorize(['admin']), validateId, async (req: any, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const result = await req.db.run(`
      UPDATE clientes SET ativo = 0, data_atualizacao = CURRENT_TIMESTAMP WHERE id = ?
    `, [id]);

    if (result.changes === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cliente não encontrado' 
      });
    }

    res.json({
      success: true,
      message: 'Cliente desativado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

export default router;