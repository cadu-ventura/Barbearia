# 💈 Barbearia Hoshirara

Sistema completo de gerenciamento para barbearias, desenvolvido com as mais modernas tecnologias web.

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/cadu-ventura/Barbearia)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)](https://www.typescriptlang.org/)

## ✨ Funcionalidades Principais

### 🎯 **Gestão Completa**
- 📊 **Dashboard Inteligente** - Métricas em tempo real e estatísticas detalhadas
- 👥 **Gestão de Clientes** - CRUD completo com histórico de atendimentos
- ✂️ **Cadastro de Barbeiros** - Controle de profissionais e especialidades
- 🛎️ **Gerenciamento de Serviços** - Catálogo de serviços com preços e duração
- 📅 **Sistema de Agendamentos** - Calendário inteligente com validação de conflitos
- 💰 **Controle Financeiro** - Entrada/saída, relatórios e movimentações
- 📈 **Relatórios Avançados** - Análises por período, barbeiro e tipo de serviço

### 🔐 **Sistema de Autenticação**
- ✅ **Login e Cadastro Seguro** - JWT com criptografia bcrypt
- ✅ **Controle de Acesso** - Roles (Admin, Barbeiro, Recepcionista)
- ✅ **Validação Robusta** - Senhas seguras e verificação de dados
- ✅ **Sessão Persistente** - Token refresh automático

### 🎨 **Interface Moderna**
- ✅ **Design Responsivo** - Funciona em desktop, tablet e mobile
- ✅ **Tema Elegante** - Interface profissional e intuitiva
- ✅ **Animações Suaves** - Transições e feedback visual
- ✅ **UX Otimizada** - Navegação fluida e componentes reutilizáveis

## 🛠️ Tecnologias Utilizadas

### **Frontend**
```json
{
  "framework": "React 18 + TypeScript",
  "build": "Vite (ultra-rápido)",
  "styling": "Tailwind CSS",
  "icons": "Lucide React",
  "state": "Context API",
  "routing": "React Router DOM"
}
```

### **Backend**
```json
{
  "runtime": "Node.js + Express",
  "language": "TypeScript",
  "database": "SQLite (produção: PostgreSQL/MySQL)",
  "auth": "JWT + bcrypt",
  "docs": "Swagger UI",
  "validation": "express-validator"
}
```

## 🚀 Instalação e Execução

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn
- Git

### **1. Clone o Repositório**
```bash
git clone https://github.com/cadu-ventura/Barbearia.git
cd Barbearia
```

### **2. Configuração do Backend**
```bash
cd backend
npm install
npm run dev
```
🟢 **Backend rodando em**: `http://localhost:3001`

### **3. Configuração do Frontend**
```bash
cd ../frontend
npm install
npm run dev
```
🟢 **Frontend rodando em**: `http://localhost:5173`

### **4. Acesso ao Sistema**
- **Aplicação**: http://localhost:5173
- **API Docs**: http://localhost:3001/api-docs
- **Login**: Criar conta ou usar credenciais de teste

## 📚 Documentação da API

### **Swagger UI Completo**
Acesse: `http://localhost:3001/api-docs`

### **Principais Endpoints**
```
🔐 AUTH
POST /api/auth/login     - Login no sistema
POST /api/auth/register  - Cadastro de usuários

👥 CLIENTES  
GET    /api/clientes     - Listar clientes
POST   /api/clientes     - Criar cliente
PUT    /api/clientes/:id - Atualizar cliente
DELETE /api/clientes/:id - Excluir cliente

✂️ BARBEIROS
GET    /api/barbeiros    - Listar barbeiros
POST   /api/barbeiros    - Criar barbeiro
PUT    /api/barbeiros/:id - Atualizar barbeiro
DELETE /api/barbeiros/:id - Excluir barbeiro

🛎️ SERVIÇOS
GET    /api/servicos     - Listar serviços
POST   /api/servicos     - Criar serviço
PUT    /api/servicos/:id - Atualizar serviço
DELETE /api/servicos/:id - Excluir serviço

📅 AGENDAMENTOS
GET    /api/agendamentos - Listar agendamentos
POST   /api/agendamentos - Criar agendamento
PUT    /api/agendamentos/:id - Atualizar agendamento
DELETE /api/agendamentos/:id - Excluir agendamento

💰 FINANCEIRO
GET /api/financeiro      - Movimentações financeiras
GET /api/relatorios/financeiro - Relatório financeiro
GET /api/estatisticas    - Estatísticas gerais
```

## 📦 Estrutura do Projeto

```
Barbearia/
├── 🗂️ backend/                 # API Node.js + Express
│   ├── 📁 src/
│   │   ├── 🛣️ routes/          # Rotas da API (auth, clientes, etc.)
│   │   ├── 📝 types/           # Interfaces TypeScript
│   │   ├── 🔒 middleware/      # Auth, validação, segurança
│   │   ├── ⚙️ config/          # Configurações (Swagger, DB)
│   │   └── 🚀 server.ts        # Servidor principal
│   ├── 📄 package.json
│   └── 🔧 tsconfig.json
│
├── 🗂️ frontend/               # React + TypeScript
│   ├── 📁 src/
│   │   ├── 🧩 components/      # Componentes reutilizáveis
│   │   │   ├── 📱 common/      # Forms, Modal, Mobile
│   │   │   └── 🔧 Sidebar/     # Navegação lateral
│   │   ├── 📄 pages/           # Páginas da aplicação
│   │   │   ├── 🏠 Dashboard.tsx
│   │   │   ├── 👥 Clientes.tsx
│   │   │   ├── ✂️ Barbeiros.tsx
│   │   │   ├── 🛎️ Servicos.tsx
│   │   │   ├── 📅 Agendamentos.tsx
│   │   │   ├── 💰 Financeiro.tsx
│   │   │   ├── 🔐 Login.tsx
│   │   │   └── 📝 Register.tsx
│   │   ├── 🔄 contexts/        # Context API (Auth, App)
│   │   ├── 🌐 services/        # API client
│   │   ├── 🎨 styles/          # CSS global
│   │   └── 📝 types/           # Interfaces TypeScript
│   ├── 📄 package.json
│   └── 🔧 vite.config.ts
│
├── 📖 README.md               # Este arquivo
├── 🚫 .gitignore             # Arquivos ignorados
└── 📄 package.json           # Configuração raiz
```

## 🔒 Segurança Implementada

### **Autenticação JWT**
- Tokens seguros com expiração
- Refresh tokens automáticos
- Logout seguro

### **Criptografia**
- Senhas com bcrypt (salt rounds: 12)
- Validação de força da senha
- Hash seguro no banco de dados

### **Validação de Dados**
- express-validator no backend
- Validação em tempo real no frontend
- Sanitização de inputs
- Prevenção de SQL Injection

### **Controle de Acesso**
- Roles baseados em permissões
- Middleware de autenticação
- Rotas protegidas

## 🎯 Como Usar o Sistema

### **1. Primeiro Acesso**
1. Acesse `http://localhost:5173`
2. Clique em "Criar nova conta"
3. Preencha os dados (senha forte obrigatória)
4. Faça login automático

### **2. Navegação**
- **Dashboard**: Visão geral e estatísticas
- **Clientes**: Cadastro e gestão de clientes
- **Barbeiros**: Controle de profissionais
- **Serviços**: Catálogo de serviços
- **Agendamentos**: Calendário de atendimentos
- **Financeiro**: Controle de movimentações

### **3. Funcionalidades Principais**
- ✅ **CRUD Completo** em todas as seções
- ✅ **Busca e Filtros** avançados
- ✅ **Validação em Tempo Real**
- ✅ **Feedback Visual** de ações
- ✅ **Responsividade** total

## 🚀 Deploy em Produção

### **Opções de Hospedagem**
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Backend**: Railway, Render, Heroku
- **Banco**: PostgreSQL, MySQL, MongoDB

### **Variáveis de Ambiente**
```env
# Backend
PORT=3001
JWT_SECRET=seu_jwt_secret_super_seguro
DB_URL=url_do_banco_producao

# Frontend  
VITE_API_URL=https://sua-api.com
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Desenvolvedor

**Cadu Ventura**
- GitHub: [@cadu-ventura](https://github.com/cadu-ventura)
- Email: cadu.eduardovs@gmail.com

---

<div align="center">

**Desenvolvido com ❤️ para facilitar a gestão de barbearias**

⭐ **Se este projeto te ajudou, deixe uma star!** ⭐

</div>