import express, { Response } from 'express';
import { authenticateToken, authorize, validateId } from '../middleware/auth';
import { servicoValidation } from '../middleware/validation';
import { Servico, ServicoInput, ServicoDB } from '../types';

const router = express.Router();

// Listar todos os serviços
router.get('/', authenticateToken, authorize(['admin', 'funcionario', 'barbeiro']), async (req: any, res: Response) => {
  try {
    const servicos = await req.db.all(`
      SELECT * FROM servicos ORDER BY nome ASC
    `) as ServicoDB[];

    const servicosFormatados: Servico[] = servicos.map(servico => ({
      id: servico.id.toString(),
      nome: servico.nome,
      descricao: servico.descricao,
      preco: servico.preco,
      duracao: servico.duracao,
      categoria: servico.categoria,
      ativo: Boolean(servico.ativo),
      dataCadastro: new Date(servico.created_at)
    }));

    res.json({
      success: true,
      data: servicosFormatados
    });
  } catch (error) {
    console.error('Erro ao listar serviços:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// Criar novo serviço
router.post('/', authenticateToken, authorize(['admin']), servicoValidation, async (req: any, res: Response) => {
  try {
    const servicoData: ServicoInput = req.body;

    const result = await req.db.run(`
      INSERT INTO servicos (
        nome, descricao, preco, duracao, categoria, ativo
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, [
      servicoData.nome,
      servicoData.descricao || null,
      servicoData.preco,
      servicoData.duracao,
      servicoData.categoria,
      servicoData.ativo !== false ? 1 : 0
    ]);

    const novoServico: Partial<Servico> = {
      id: result.lastID?.toString(),
      ...servicoData,
      ativo: servicoData.ativo !== false,
      dataCadastro: new Date()
    };

    res.status(201).json({
      success: true,
      data: novoServico,
      message: 'Serviço criado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// Atualizar serviço
router.put('/:id', authenticateToken, authorize(['admin']), validateId, servicoValidation, async (req: any, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const servicoData: ServicoInput = req.body;

    const result = await req.db.run(`
      UPDATE servicos SET
        nome = ?,
        descricao = ?,
        preco = ?,
        duracao = ?,
        categoria = ?,
        ativo = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      servicoData.nome,
      servicoData.descricao || null,
      servicoData.preco,
      servicoData.duracao,
      servicoData.categoria,
      servicoData.ativo !== false ? 1 : 0,
      id
    ]);

    if (result.changes === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Serviço não encontrado' 
      });
    }

    res.json({
      success: true,
      message: 'Serviço atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// Deletar serviço
router.delete('/:id', authenticateToken, authorize(['admin']), validateId, async (req: any, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const result = await req.db.run(`
      UPDATE servicos SET ativo = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `, [id]);

    if (result.changes === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Serviço não encontrado' 
      });
    }

    res.json({
      success: true,
      message: 'Serviço removido com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover serviço:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

export default router;