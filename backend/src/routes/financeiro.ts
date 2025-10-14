import express, { Response } from 'express';
import { body } from 'express-validator';
import { authenticateToken, authorize, validateId } from '../middleware/auth';
import { MovimentacaoFinanceira, MovimentacaoFinanceiraInput, MovimentacaoFinanceiraDB, ResumoFinanceiro, TipoMovimentacao } from '../types';

const router = express.Router();

// Listar movimentações financeiras
router.get('/', authenticateToken, authorize(['admin', 'funcionario']), async (req: any, res: Response) => {
  try {
    const { tipo, categoria, data_inicio, data_fim } = req.query;
    
    let sql = 'SELECT * FROM movimentacoes_financeiras WHERE 1=1';
    const params: any[] = [];
    
    if (tipo) {
      sql += ' AND tipo = ?';
      params.push(tipo);
    }
    
    if (categoria) {
      sql += ' AND categoria = ?';
      params.push(categoria);
    }
    
    if (data_inicio) {
      sql += ' AND DATE(data) >= ?';
      params.push(data_inicio);
    }
    
    if (data_fim) {
      sql += ' AND DATE(data) <= ?';
      params.push(data_fim);
    }
    
    sql += ' ORDER BY data DESC, created_at DESC';

    const movimentacoes = await req.db.all(sql, params) as MovimentacaoFinanceiraDB[];

    const movimentacoesFormatadas: MovimentacaoFinanceira[] = movimentacoes.map(mov => ({
      id: mov.id.toString(),
      tipo: mov.tipo,
      categoria: mov.categoria,
      descricao: mov.descricao,
      valor: mov.valor,
      data: new Date(mov.data),
      agendamentoId: mov.agendamento_id?.toString(),
      observacoes: mov.observacoes,
      dataCadastro: new Date(mov.created_at)
    }));

    res.json({
      success: true,
      data: movimentacoesFormatadas
    });
  } catch (error) {
    console.error('Erro ao listar movimentações:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// Criar movimentação financeira
router.post('/', authenticateToken, authorize(['admin', 'funcionario']), [
  body('tipo').isIn(['receita', 'despesa']).withMessage('Tipo deve ser receita ou despesa'),
  body('categoria').notEmpty().withMessage('Categoria é obrigatória'),
  body('descricao').notEmpty().withMessage('Descrição é obrigatória'),
  body('valor').isFloat({ min: 0 }).withMessage('Valor deve ser positivo'),
  body('data').isDate().withMessage('Data deve ser válida')
], async (req: any, res: Response) => {
  try {
    const movimentacaoData: MovimentacaoFinanceiraInput = req.body;

    const result = await req.db.run(`
      INSERT INTO movimentacoes_financeiras (
        tipo, categoria, descricao, valor, data, agendamento_id, observacoes
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      movimentacaoData.tipo,
      movimentacaoData.categoria,
      movimentacaoData.descricao,
      movimentacaoData.valor,
      movimentacaoData.data,
      movimentacaoData.agendamentoId || null,
      movimentacaoData.observacoes || null
    ]);

    const novaMovimentacao: Partial<MovimentacaoFinanceira> = {
      id: result.lastID?.toString(),
      ...movimentacaoData,
      data: new Date(movimentacaoData.data),
      dataCadastro: new Date()
    };

    res.status(201).json({
      success: true,
      data: novaMovimentacao,
      message: 'Movimentação criada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar movimentação:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// Atualizar movimentação
router.put('/:id', authenticateToken, authorize(['admin', 'funcionario']), validateId, [
  body('tipo').isIn(['receita', 'despesa']).withMessage('Tipo deve ser receita ou despesa'),
  body('categoria').notEmpty().withMessage('Categoria é obrigatória'),
  body('descricao').notEmpty().withMessage('Descrição é obrigatória'),
  body('valor').isFloat({ min: 0 }).withMessage('Valor deve ser positivo'),
  body('data').isDate().withMessage('Data deve ser válida')
], async (req: any, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const movimentacaoData: MovimentacaoFinanceiraInput = req.body;

    const result = await req.db.run(`
      UPDATE movimentacoes_financeiras SET
        tipo = ?,
        categoria = ?,
        descricao = ?,
        valor = ?,
        data = ?,
        agendamento_id = ?,
        observacoes = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      movimentacaoData.tipo,
      movimentacaoData.categoria,
      movimentacaoData.descricao,
      movimentacaoData.valor,
      movimentacaoData.data,
      movimentacaoData.agendamentoId || null,
      movimentacaoData.observacoes || null,
      id
    ]);

    if (result.changes === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Movimentação não encontrada' 
      });
    }

    res.json({
      success: true,
      message: 'Movimentação atualizada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar movimentação:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// Deletar movimentação
router.delete('/:id', authenticateToken, authorize(['admin']), validateId, async (req: any, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const result = await req.db.run('DELETE FROM movimentacoes_financeiras WHERE id = ?', [id]);

    if (result.changes === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Movimentação não encontrada' 
      });
    }

    res.json({
      success: true,
      message: 'Movimentação removida com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover movimentação:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// Relatório financeiro resumido
router.get('/resumo', authenticateToken, authorize(['admin', 'funcionario']), async (req: any, res: Response) => {
  try {
    const { data_inicio, data_fim } = req.query;
    
    const hoje = new Date().toISOString().split('T')[0];
    const inicioMes = new Date();
    inicioMes.setDate(1);
    const inicioMesStr = inicioMes.toISOString().split('T')[0];

    const dataInicio = data_inicio || inicioMesStr;
    const dataFim = data_fim || hoje;

    // Resumo por tipo
    const resumoTipos = await req.db.all(`
      SELECT 
        tipo,
        SUM(valor) as total
      FROM movimentacoes_financeiras 
      WHERE DATE(data) BETWEEN ? AND ?
      GROUP BY tipo
    `, [dataInicio, dataFim]) as { tipo: TipoMovimentacao; total: number }[];

    // Resumo por categoria
    const resumoCategorias = await req.db.all(`
      SELECT 
        tipo,
        categoria,
        SUM(valor) as total
      FROM movimentacoes_financeiras 
      WHERE DATE(data) BETWEEN ? AND ?
      GROUP BY tipo, categoria
      ORDER BY tipo, total DESC
    `, [dataInicio, dataFim]) as { tipo: TipoMovimentacao; categoria: string; total: number }[];

    const totalReceitas = resumoTipos.find(r => r.tipo === 'receita')?.total || 0;
    const totalDespesas = resumoTipos.find(r => r.tipo === 'despesa')?.total || 0;
    const saldo = totalReceitas - totalDespesas;

    const receitasPorCategoria = resumoCategorias
      .filter(r => r.tipo === 'receita')
      .map(r => ({ categoria: r.categoria, total: r.total }));

    const despesasPorCategoria = resumoCategorias
      .filter(r => r.tipo === 'despesa')
      .map(r => ({ categoria: r.categoria, total: r.total }));

    const resumo: ResumoFinanceiro = {
      totalReceitas,
      totalDespesas,
      saldo,
      receitasPorCategoria,
      despesasPorCategoria
    };

    res.json({
      success: true,
      data: resumo,
      periodo: {
        inicio: dataInicio,
        fim: dataFim
      }
    });
  } catch (error) {
    console.error('Erro ao gerar resumo financeiro:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

export default router;