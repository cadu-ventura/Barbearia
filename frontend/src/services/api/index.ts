// Exportações centralizadas da API
export { httpClient } from './client';
export { clientesApi, ClientesApi } from './clientes';
export { barbeirosApi, BarbeirosApi } from './barbeiros';
export { servicosApi, ServicosApi } from './servicos';
export { agendamentosApi, AgendamentosApi } from './agendamentos';
export { financeiroApi, FinanceiroApi } from './financeiro';
export { authApi, AuthApi, type LoginResponse, type RegisterData } from './auth';

// Apenas exportações centralizadas dos módulos individuais
// A classe ApiClient está agora em ../api.ts para evitar referência circular