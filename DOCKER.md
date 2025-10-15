# 🐳 Barbearia Hoshirara - Docker Setup

Este projeto inclui configuração completa do Docker com Frontend + Backend + PostgreSQL.

## 🚀 Como usar

### Pré-requisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop) instalado
- Pelo menos 6GB de RAM disponível

### Comandos rápidos

**Sistema Completo (Recomendado):**
```bash
# Iniciar tudo (Frontend + Backend + PostgreSQL)
docker-compose up -d --build

# Parar tudo
docker-compose down

# Ver status
docker-compose ps

# Ver logs
docker-compose logs frontend
docker-compose logs backend
docker-compose logs postgres
```

**Apenas Backend + PostgreSQL:**
```bash
# Para desenvolvimento frontend local
docker-compose -f docker-compose.backend-only.yml up -d --build

# Parar
docker-compose -f docker-compose.backend-only.yml down
```

### Scripts automatizados

**Windows:**
```cmd
# Iniciar aplicação
docker.bat start

# Parar aplicação
docker.bat stop

# Ver logs
docker.bat logs

# Reiniciar tudo
docker.bat restart
```

**Linux/Mac:**
```bash
# Dar permissão de execução
chmod +x docker.sh

# Iniciar aplicação
./docker.sh start

# Parar aplicação
./docker.sh stop

# Ver logs
./docker.sh logs
```

## 🌐 URLs da aplicação

Após iniciar com Docker:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **Swagger Docs**: http://localhost:3001/api-docs
- **Health Check**: http://localhost:3001/health
- **PostgreSQL**: localhost:5432 (postgres/postgres123)

## 📁 Estrutura Docker

```
├── docker-compose.yml      # Orquestração dos serviços
├── backend/
│   ├── Dockerfile         # Imagem do backend
│   └── .dockerignore     # Arquivos ignorados
├── frontend/
│   ├── Dockerfile        # Imagem do frontend  
│   ├── nginx.conf        # Configuração do Nginx
│   └── .dockerignore     # Arquivos ignorados
├── docker.sh            # Script para Linux/Mac
└── docker.bat           # Script para Windows
```

## 🔧 Configurações

### PostgreSQL (Único banco de dados)
- **Porta**: 5432
- **Database**: barbearia_hoshirara
- **Usuário**: postgres / postgres123
- **Volume**: postgres_data (persistente)
- **Inicialização**: Script automático (/backend/database/init.sql)
- **Substituiu**: SQLite removido completamente

### Backend
- **Porta**: 3001
- **Database**: PostgreSQL via rede interna
- **Environment**: Produção
- **Health check**: wget localhost:3001/health

### Frontend  
- **Porta**: 5173 → 80 (via Nginx)
- **Proxy API**: `/api` → `backend:3001/api`
- **Build**: Vite + React + Nginx
- **Health check**: wget localhost/

### Networking
- **Rede interna**: `barbearia-network`
- **CORS**: Resolvido via proxy Nginx
- **Health checks**: Automáticos para todos os serviços
- **Dependências**: Frontend → Backend → PostgreSQL

## 🚨 Resolução de problemas

### Porta ocupada
```bash
# Verificar o que está usando a porta
netstat -ano | findstr :80
netstat -ano | findstr :3001

# Parar processo (Windows)
taskkill /PID <PID> /F
```

### Limpar cache Docker
```bash
# Limpar tudo (cuidado!)
./docker.sh clean

# Ou manualmente
docker system prune -a --volumes
```

### Logs detalhados
```bash
# Ver logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend

# Ver logs com timestamps
docker-compose logs -f -t
```

## 🔄 Development vs Production

### Development (atual)
```bash
# Frontend
cd frontend && npm run dev

# Backend  
cd backend && npm run dev
```

### Production (Docker)
```bash
# Tudo junto
./docker.sh start
```

## 📊 Monitoramento

O Docker inclui health checks automáticos:

```bash
# Ver status dos containers
docker-compose ps

# Ver health checks
docker inspect <container_name> | grep Health -A 10
```

## 🔒 Segurança

- Variables de ambiente isoladas
- Rede interna entre containers
- Nginx como reverse proxy
- SQLite em volume persistente
- Logs estruturados