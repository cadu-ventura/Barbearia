# Frontend Dockerfile
FROM node:20-alpine as build

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar arquivos de configuração
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY index.html ./

# Copiar código fonte
COPY src/ ./src/
COPY public/ ./public/

# Verificar estrutura antes do build
RUN ls -la && ls -la src/

# Build da aplicação (apenas Vite, sem verificação de tipos)
RUN npx vite build

# Usar nginx para servir arquivos estáticos
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Configuração personalizada do nginx
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]