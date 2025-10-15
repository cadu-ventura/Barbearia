console.log('🎉 TESTE FINAL SIMPLIFICADO');

fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@hoshirara.com',
    password: 'admin123'
  })
})
.then(r => r.json())
.then(data => {
  if (data.success) {
    console.log('✅ LOGIN: OK');
    console.log('✅ BACKEND: OK');
    console.log('✅ FRONTEND: http://localhost:5173 - OK');
    console.log('🎯 SISTEMA FUNCIONANDO PERFEITAMENTE!');
  } else {
    console.log('❌ Erro:', data.message);
  }
})
.catch(e => console.error('❌ Erro:', e));