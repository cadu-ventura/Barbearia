const url = 'http://localhost:3001/api/auth/login';
const data = {
    email: 'admin@hoshirara.com',
    password: 'admin123'
};

fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
})
.then(response => response.json())
.then(data => {
    console.log('Login OK');
    if (data.success && data.token) {
        const token = data.token;
        
        // Listar serviços
        return fetch('http://localhost:3001/api/servicos', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
    } else {
        throw new Error('Login failed');
    }
})
.then(response => response.json())
.then(data => {
    console.log('=== SERVIÇOS NO BANCO ===');
    if (data.success && data.data) {
        data.data.forEach(servico => {
            console.log(`ID: ${servico.id} | Nome: ${servico.nome} | Preço: R$ ${servico.preco} | Duração: ${servico.duracao}min`);
        });
        console.log(`Total: ${data.data.length} serviços`);
    } else {
        console.log('Erro ao listar serviços:', data);
    }
})
.catch(error => {
    console.error('ERRO:', error);
});