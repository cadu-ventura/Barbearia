// =============================================================================
// SERVICOS HOOK
// =============================================================================

import { useContext } from 'react';
import { ServicosContext } from './ServicosContext';

/**
 * Hook personalizado para usar o contexto de serviços
 * 
 * @returns {ServicosContextData} Dados e operações dos serviços
 * @throws {Error} Se usado fora do ServicosProvider
 * 
 * @example
 * ```tsx
 * const { items, create, update, remove, loading } = useServicos();
 * 
 * // Buscar serviços ativos
 * const servicosAtivos = getActiveServicos();
 * 
 * // Buscar por faixa de preço
 * const servicosCaros = getServicosByPreco(50, 100);
 * 
 * // Criar novo serviço
 * await create({ 
 *   nome: 'Corte + Barba', 
 *   preco: 45.00, 
 *   duracao: 45,
 *   ativo: true
 * });
 * ```
 */
export const useServicos = () => {
  const context = useContext(ServicosContext);
  
  if (context === undefined) {
    throw new Error('useServicos must be used within a ServicosProvider');
  }
  
  return context;
};

export default useServicos;