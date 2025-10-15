const express = require('express');
const { createDatabaseConnection } = require('./src/config/database');

const app = express();
app.use(express.json());

app.post('/test-db', async (req, res) => {
  try {
    console.log('=== TESTE DE INSERÇÃO ===');
    console.log('Body recebido:', req.body);
    
    const db = await createDatabaseConnection();
    console.log('Conexão criada com sucesso');
    
    const result = await db.run(`
      INSERT INTO clientes (nome, telefone, ativo) VALUES (?, ?, ?)
    `, ['Teste API', '11999999999', 1]);
    
    console.log('Resultado da inserção:', result);
    
    res.json({
      success: true,
      data: {
        lastID: result.lastID,
        changes: result.changes
      }
    });
  } catch (error) {
    console.error('ERRO NO TESTE:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(3002, () => {
  console.log('Servidor de teste rodando na porta 3002');
});