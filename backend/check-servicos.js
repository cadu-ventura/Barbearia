const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'barbearia.db');
const db = new Database(dbPath);

try {
    const servicos = db.prepare("SELECT * FROM servicos WHERE nome = 'Corte Debug'").all();
    console.log('Serviços encontrados:');
    servicos.forEach(servico => {
        console.log(`ID: ${servico.id}`);
        console.log(`Nome: ${servico.nome}`);
        console.log(`Descrição: ${servico.descricao}`);
        console.log(`Preço: R$ ${servico.preco}`);
        console.log(`Duração: ${servico.duracao} min`);
        console.log(`Ativo: ${servico.ativo ? 'Sim' : 'Não'}`);
        console.log(`Data: ${servico.data_cadastro}`);
        console.log('---');
    });
    
    if (servicos.length === 0) {
        console.log('Nenhum serviço "Corte Debug" encontrado.');
    }
} catch (error) {
    console.error('Erro:', error.message);
} finally {
    db.close();
}