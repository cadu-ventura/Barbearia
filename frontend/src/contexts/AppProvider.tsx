// =============================================================================
// APP PROVIDER - MAIN CONTEXT COMPOSITION
// =============================================================================
// Este é o provider principal que combina todos os contextos seguindo
// as melhores práticas do mercado para aplicações React/TypeScript
// =============================================================================

import React from 'react';
import { ClientesProvider } from './clientes';
import { BarbeirosProvider } from './barbeiros';
import { ServicosProvider } from './servicos';
import { AgendamentosProvider } from './agendamentos';

interface AppProviderProps {
  children: React.ReactNode;
}

/**
 * Provider principal que combina todos os contextos de domínio
 * 
 * Arquitetura de Contextos Separados:
 * - Melhor performance (re-renders isolados)
 * - Manutenibilidade superior
 * - Testabilidade individual
 * - Separação de responsabilidades
 * - Padrão seguido por empresas como Netflix, Airbnb, Uber
 * 
 * @example
 * ```tsx
 * // No App.tsx ou main.tsx
 * <AppProvider>
 *   <App />
 * </AppProvider>
 * 
 * // Em qualquer componente
 * const { items: clientes } = useClientes();
 * const { items: barbeiros } = useBarbeiros();
 * const { items: servicos } = useServicos();
 * const { items: agendamentos } = useAgendamentos();
 * ```
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <ClientesProvider>
      <BarbeirosProvider>
        <ServicosProvider>
          <AgendamentosProvider>
            {children}
          </AgendamentosProvider>
        </ServicosProvider>
      </BarbeirosProvider>
    </ClientesProvider>
  );
};

/**
 * Hook composto para acessar múltiplos contextos quando necessário
 * 
 * IMPORTANTE: Use apenas quando realmente precisar de múltiplos contextos
 * Na maioria dos casos, prefira usar os hooks individuais (useClientes, useBarbeiros, etc.)
 * 
 * @example
 * ```tsx
 * // Para componentes que precisam de múltiplos contextos
 * const { clientes, barbeiros, servicos, agendamentos } = useApp();
 * 
 * // Preferível: usar hooks individuais
 * const { items: clientes } = useClientes();
 * const { items: barbeiros } = useBarbeiros();
 * ```
 */
export const useApp = () => {
  // Este hook será implementado apenas se necessário
  // Por enquanto, mantemos os hooks individuais como padrão
  throw new Error(
    'useApp() não está implementado. Use os hooks individuais: useClientes(), useBarbeiros(), useServicos(), useAgendamentos()'
  );
};

export default AppProvider;