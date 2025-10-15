# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências (incluindo devDependencies para build)
RUN npm ci

# Copiar tsconfig.json primeiro
COPY tsconfig.json ./

# Copiar código fonte
COPY . .

# Verificar estrutura antes do build
RUN ls -la && ls -la src/

# Compilar TypeScript com configuração específica
RUN npx tsc --project tsconfig.json

# Limpar devDependencies após build
RUN npm ci --only=production && npm cache clean --force

# Expor porta
EXPOSE 3001

# Comando para iniciar
CMD ["npm", "start"]