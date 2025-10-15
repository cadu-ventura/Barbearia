// =============================================================================
// CONTEXTS INDEX - MAIN EXPORTS
// =============================================================================
// Exportações centralizadas seguindo padrões de mercado
// =============================================================================

// Main App Provider
export { default as AppProvider, useApp } from './AppProvider';

// Domain Contexts
export * from './clientes';
export * from './barbeiros';
export * from './servicos';
export * from './agendamentos';

// Shared Types
export * from './shared/types';

// Legacy support será adicionado quando necessário