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
    console.log('Login response:', data);
    if (data.success && data.token) {
        const token = data.token;
        console.log('Token obtido:', token.substring(0,20) + '...');
        
        // Testar criação de serviço
        return fetch('http://localhost:3001/api/servicos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                nome: 'Corte Debug',
                descricao: 'Corte de teste',
                preco: 25.50,
                duracao: 30,
                ativo: true
            })
        });
    } else {
        throw new Error('Login failed: ' + JSON.stringify(data));
    }
})
.then(response => response.json())
.then(data => {
    console.log('SUCESSO - Serviço criado:', data);
})
.catch(error => {
    console.error('ERRO:', error);
});