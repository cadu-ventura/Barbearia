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
        cpf,
        data_nascimento,
        endereco_cep,
        endereco_logradouro,
        endereco_numero,
        endereco_bairro,
        endereco_cidade,
        endereco_estado,
        endereco_complemento,
        ativo,
        total_atendimentos,
        avaliacao_media,
        ultimo_atendimento,
        created_at
      FROM clientes 
      ORDER BY nome ASC
    `) as ClienteDB[];

    // Converter campos para o formato esperado pelo frontend
    const clientesFormatados: Cliente[] = clientes.map(cliente => ({
      id: cliente.id.toString(),
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      cpf: cliente.cpf,
      dataNascimento: cliente.data_nascimento ? new Date(cliente.data_nascimento) : undefined,
      endereco: cliente.endereco_cep ? {
        cep: cliente.endereco_cep,
        logradouro: cliente.endereco_logradouro!,
        numero: cliente.endereco_numero!,
        bairro: cliente.endereco_bairro!,
        cidade: cliente.endereco_cidade!,
        estado: cliente.endereco_estado!,
        complemento: cliente.endereco_complemento
      } : undefined,
      ativo: Boolean(cliente.ativo),
      totalAtendimentos: cliente.total_atendimentos || 0,
      avaliacaoMedia: cliente.avaliacao_media || 0,
      ultimoAtendimento: cliente.ultimo_atendimento ? new Date(cliente.ultimo_atendimento) : undefined,
      dataCadastro: new Date(cliente.created_at)
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
      telefone: cliente.telefone,
      cpf: cliente.cpf,
      dataNascimento: cliente.data_nascimento ? new Date(cliente.data_nascimento) : undefined,
      endereco: cliente.endereco_cep ? {
        cep: cliente.endereco_cep,
        logradouro: cliente.endereco_logradouro!,
        numero: cliente.endereco_numero!,
        bairro: cliente.endereco_bairro!,
        cidade: cliente.endereco_cidade!,
        estado: cliente.endereco_estado!,
        complemento: cliente.endereco_complemento
      } : undefined,
      ativo: Boolean(cliente.ativo),
      totalAtendimentos: cliente.total_atendimentos || 0,
      avaliacaoMedia: cliente.avaliacao_media || 0,
      ultimoAtendimento: cliente.ultimo_atendimento ? new Date(cliente.ultimo_atendimento) : undefined,
      dataCadastro: new Date(cliente.created_at)
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
    const clienteData: ClienteInput = req.body;

    const result = await req.db.run(`
      INSERT INTO clientes (
        nome, email, telefone, cpf, data_nascimento,
        endereco_cep, endereco_logradouro, endereco_numero, endereco_bairro,
        endereco_cidade, endereco_estado, endereco_complemento, ativo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      clienteData.nome,
      clienteData.email || null,
      clienteData.telefone,
      clienteData.cpf || null,
      clienteData.dataNascimento || null,
      clienteData.endereco?.cep || null,
      clienteData.endereco?.logradouro || null,
      clienteData.endereco?.numero || null,
      clienteData.endereco?.bairro || null,
      clienteData.endereco?.cidade || null,
      clienteData.endereco?.estado || null,
      clienteData.endereco?.complemento || null,
      clienteData.ativo !== false ? 1 : 0
    ]);

    const novoCliente: Partial<Cliente> = {
      id: result.lastID?.toString(),
      ...clienteData,
      dataNascimento: clienteData.dataNascimento ? new Date(clienteData.dataNascimento) : undefined,
      ativo: clienteData.ativo !== false,
      totalAtendimentos: 0,
      avaliacaoMedia: 0,
      dataCadastro: new Date()
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
        cpf = ?,
        data_nascimento = ?,
        endereco_cep = ?,
        endereco_logradouro = ?,
        endereco_numero = ?,
        endereco_bairro = ?,
        endereco_cidade = ?,
        endereco_estado = ?,
        endereco_complemento = ?,
        ativo = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      clienteData.nome,
      clienteData.email || null,
      clienteData.telefone,
      clienteData.cpf || null,
      clienteData.dataNascimento || null,
      clienteData.endereco?.cep || null,
      clienteData.endereco?.logradouro || null,
      clienteData.endereco?.numero || null,
      clienteData.endereco?.bairro || null,
      clienteData.endereco?.cidade || null,
      clienteData.endereco?.estado || null,
      clienteData.endereco?.complemento || null,
      clienteData.ativo !== false ? 1 : 0,
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
      UPDATE clientes SET ativo = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?
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