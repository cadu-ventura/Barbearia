// Teste de conectividade do frontend com o backend
console.log('🧪 Testando conectividade Frontend -> Backend');

// Teste 1: Testar se o backend responde
fetch('http://localhost:3001/api/clientes')
  .then(response => {
    console.log('📡 Status da resposta:', response.status, response.statusText);
    return response.json();
  })
  .then(data => {
    console.log('📦 Dados recebidos:', data);
    
    if (!data.success && data.message === 'Token de acesso requerido') {
      console.log('🔐 Fazendo login primeiro...');
      
      return fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'admin@hoshirara.com',
          password: 'admin123'
        })
      });
    }
  })
  .then(response => response?.json())
  .then(loginData => {
    if (loginData?.success) {
      console.log('✅ Login OK, testando clientes com token...');
      const token = loginData.token;
      
      return fetch('http://localhost:3001/api/clientes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    }
  })
  .then(response => response?.json())
  .then(data => {
    if (data?.success) {
      console.log('✅ SUCESSO! Frontend conectado ao backend');
      console.log(`📊 Encontrados ${data.data.length} clientes`);
    } else {
      console.log('❌ Erro:', data);
    }
  })
  .catch(error => {
    console.error('❌ ERRO na conectividade:', error);
    console.log('🔍 Verifique se o backend está rodando em http://localhost:3001');
  });