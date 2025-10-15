# Arquitetura de Contextos - Barbearia Hoshirara

## 🏗️ Estrutura Seguindo Padrões de Mercado

Esta implementação segue as melhores práticas adotadas por empresas como **Netflix**, **Airbnb**, **Uber** e **Spotify** para aplicações React/TypeScript enterprise.

## 📁 Estrutura de Pastas

```text
frontend/src/contexts/
├── shared/
│   └── types.ts              # Tipos compartilhados e interfaces genéricas
├── clientes/
│   ├── ClientesContext.tsx   # Contexto específico de clientes
│   ├── useClientes.ts        # Hook personalizado
│   └── index.ts              # Exportações do módulo
├── barbeiros/
│   ├── BarbeirosContext.tsx  # Contexto específico de barbeiros
│   ├── useBarbeiros.ts       # Hook personalizado
│   └── index.ts              # Exportações do módulo
├── servicos/
│   ├── ServicosContext.tsx   # Contexto específico de serviços
│   ├── useServicos.ts        # Hook personalizado
│   └── index.ts              # Exportações do módulo
├── agendamentos/
│   ├── AgendamentosContext.tsx # Contexto específico de agendamentos
│   ├── useAgendamentos.ts    # Hook personalizado
│   └── index.ts              # Exportações do módulo
├── AppProvider.tsx           # Provider principal que combina todos
└── index.ts                  # Exportações centralizadas
```

## 🎯 Vantagens da Arquitetura Separada

### 1. **Performance Superior**
- ✅ Re-renders isolados por domínio
- ✅ Componentes só re-renderizam quando seu contexto específico muda
- ✅ Eliminação de re-renders desnecessários

### 2. **Manutenibilidade**
- ✅ Código organizado por domínio de negócio
- ✅ Fácil localização de bugs e funcionalidades
- ✅ Modificações isoladas sem impacto em outros domínios

### 3. **Testabilidade**
- ✅ Testes unitários isolados por contexto
- ✅ Mocks específicos por domínio
- ✅ Cobertura de testes mais granular

### 4. **Escalabilidade**
- ✅ Fácil adição de novos domínios
- ✅ Suporte a equipes grandes trabalhando em paralelo
- ✅ Arquitetura preparada para microfrontends

## 🚀 Como Usar

### Configuração Inicial

```tsx
// src/main.tsx ou App.tsx
import { AppProvider } from './contexts';

function App() {
  return (
    <AppProvider>
      <Routes>
        {/* Suas rotas */}
      </Routes>
    </AppProvider>
  );
}
```

### Uso em Componentes

```tsx
// Componente que trabalha apenas com clientes
import { useClientes } from '../contexts';

function ClientesPage() {
  const { items, create, loading } = useClientes();
  
  // Lógica específica de clientes
}

// Componente que trabalha com múltiplos domínios
import { useClientes, useBarbeiros, useServicos } from '../contexts';

function AgendamentoForm() {
  const { items: clientes } = useClientes();
  const { items: barbeiros } = useBarbeiros();
  const { items: servicos } = useServicos();
  
  // Lógica de agendamento
}
```

## 🎨 Padrões Implementados

### 1. **CRUD Padronizado**
Todos os contextos implementam a interface `CrudOperations<T>`:

```typescript
interface CrudOperations<T> {
  items: T[];
  loading: LoadingState;
  create: (data: Omit<T, 'id'>) => Promise<void>;
  update: (id: string, data: Partial<T>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
  findById: (id: string) => T | undefined;
}
```

### 2. **Business Logic Methods**
Cada contexto possui métodos específicos do domínio:

```typescript
// ClientesContext
searchByName(name: string): Cliente[]
getActiveClientes(): Cliente[]
getTotalAtendimentos(): number

// BarbeirosContext
getBarbeirosByEspecialidade(especialidade: string): Barbeiro[]
getAllEspecialidades(): string[]

// ServicosContext
getServicosByPreco(min: number, max: number): Servico[]
getTotalValorServicos(): number

// AgendamentosContext
getAgendamentosHoje(): Agendamento[]
getAgendamentosByBarbeiro(id: string): Agendamento[]
updateStatus(id: string, status: Status): Promise<void>
```

### 3. **Loading States Consistentes**
Estado de carregamento padronizado:

```typescript
interface LoadingState {
  isLoading: boolean;
  error: string | null;
}
```

## 📊 Comparação: Antes vs Depois

| Aspecto | Context Único (Antes) | Contextos Separados (Depois) |
|---------|----------------------|------------------------------|
| **Performance** | ❌ Re-renders em cascata | ✅ Re-renders isolados |
| **Bundle Size** | ❌ Carregamento de tudo | ✅ Code splitting natural |
| **Manutenção** | ❌ Arquivo gigante | ✅ Arquivos pequenos e focados |
| **Testes** | ❌ Testes complexos | ✅ Testes simples e isolados |
| **Colaboração** | ❌ Conflitos constantes | ✅ Trabalho paralelo sem conflitos |
| **Debugging** | ❌ Difícil rastrear problemas | ✅ Fácil identificação de problemas |

## 🔧 Migração do Context Antigo

Para manter compatibilidade durante a transição:

```tsx
// Antes (AppContext único)
const { clientes, adicionarCliente } = useApp();

// Depois (Contextos separados)
const { items: clientes, create: adicionarCliente } = useClientes();
```

## 🎯 Próximos Passos

1. **Implementar Context de Financeiro** para movimentações
2. **Adicionar Context de Relatórios** para análises
3. **Implementar Context de Configurações** para preferências
4. **Adicionar Middleware de Cache** para otimização
5. **Implementar Offline Support** com sincronização

## 📚 Referências

- [React Context Best Practices](https://react.dev/reference/react/createContext)
- [Kent C. Dodds - Application State Management](https://kentcdodds.com/blog/application-state-management-with-react)
- [Netflix Tech Blog - Context Patterns](https://netflixtechblog.com/context-patterns-react)
- [Airbnb Engineering - React Performance](https://medium.com/airbnb-engineering/recent-web-performance-fixes-on-airbnb-listing-pages-6cd8d93df6f4)

---

> 💡 **Dica**: Esta arquitetura está preparada para escalar conforme o crescimento da aplicação, mantendo sempre a performance e manutenibilidade em primeiro lugar.