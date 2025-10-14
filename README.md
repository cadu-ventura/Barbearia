# Barbearia Hoshirara - Sistema de Gestão

Sistema completo de gestão para barbearias com frontend em React e backend em Node.js.

## 📁 Estrutura do Projeto

```
barbearia-hoshirara/
├── frontend/          # Interface React + TypeScript
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── services/      # API client
│   │   ├── styles/        # Estilos CSS
│   │   └── ...
│   ├── public/        # Arquivos estáticos
│   ├── package.json   # Dependências do frontend
│   └── ...
├── backend/           # API Node.js + Express
│   ├── routes/        # Rotas da API
│   ├── database/      # SQLite e configurações
│   ├── scripts/       # Scripts de inicialização
│   ├── package.json   # Dependências do backend
│   └── server.js      # Servidor principal
└── README.md          # Este arquivo
```

## 🚀 Como executar

### Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
Acesse: http://localhost:5173

### Backend (Node.js)
```bash
cd backend
npm install
npm run init-db    # Inicializar banco (apenas na primeira vez)
npm start
```
API: http://localhost:3001/api

## 📱 Funcionalidades

- ✅ Dashboard com estatísticas
- ✅ Gestão de agendamentos
- ✅ Cadastro de clientes
- ✅ Controle de barbeiros
- ✅ Catálogo de serviços
- ✅ Controle financeiro
- ✅ Relatórios e análises
- ✅ Sistema responsivo (mobile + desktop)

## 🔑 Login padrão

- **Email**: admin@barbearia.com
- **Senha**: admin123

## 🛠️ Tecnologias

**Frontend:**
- React 19.1 + TypeScript
- Tailwind CSS 4.0
- Vite 7.1
- React Router DOM
- Lucide React (ícones)

**Backend:**
- Node.js + Express
- SQLite database
- JWT Authentication
- bcryptjs (criptografia)
- CORS, Helmet (segurança)

## 📝 Notas

- O frontend funciona independentemente (com dados mock)
- Para funcionalidades completas, execute frontend + backend
- Banco SQLite é criado automaticamente na primeira execução