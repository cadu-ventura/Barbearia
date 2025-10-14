import express, { Response } from 'express';
import { authenticateToken, authorize, validateId } from '../middleware/auth';
import { agendamentoValidation } from '../middleware/validation';
import { Agendamento, AgendamentoInput, AgendamentoDB, StatusAgendamento, FormaPagamento } from '../types';

const router = express.Router();

// Listar agendamentos
router.get('/', authenticateToken, authorize(['admin', 'funcionario', 'barbeiro']), async (req: any, res: Response) => {
  try {
    const { status, data_inicio, data_fim } = req.query;
    
    let sql = `
      SELECT 
        a.*,
        c.nome as cliente_nome,
        b.nome as barbeiro_nome
      FROM agendamentos a
      JOIN clientes c ON a.cliente_id = c.id
      JOIN barbeiros b ON a.barbeiro_id = b.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status) {
      sql += ' AND a.status = ?';
      params.push(status);
    }

    if (data_inicio) {
      sql += ' AND DATE(a.data_hora) >= ?';
      params.push(data_inicio);
    }

    if (data_fim) {
      sql += ' AND DATE(a.data_hora) <= ?';
      params.push(data_fim);
    }

    sql += ' ORDER BY a.data_hora ASC';

    const agendamentos = await req.db.all(sql, params) as (AgendamentoDB & { cliente_nome: string; barbeiro_nome: string })[];

    const agendamentosFormatados: Agendamento[] = agendamentos.map(agendamento => ({
      id: agendamento.id.toString(),
      clienteId: agendamento.cliente_id.toString(),
      barbeiroId: agendamento.barbeiro_id.toString(),
      dataHora: new Date(agendamento.data_hora),
      servicoIds: JSON.parse(agendamento.servico_ids),
      valorTotal: agendamento.valor_total,
      status: agendamento.status,
      observacoes: agendamento.observacoes,
      formaPagamento: agendamento.forma_pagamento,
      dataCadastro: new Date(agendamento.created_at),
      clienteNome: agendamento.cliente_nome,
      barbeiroNome: agendamento.barbeiro_nome
    }));

    res.json({
      success: true,
      data: agendamentosFormatados
    });
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// Criar agendamento
router.post('/', authenticateToken, authorize(['admin', 'funcionario']), agendamentoValidation, async (req: any, res: Response) => {
  try {
    const agendamentoData: AgendamentoInput = req.body;

    const result = await req.db.run(`
      INSERT INTO agendamentos (
        cliente_id, barbeiro_id, data_hora, servico_ids, 
        valor_total, status, observacoes, forma_pagamento
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      agendamentoData.clienteId,
      agendamentoData.barbeiroId,
      agendamentoData.dataHora,
      JSON.stringify(agendamentoData.servicoIds),
      agendamentoData.valorTotal,
      agendamentoData.status || 'agendado',
      agendamentoData.observacoes || null,
      agendamentoData.formaPagamento || null
    ]);

    const novoAgendamento: Partial<Agendamento> = {
      id: result.lastID?.toString(),
      ...agendamentoData,
      dataHora: new Date(agendamentoData.dataHora),
      status: (agendamentoData.status || 'agendado') as StatusAgendamento,
      dataCadastro: new Date()
    };

    res.status(201).json({
      success: true,
      data: novoAgendamento,
      message: 'Agendamento criado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// Atualizar agendamento
router.put('/:id', authenticateToken, authorize(['admin', 'funcionario']), validateId, agendamentoValidation, async (req: any, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const agendamentoData: AgendamentoInput = req.body;

    const result = await req.db.run(`
      UPDATE agendamentos SET
        cliente_id = ?,
        barbeiro_id = ?,
        data_hora = ?,
        servico_ids = ?,
        valor_total = ?,
        status = ?,
        observacoes = ?,
        forma_pagamento = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      agendamentoData.clienteId,
      agendamentoData.barbeiroId,
      agendamentoData.dataHora,
      JSON.stringify(agendamentoData.servicoIds),
      agendamentoData.valorTotal,
      agendamentoData.status || 'agendado',
      agendamentoData.observacoes || null,
      agendamentoData.formaPagamento || null,
      id
    ]);

    if (result.changes === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Agendamento não encontrado' 
      });
    }

    res.json({
      success: true,
      message: 'Agendamento atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// Excluir agendamento
router.delete('/:id', authenticateToken, authorize(['admin', 'funcionario']), validateId, async (req: any, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const result = await req.db.run(`
      DELETE FROM agendamentos 
      WHERE id = ?
    `, [id]);

    if (result.changes === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Agendamento não encontrado' 
      });
    }

    res.json({
      success: true,
      message: 'Agendamento excluído com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir agendamento:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// Cancelar agendamento (rota adicional se necessário)
router.patch('/:id/cancelar', authenticateToken, authorize(['admin', 'funcionario']), validateId, async (req: any, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const result = await req.db.run(`
      UPDATE agendamentos SET 
        status = 'cancelado', 
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `, [id]);

    if (result.changes === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Agendamento não encontrado' 
      });
    }

    res.json({
      success: true,
      message: 'Agendamento cancelado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao cancelar agendamento:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

export default router;