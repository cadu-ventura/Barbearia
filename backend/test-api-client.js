const testClient = {
  nome: "Teste Cliente",
  email: "teste@teste.com",
  telefone: "(11) 99999-9999",
  cpf: "123.456.789-00",
  dataNascimento: "1990-01-01",
  endereco: {
    cep: "12345-678",
    logradouro: "Rua Teste",
    numero: "123",
    complemento: "Apto 1",
    bairro: "Centro",
    cidade: "Teste",
    estado: "TS"
  },
  ativo: true
};

// Obter token (simular login)
const token = localStorage.getItem('auth_token') || 'mock_token';

// Testar criação de cliente
fetch('http://localhost:3001/api/clientes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(testClient)
})
.then(response => {
  console.log('Status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Resposta da API:', data);
})
.catch(error => {
  console.error('Erro:', error);
});

console.log('Teste enviado para:', 'http://localhost:3001/api/clientes');
console.log('Dados enviados:', testClient);