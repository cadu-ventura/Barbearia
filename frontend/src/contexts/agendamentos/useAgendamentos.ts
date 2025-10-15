// =============================================================================
// AGENDAMENTOS HOOK
// =============================================================================

import { useContext } from 'react';
import { AgendamentosContext } from './AgendamentosContext';

/**
 * Hook personalizado para usar o contexto de agendamentos
 * 
 * @returns {AgendamentosContextData} Dados e operações dos agendamentos
 * @throws {Error} Se usado fora do AgendamentosProvider
 * 
 * @example
 * ```tsx
 * const { items, create, update, remove, loading, updateStatus } = useAgendamentos();
 * 
 * // Buscar agendamentos de hoje
 * const agendamentosHoje = getAgendamentosHoje();
 * 
 * // Buscar agendamentos por barbeiro
 * const agendamentosBarbeiro = getAgendamentosByBarbeiro('barbeiro-id');
 * 
 * // Atualizar status
 * await updateStatus('agendamento-id', 'concluido');
 * 
 * // Criar novo agendamento
 * await create({
 *   clienteId: 'cliente-id',
 *   barbeiroId: 'barbeiro-id', 
 *   servicoId: 'servico-id',
 *   dataHora: '2024-01-15T10:00:00',
 *   status: 'agendado'
 * });
 * ```
 */
export const useAgendamentos = () => {
  const context = useContext(AgendamentosContext);
  
  if (context === undefined) {
    throw new Error('useAgendamentos must be used within a AgendamentosProvider');
  }
  
  return context;
};

export default useAgendamentos;