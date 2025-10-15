// =============================================================================
// CLIENTES HOOK
// =============================================================================

import { useContext } from 'react';
import { ClientesContext } from './ClientesContext';

/**
 * Hook personalizado para usar o contexto de clientes
 * 
 * @returns {ClientesContextData} Dados e operações dos clientes
 * @throws {Error} Se usado fora do ClientesProvider
 * 
 * @example
 * ```tsx
 * const { items, create, update, remove, loading } = useClientes();
 * 
 * // Buscar clientes ativos
 * const clientesAtivos = getActiveClientes();
 * 
 * // Criar novo cliente
 * await create({ nome: 'João', telefone: '123456789', email: 'joao@email.com' });
 * ```
 */
export const useClientes = () => {
  const context = useContext(ClientesContext);
  
  if (context === undefined) {
    throw new Error('useClientes must be used within a ClientesProvider');
  }
  
  return context;
};

export default useClientes;