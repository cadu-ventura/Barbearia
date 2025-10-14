import express, { Response } from 'express';
import { authenticateToken, authorize, validateId } from '../middleware/auth';
import { barbeiroValidation } from '../middleware/validation';
import { Barbeiro, BarbeiroInput, BarbeiroDB } from '../types';

const router = express.Router();

// Listar todos os barbeiros
router.get('/', authenticateToken, authorize(['admin', 'funcionario', 'barbeiro']), async (req: any, res: Response) => {
  try {
    const barbeiros = await req.db.all(`
      SELECT * FROM barbeiros ORDER BY nome ASC
    `) as BarbeiroDB[];

    const barbeirosFormatados: Barbeiro[] = barbeiros.map(barbeiro => ({
      id: barbeiro.id.toString(),
      nome: barbeiro.nome,
      email: barbeiro.email,
      telefone: barbeiro.telefone,
      cpf: barbeiro.cpf,
      especialidades: JSON.parse(barbeiro.especialidades || '[]'),
      comissao: barbeiro.comissao,
      ativo: Boolean(barbeiro.ativo),
      totalAtendimentos: barbeiro.total_atendimentos || 0,
      avaliacaoMedia: barbeiro.avaliacao_media || 0,
      dataCadastro: new Date(barbeiro.created_at)
    }));

    res.json({
      success: true,
      data: barbeirosFormatados
    });
  } catch (error) {
    console.error('Erro ao listar barbeiros:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// Criar novo barbeiro
router.post('/', authenticateToken, authorize(['admin']), barbeiroValidation, async (req: any, res: Response) => {
  try {
    const barbeiroData: BarbeiroInput = req.body;

    const result = await req.db.run(`
      INSERT INTO barbeiros (
        nome, email, telefone, cpf, especialidades, comissao, ativo
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      barbeiroData.nome,
      barbeiroData.email || null,
      barbeiroData.telefone || null,
      barbeiroData.cpf || null,
      JSON.stringify(barbeiroData.especialidades),
      barbeiroData.comissao || null,
      barbeiroData.ativo !== false ? 1 : 0
    ]);

    const novoBarbeiro: Partial<Barbeiro> = {
      id: result.lastID?.toString(),
      ...barbeiroData,
      ativo: barbeiroData.ativo !== false,
      totalAtendimentos: 0,
      avaliacaoMedia: 0,
      dataCadastro: new Date()
    };

    res.status(201).json({
      success: true,
      data: novoBarbeiro,
      message: 'Barbeiro criado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar barbeiro:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// Atualizar barbeiro
router.put('/:id', authenticateToken, authorize(['admin']), validateId, barbeiroValidation, async (req: any, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const barbeiroData: BarbeiroInput = req.body;

    const result = await req.db.run(`
      UPDATE barbeiros SET
        nome = ?,
        email = ?,
        telefone = ?,
        cpf = ?,
        especialidades = ?,
        comissao = ?,
        ativo = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      barbeiroData.nome,
      barbeiroData.email || null,
      barbeiroData.telefone || null,
      barbeiroData.cpf || null,
      JSON.stringify(barbeiroData.especialidades),
      barbeiroData.comissao || null,
      barbeiroData.ativo !== false ? 1 : 0,
      id
    ]);

    if (result.changes === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Barbeiro não encontrado' 
      });
    }

    res.json({
      success: true,
      message: 'Barbeiro atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar barbeiro:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// Deletar barbeiro
router.delete('/:id', authenticateToken, authorize(['admin']), validateId, async (req: any, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const result = await req.db.run(`
      UPDATE barbeiros SET ativo = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `, [id]);

    if (result.changes === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Barbeiro não encontrado' 
      });
    }

    res.json({
      success: true,
      message: 'Barbeiro removido com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover barbeiro:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

export default router;