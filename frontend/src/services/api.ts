// API Client para Barbearia Hoshirara - Compatibilidade
// NOTA: Este arquivo mantém compatibilidade com código existente
// Para novos desenvolvimentos, use os módulos em ./api/

// Importações diretas
import { clientesApi } from './api/clientes';
import { barbeirosApi } from './api/barbeiros';
import { servicosApi } from './api/servicos';
import { agendamentosApi } from './api/agendamentos';
import { financeiroApi } from './api/financeiro';
import { authApi } from './api/auth';

// Re-exporta tudo da nova estrutura
export * from './api';

// API unificada para compatibilidade com código existente
export class ApiClient {
  // Clientes
  getClientes = () => clientesApi.getAll();
  getClienteById = (id: string) => clientesApi.getById(id);
  createCliente = (cliente: any) => clientesApi.create(cliente);
  updateCliente = (id: string, cliente: any) => clientesApi.update(id, cliente);
  deleteCliente = (id: string) => clientesApi.delete(id);

  // Barbeiros
  getBarbeiros = () => barbeirosApi.getAll();
  getBarbeiroById = (id: string) => barbeirosApi.getById(id);
  createBarbeiro = (barbeiro: any) => barbeirosApi.create(barbeiro);
  updateBarbeiro = (id: string, barbeiro: any) => barbeirosApi.update(id, barbeiro);
  deleteBarbeiro = (id: string) => barbeirosApi.delete(id);

  // Serviços
  getServicos = () => servicosApi.getAll();
  getServicoById = (id: string) => servicosApi.getById(id);
  createServico = (servico: any) => servicosApi.create(servico);
  updateServico = (id: string, servico: any) => servicosApi.update(id, servico);
  deleteServico = (id: string) => servicosApi.delete(id);

  // Agendamentos
  getAgendamentos = () => agendamentosApi.getAll();
  getAgendamentoById = (id: string) => agendamentosApi.getById(id);
  createAgendamento = (agendamento: any) => agendamentosApi.create(agendamento);
  updateAgendamento = (id: string, agendamento: any) => agendamentosApi.update(id, agendamento);
  deleteAgendamento = (id: string) => agendamentosApi.delete(id);

  // Financeiro
  getMovimentacoesFinanceiras = () => financeiroApi.getAll();
  createMovimentacaoFinanceira = (movimentacao: any) => financeiroApi.create(movimentacao);
  updateMovimentacaoFinanceira = (id: string, movimentacao: any) => financeiroApi.update(id, movimentacao);
  deleteMovimentacaoFinanceira = (id: string) => financeiroApi.delete(id);
  getFinanceiro = () => financeiroApi.getAll();
  getRelatorioFinanceiro = (params?: any) => financeiroApi.getRelatorio(params);

  // Autenticação
  login = (email: string, senha: string) => authApi.login(email, senha);
  register = (userData: any) => authApi.register(userData);

  // Métodos adicionais para compatibilidade
  getRelatorioAtendimentos = (_params?: any) => {
    // Implementar quando necessário
    return Promise.resolve({ success: true, data: [] });
  };

  getEstatisticas = () => {
    // Implementar quando necessário
    return Promise.resolve({ success: true, data: {} });
  };
}

export const api = new ApiClient();
export default api;