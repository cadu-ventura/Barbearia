// Teste direto do frontend
console.log('🧪 Testando login no frontend');

// Simular clique de login
fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'admin@hoshirara.com',
    password: 'admin123'
  })
})
.then(response => {
  console.log('Status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Response:', data);
  
  if (data.success) {
    console.log('✅ Login funcionou!');
    console.log('Token:', data.token.substring(0, 20) + '...');
    console.log('User:', data.user);
    
    // Salvar no localStorage como o frontend faria
    localStorage.setItem('auth_token', data.token);
    console.log('💾 Token salvo no localStorage');
    
    // Testar uma requisição autenticada
    return fetch('http://localhost:5173/api/clientes', {
      headers: {
        'Authorization': `Bearer ${data.token}`
      }
    });
  } else {
    console.log('❌ Login falhou:', data.message);
  }
})
.then(response => {
  if (response) {
    console.log('Status da req autenticada:', response.status);
    return response.json();
  }
})
.then(data => {
  if (data) {
    console.log('Dados dos clientes:', data);
  }
})
.catch(error => {
  console.error('❌ Erro:', error);
});