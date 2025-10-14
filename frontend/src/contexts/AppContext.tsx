/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Cliente, Barbeiro, Servico, Agendamento, MovimentacaoFinanceira, FormaPagamento } from '../types';
import type { AppContextType } from '../types/context';
import apiClient from '../services/api';

export const AppContext = createContext<AppContextType | undefined>(undefined);



interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoFinanceira[]>([]);

  // Carregar dados da API na inicialização
  useEffect(() => {
    const carregarDados = async () => {
      try {
        console.log('🔄 Carregando dados da API...');
        
        // Carregar todos os dados em paralelo
        const [clientesResponse, barbeirosResponse, servicosResponse] = await Promise.all([
          apiClient.getClientes(),
          apiClient.getBarbeiros(),
          apiClient.getServicos()
        ]);

        // Processar clientes
        if (clientesResponse.success && clientesResponse.data) {
          console.log('✅ Clientes carregados:', clientesResponse.data.length);
          const clientesConvertidos = clientesResponse.data.map(cliente => ({
            id: cliente.id,
            nome: cliente.nome,
            telefone: cliente.telefone,
            email: cliente.email || '',
            ativo: true,
            dataCadastro: new Date(),
            totalAtendimentos: 0,
            observacoes: ''
          }));
          setClientes(clientesConvertidos);
        } else {
          console.warn('❌ Erro ao carregar clientes, usando lista vazia');
          setClientes([]);
        }

        // Processar barbeiros
        if (barbeirosResponse.success && barbeirosResponse.data) {
          console.log('✅ Barbeiros carregados:', barbeirosResponse.data.length);
          const barbeirosConvertidos = barbeirosResponse.data.map(barbeiro => ({
            id: barbeiro.id,
            nome: barbeiro.nome,
            telefone: barbeiro.telefone || '',
            email: barbeiro.email || '',
            especialidades: barbeiro.especialidades || [],
            ativo: barbeiro.ativo !== false,
            cpf: '',
            comissao: 50,
            horarioTrabalho: [
              { diaSemana: 1, horaInicio: '08:00', horaFim: '18:00' },
              { diaSemana: 2, horaInicio: '08:00', horaFim: '18:00' },
              { diaSemana: 3, horaInicio: '08:00', horaFim: '18:00' },
              { diaSemana: 4, horaInicio: '08:00', horaFim: '18:00' },
              { diaSemana: 5, horaInicio: '08:00', horaFim: '18:00' },
              { diaSemana: 6, horaInicio: '08:00', horaFim: '14:00' }
            ],
            totalAtendimentos: 0,
            dataCadastro: new Date()
          }));
          setBarbeiros(barbeirosConvertidos);
        } else {
          console.warn('❌ Erro ao carregar barbeiros, usando lista vazia');
          setBarbeiros([]);
        }

        // Processar serviços
        if (servicosResponse.success && servicosResponse.data) {
          console.log('✅ Serviços carregados:', servicosResponse.data.length);
          const servicosConvertidos = servicosResponse.data.map(servico => ({
            id: servico.id,
            nome: servico.nome,
            preco: servico.preco,
            duracao: servico.duracao,
            ativo: servico.ativo !== false,
            descricao: '',
            categoria: 'outros' as const,
            comissaoBarbeiro: 50
          }));
          setServicos(servicosConvertidos);
        } else {
          console.warn('❌ Erro ao carregar serviços, usando lista vazia');
          setServicos([]);
        }

        // Por enquanto, manter agendamentos e movimentações vazios até implementar API
        setAgendamentos([]);
        setMovimentacoes([]);
        
        console.log('✅ Dados carregados da API com sucesso!');
      } catch (error) {
        console.error('❌ Erro ao carregar dados da API:', error);
        // Em caso de erro, usar listas vazias
        setClientes([]);
        setBarbeiros([]);
        setServicos([]);
        setAgendamentos([]);
        setMovimentacoes([]);
      }
    };

    carregarDados();
  }, []);

  // Função para gerar IDs únicos
  const gerarId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  // Ações para Clientes
  const adicionarCliente = async (novoCliente: Omit<Cliente, 'id'>) => {
    try {
      console.log('🔄 Criando cliente:', novoCliente);
      const response = await apiClient.createCliente(novoCliente);
      
      if (response.success && response.data) {
        console.log('✅ Cliente criado com sucesso!');
        // Converter dados da API para frontend
        const clienteConvertido = {
          id: response.data.id,
          nome: response.data.nome,
          telefone: response.data.telefone,
          email: response.data.email || '',
          ativo: true,
          dataCadastro: new Date(),
          totalAtendimentos: 0,
          observacoes: response.data.observacoes || ''
        };
        setClientes(prev => [...prev, clienteConvertido]);
      } else {
        console.error('❌ Erro ao criar cliente:', response.error);
      }
    } catch (error) {
      console.error('❌ Erro de conexão ao criar cliente:', error);
    }
  };

  const atualizarCliente = async (id: string, dadosAtualizados: Partial<Cliente>) => {
    try {
      console.log('🔄 Atualizando cliente:', id, dadosAtualizados);
      const response = await apiClient.updateCliente(id, dadosAtualizados);
      
      if (response.success) {
        console.log('✅ Cliente atualizado com sucesso!');
        setClientes(prev => 
          prev.map(cliente => 
            cliente.id === id 
              ? { ...cliente, ...dadosAtualizados }
              : cliente
          )
        );
      } else {
        console.error('❌ Erro ao atualizar cliente:', response.error);
      }
    } catch (error) {
      console.error('❌ Erro de conexão ao atualizar cliente:', error);
    }
  };

  const excluirCliente = async (id: string) => {
    try {
      console.log('🗑️ Tentando excluir cliente:', id);
      const response = await apiClient.deleteCliente(id);
      console.log('📡 Resposta da API:', response);
      
      if (response.success) {
        console.log('✅ Cliente desativado com sucesso! Removendo da lista...');
        // Para soft delete, remove da lista local (simula desativação)
        setClientes(prev => prev.filter(cliente => cliente.id !== id));
      } else {
        console.error('❌ Erro ao excluir cliente:', response.error);
        alert('Erro ao excluir cliente: ' + response.error);
      }
    } catch (error) {
      console.error('❌ Erro de rede ao excluir cliente:', error);
      alert('Erro de conexão ao excluir cliente');
    }
  };

  // Ações para Barbeiros
  const adicionarBarbeiro = async (novoBarbeiro: Omit<Barbeiro, 'id'>) => {
    try {
      console.log('🔄 Criando barbeiro:', novoBarbeiro);
      const response = await apiClient.createBarbeiro(novoBarbeiro);
      
      if (response.success && response.data) {
        console.log('✅ Barbeiro criado com sucesso!');
        // Converter dados da API para frontend
        const barbeiroConvertido = {
          id: response.data.id,
          nome: response.data.nome,
          telefone: response.data.telefone || '',
          email: response.data.email || '',
          especialidades: response.data.especialidades || [],
          ativo: response.data.ativo !== false,
          cpf: '',
          comissao: 50,
          horarioTrabalho: [
            { diaSemana: 1, horaInicio: '08:00', horaFim: '18:00' },
            { diaSemana: 2, horaInicio: '08:00', horaFim: '18:00' },
            { diaSemana: 3, horaInicio: '08:00', horaFim: '18:00' },
            { diaSemana: 4, horaInicio: '08:00', horaFim: '18:00' },
            { diaSemana: 5, horaInicio: '08:00', horaFim: '18:00' },
            { diaSemana: 6, horaInicio: '08:00', horaFim: '14:00' }
          ],
          totalAtendimentos: 0,
          dataCadastro: new Date()
        };
        setBarbeiros(prev => [...prev, barbeiroConvertido]);
      } else {
        console.error('❌ Erro ao criar barbeiro:', response.error);
      }
    } catch (error) {
      console.error('❌ Erro de conexão ao criar barbeiro:', error);
    }
  };

  const atualizarBarbeiro = async (id: string, dadosAtualizados: Partial<Barbeiro>) => {
    try {
      console.log('🔄 Atualizando barbeiro:', id, dadosAtualizados);
      const response = await apiClient.updateBarbeiro(id, dadosAtualizados);
      
      if (response.success) {
        console.log('✅ Barbeiro atualizado com sucesso!');
        setBarbeiros(prev => 
          prev.map(barbeiro => 
            barbeiro.id === id 
              ? { ...barbeiro, ...dadosAtualizados }
              : barbeiro
          )
        );
      } else {
        console.error('❌ Erro ao atualizar barbeiro:', response.error);
      }
    } catch (error) {
      console.error('❌ Erro de conexão ao atualizar barbeiro:', error);
    }
  };

  const excluirBarbeiro = async (id: string) => {
    try {
      console.log('🗑️ Tentando excluir barbeiro:', id);
      const response = await apiClient.deleteBarbeiro(id);
      console.log('📡 Resposta da API:', response);
      
      if (response.success) {
        console.log('✅ Barbeiro desativado com sucesso! Removendo da lista...');
        // Para soft delete, remove da lista local (simula desativação)
        setBarbeiros(prev => prev.filter(barbeiro => barbeiro.id !== id));
      } else {
        console.error('❌ Erro ao excluir barbeiro:', response.error);
        alert('Erro ao excluir barbeiro: ' + response.error);
      }
    } catch (error) {
      console.error('❌ Erro de rede ao excluir barbeiro:', error);
      alert('Erro de conexão ao excluir barbeiro');
    }
  };

  // Ações para Serviços
  const adicionarServico = async (novoServico: Omit<Servico, 'id'>) => {
    try {
      console.log('🔄 Criando serviço:', novoServico);
      const response = await apiClient.createServico(novoServico);
      
      if (response.success && response.data) {
        console.log('✅ Serviço criado com sucesso!');
        // Converter dados da API para frontend
        const servicoConvertido = {
          id: response.data.id,
          nome: response.data.nome,
          preco: response.data.preco,
          duracao: response.data.duracao,
          ativo: response.data.ativo !== false,
          descricao: '',
          categoria: 'outros' as const,
          comissaoBarbeiro: 50
        };
        setServicos(prev => [...prev, servicoConvertido]);
      } else {
        console.error('❌ Erro ao criar serviço:', response.error);
      }
    } catch (error) {
      console.error('❌ Erro de conexão ao criar serviço:', error);
    }
  };

  const atualizarServico = async (id: string, dadosAtualizados: Partial<Servico>) => {
    try {
      console.log('🔄 Atualizando serviço:', id, dadosAtualizados);
      const response = await apiClient.updateServico(id, dadosAtualizados);
      
      if (response.success) {
        console.log('✅ Serviço atualizado com sucesso!');
        setServicos(prev => 
          prev.map(servico => 
            servico.id === id 
              ? { ...servico, ...dadosAtualizados }
              : servico
          )
        );
      } else {
        console.error('❌ Erro ao atualizar serviço:', response.error);
      }
    } catch (error) {
      console.error('❌ Erro de conexão ao atualizar serviço:', error);
    }
  };

  const excluirServico = async (id: string) => {
    try {
      console.log('🗑️ Tentando excluir serviço:', id);
      const response = await apiClient.deleteServico(id);
      console.log('📡 Resposta da API:', response);
      
      if (response.success) {
        console.log('✅ Serviço desativado com sucesso! Removendo da lista...');
        // Para soft delete, remove da lista local (simula desativação)
        setServicos(prev => prev.filter(servico => servico.id !== id));
      } else {
        console.error('❌ Erro ao excluir serviço:', response.error);
        alert('Erro ao excluir serviço: ' + response.error);
      }
    } catch (error) {
      console.error('❌ Erro de rede ao excluir serviço:', error);
      alert('Erro de conexão ao excluir serviço');
    }
  };

  // Ações para Agendamentos
  const adicionarAgendamento = async (novoAgendamento: Omit<Agendamento, 'id'>) => {
    try {
      console.log('🔄 Criando agendamento:', novoAgendamento);
      // Converter dados para o formato da API
      const dadosParaAPI = {
        ...novoAgendamento,
        dataHora: novoAgendamento.dataHora.toISOString(),
        servicoId: novoAgendamento.servicoIds?.[0] || '',
        servicoIds: novoAgendamento.servicoIds || []
      };
      
      const response = await apiClient.createAgendamento(dadosParaAPI);
      
      if (response.success && response.data) {
        console.log('✅ Agendamento criado com sucesso!');
        // Converter dados da API para o formato do frontend
        const agendamentoConvertido: Agendamento = {
          id: response.data.id,
          clienteId: response.data.clienteId,
          barbeiroId: response.data.barbeiroId,
          servicoIds: response.data.servicoIds || [response.data.servicoId],
          dataHora: new Date(response.data.dataHora),
          status: response.data.status,
          observacoes: response.data.observacoes,
          valorTotal: response.data.valorTotal || 0,
          formaPagamento: response.data.formaPagamento as FormaPagamento,
          dataCriacao: new Date(),
          dataAtualizacao: new Date()
        };
        setAgendamentos(prev => [...prev, agendamentoConvertido]);
      } else {
        console.error('❌ Erro ao criar agendamento:', response.error);
      }
    } catch (error) {
      console.error('❌ Erro de conexão ao criar agendamento:', error);
    }
  };

  const atualizarAgendamento = async (id: string, dadosAtualizados: Partial<Agendamento>) => {
    try {
      console.log('🔄 Tentando atualizar agendamento:', id, dadosAtualizados);
      
      // Converter dados para o formato esperado pela API
      const dadosParaAPI = {
        ...dadosAtualizados,
        dataHora: dadosAtualizados.dataHora ? dadosAtualizados.dataHora.toISOString() : undefined
      };
      
      const response = await apiClient.updateAgendamento(id, dadosParaAPI);
      console.log('📡 Resposta da API:', response);
      
      if (response.success) {
        console.log('✅ Agendamento atualizado com sucesso! Atualizando lista...');
        setAgendamentos(prev => 
          prev.map(agendamento => 
            agendamento.id === id 
              ? { ...agendamento, ...dadosAtualizados }
              : agendamento
          )
        );
      } else {
        console.error('❌ Erro ao atualizar agendamento:', response.error);
        alert('Erro ao atualizar agendamento: ' + response.error);
      }
    } catch (error) {
      console.error('❌ Erro de rede ao atualizar agendamento:', error);
      alert('Erro de conexão ao atualizar agendamento');
    }
  };

  const excluirAgendamento = async (id: string) => {
    try {
      console.log('🗑️ Tentando excluir agendamento:', id);
      const response = await apiClient.deleteAgendamento(id);
      console.log('📡 Resposta da API:', response);
      
      if (response.success) {
        console.log('✅ Agendamento excluído com sucesso! Removendo da lista...');
        setAgendamentos(prev => prev.filter(agendamento => agendamento.id !== id));
      } else {
        console.error('❌ Erro ao excluir agendamento:', response.error);
        alert('Erro ao excluir agendamento: ' + response.error);
      }
    } catch (error) {
      console.error('❌ Erro de rede ao excluir agendamento:', error);
      alert('Erro de conexão ao excluir agendamento');
    }
  };

  // Ações para Movimentações Financeiras
  const adicionarMovimentacao = (novaMovimentacao: Omit<MovimentacaoFinanceira, 'id'>) => {
    const movimentacao: MovimentacaoFinanceira = {
      ...novaMovimentacao,
      id: gerarId(),
    };
    setMovimentacoes(prev => [...prev, movimentacao]);
  };

  const atualizarMovimentacao = (id: string, dadosAtualizados: Partial<MovimentacaoFinanceira>) => {
    setMovimentacoes(prev => 
      prev.map(movimentacao => 
        movimentacao.id === id 
          ? { ...movimentacao, ...dadosAtualizados }
          : movimentacao
      )
    );
  };

  const excluirMovimentacao = async (id: string) => {
    try {
      console.log('🗑️ Tentando excluir movimentação:', id);
      // TODO: Implementar API call quando disponível
      console.log('✅ Movimentação excluída com sucesso! Removendo da lista...');
      setMovimentacoes(prev => prev.filter(movimentacao => movimentacao.id !== id));
    } catch (error) {
      console.error('❌ Erro ao excluir movimentação:', error);
      alert('Erro ao excluir movimentação');
    }
  };

  const value: AppContextType = {
    // Estados
    clientes,
    barbeiros,
    servicos,
    agendamentos,
    movimentacoes,
    
    // Ações
    adicionarCliente,
    atualizarCliente,
    excluirCliente,
    adicionarBarbeiro,
    atualizarBarbeiro,
    excluirBarbeiro,
    adicionarServico,
    atualizarServico,
    excluirServico,
    adicionarAgendamento,
    atualizarAgendamento,
    excluirAgendamento,
    adicionarMovimentacao,
    atualizarMovimentacao,
    excluirMovimentacao,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};