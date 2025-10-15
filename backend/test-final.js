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
        
        // Criar cliente
        return fetch('http://localhost:3001/api/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                nome: 'Cliente Final Test',
                telefone: '11888887777',
                email: 'final@test.com',
                ativo: true
            })
        });
    } else {
        throw new Error('Login failed');
    }
})
.then(response => response.json())
.then(data => {
    console.log('SUCESSO - Cliente criado:', data);
    
    // Listar clientes para confirmar
    return fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: 'admin@hoshirara.com',
            password: 'admin123'
        })
    });
})
.then(response => response.json())
.then(data => {
    return fetch('http://localhost:3001/api/clientes', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + data.token
        }
    });
})
.then(response => response.json())
.then(data => {
    console.log('=== CLIENTES NO BANCO ===');
    if (data.success && data.data) {
        data.data.forEach(cliente => {
            console.log(`ID: ${cliente.id} | Nome: ${cliente.nome} | Tel: ${cliente.telefone} | Email: ${cliente.email}`);
        });
        console.log(`Total: ${data.data.length} clientes`);
    }
})
.catch(error => {
    console.error('ERRO:', error);
});