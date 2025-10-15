const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Verificar esquema da tabela clientes
db.all("PRAGMA table_info(clientes)", (err, rows) => {
  if (err) {
    console.error('Erro:', err);
  } else {
    console.log('Estrutura da tabela clientes:');
    rows.forEach(row => {
      console.log(`${row.name} (${row.type}) - ${row.notnull ? 'NOT NULL' : 'NULLABLE'} - Default: ${row.dflt_value || 'NULL'}`);
    });
  }
  
  db.close();
});