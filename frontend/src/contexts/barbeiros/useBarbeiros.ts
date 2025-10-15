// =============================================================================
// BARBEIROS HOOK
// =============================================================================

import { useContext } from 'react';
import { BarbeirosContext } from './BarbeirosContext';

/**
 * Hook personalizado para usar o contexto de barbeiros
 * 
 * @returns {BarbeirosContextData} Dados e operações dos barbeiros
 * @throws {Error} Se usado fora do BarbeirosProvider
 * 
 * @example
 * ```tsx
 * const { items, create, update, remove, loading } = useBarbeiros();
 * 
 * // Buscar barbeiros ativos
 * const barbeirosAtivos = getActiveBarbeiros();
 * 
 * // Buscar por especialidade
 * const barbeirosCorte = getBarbeirosByEspecialidade('Corte');
 * 
 * // Criar novo barbeiro
 * await create({ 
 *   nome: 'João', 
 *   telefone: '123456789', 
 *   email: 'joao@email.com',
 *   especialidades: ['Corte', 'Barba'],
 *   ativo: true
 * });
 * ```
 */
export const useBarbeiros = () => {
  const context = useContext(BarbeirosContext);
  
  if (context === undefined) {
    throw new Error('useBarbeiros must be used within a BarbeirosProvider');
  }
  
  return context;
};

export default useBarbeiros;