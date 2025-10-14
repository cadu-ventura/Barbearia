# 🚀 Deploy da Barbearia Hoshirara

## Deploy no Vercel (Frontend apenas)

1. **Instale o Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Na pasta frontend, execute:**
   ```bash
   vercel
   ```

3. **Siga as instruções e pronto!**

## Deploy no Railway (Fullstack)

1. **Crie conta em https://railway.app**

2. **Conecte seu GitHub**

3. **Configure as variáveis de ambiente:**
   - `NODE_ENV=production`
   - `PORT=3001` (para backend)

4. **Deploy automático via Git push**

## Deploy no Netlify (Frontend)

1. **Acesse https://netlify.com**

2. **Arraste a pasta `frontend/dist` após build**

3. **Ou conecte via Git para deploy automático**

## Comandos úteis

### Build do frontend:
```bash
cd frontend
npm run build
```

### Start do backend:
```bash
cd backend  
npm start
```

## 🌟 URLs de exemplo após deploy:
- Frontend: https://barbearia-hoshirara.vercel.app
- Fullstack: https://barbearia-hoshirara.railway.app