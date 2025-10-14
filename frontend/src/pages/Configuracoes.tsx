import React, { useState } from 'react';
import { Settings, Building, Clock, DollarSign, Users, Bell, Shield, Database } from 'lucide-react';

const Configuracoes: React.FC = () => {
  const [activeTab, setActiveTab] = useState('empresa');
  const [configuracoes, setConfiguracoes] = useState({
    empresa: {
      nome: 'Barbearia Hoshirara',
      telefone: '(11) 99999-9999',
      email: 'contato@barbeariahoshirara.com',
      cnpj: '12.345.678/0001-90',
      endereco: {
        cep: '01234-567',
        logradouro: 'Rua das Flores, 123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP'
      }
    },
    funcionamento: {
      horarioAbertura: '08:00',
      horarioFechamento: '18:00',
      diasFuncionamento: [1, 2, 3, 4, 5, 6], // Segunda a Sábado
      intervaloPadrao: 15, // minutos entre agendamentos
      antecedenciaMinima: 2, // horas
      antecedenciaMaxima: 30, // dias
      permiteFimSemana: false
    },
    financeiro: {
      comissaoPadrao: 50, // %
      taxaCartao: 3.5, // %
      metaPadrao: 5000, // R$
      moeda: 'BRL'
    },
    sistema: {
      tema: 'claro',
      idioma: 'pt-BR',
      timezone: 'America/Sao_Paulo',
      formatoData: 'DD/MM/YYYY',
      formatoHora: '24h'
    },
    notificacoes: {
      emailClientes: true,
      smsClientes: false,
      whatsappClientes: true,
      lembretesAgendamento: true,
      relatoriosAutomaticos: true
    },
    seguranca: {
      autenticacaoTwoFactor: false,
      sessaoExpira: 8, // horas
      backupAutomatico: true,
      logAuditoria: true
    }
  });

  const tabs = [
    { id: 'empresa', label: 'Empresa', icon: Building },
    { id: 'funcionamento', label: 'Funcionamento', icon: Clock },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
    { id: 'usuarios', label: 'Usuários', icon: Users },
    { id: 'notificacoes', label: 'Notificações', icon: Bell },
    { id: 'sistema', label: 'Sistema', icon: Settings },
    { id: 'seguranca', label: 'Segurança', icon: Shield },
    { id: 'backup', label: 'Backup', icon: Database }
  ];

  const diasSemana = [
    { id: 0, nome: 'Domingo', abrev: 'Dom' },
    { id: 1, nome: 'Segunda', abrev: 'Seg' },
    { id: 2, nome: 'Terça', abrev: 'Ter' },
    { id: 3, nome: 'Quarta', abrev: 'Qua' },
    { id: 4, nome: 'Quinta', abrev: 'Qui' },
    { id: 5, nome: 'Sexta', abrev: 'Sex' },
    { id: 6, nome: 'Sábado', abrev: 'Sáb' }
  ];

  const handleSave = () => {
    // Implementar salvamento das configurações
    alert('Configurações salvas com sucesso!');
  };

  const renderEmpresaTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-slate-800 mb-4">Informações da Empresa</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Empresa</label>
            <input
              type="text"
              value={configuracoes.empresa.nome}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              onChange={(e) => setConfiguracoes(prev => ({
                ...prev,
                empresa: { ...prev.empresa, nome: e.target.value }
              }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">CNPJ</label>
            <input
              type="text"
              value={configuracoes.empresa.cnpj}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
            <input
              type="tel"
              value={configuracoes.empresa.telefone}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={configuracoes.empresa.email}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-slate-800 mb-4">Endereço</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">CEP</label>
            <input
              type="text"
              value={configuracoes.empresa.endereco.cep}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Logradouro</label>
            <input
              type="text"
              value={configuracoes.empresa.endereco.logradouro}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Bairro</label>
            <input
              type="text"
              value={configuracoes.empresa.endereco.bairro}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Cidade</label>
            <input
              type="text"
              value={configuracoes.empresa.endereco.cidade}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500">
              <option value="SP">São Paulo</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="MG">Minas Gerais</option>
              {/* Outros estados */}
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFuncionamentoTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-slate-800 mb-4">Horário de Funcionamento</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Abertura</label>
            <input
              type="time"
              value={configuracoes.funcionamento.horarioAbertura}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Fechamento</label>
            <input
              type="time"
              value={configuracoes.funcionamento.horarioFechamento}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-slate-800 mb-4">Dias de Funcionamento</h3>
        <div className="grid grid-cols-7 gap-2">
          {diasSemana.map((dia) => (
            <label key={dia.id} className="flex flex-col items-center">
              <input
                type="checkbox"
                checked={configuracoes.funcionamento.diasFuncionamento.includes(dia.id)}
                className="mb-1"
                onChange={(e) => {
                  const dias = e.target.checked 
                    ? [...configuracoes.funcionamento.diasFuncionamento, dia.id]
                    : configuracoes.funcionamento.diasFuncionamento.filter(d => d !== dia.id);
                  setConfiguracoes(prev => ({
                    ...prev,
                    funcionamento: { ...prev.funcionamento, diasFuncionamento: dias }
                  }));
                }}
              />
              <span className="text-xs text-center">{dia.abrev}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-slate-800 mb-4">Configurações de Agendamento</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Intervalo entre Agendamentos (min)</label>
            <input
              type="number"
              value={configuracoes.funcionamento.intervaloPadrao}
              min="5"
              max="60"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Antecedência Mínima (horas)</label>
            <input
              type="number"
              value={configuracoes.funcionamento.antecedenciaMinima}
              min="1"
              max="24"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Antecedência Máxima (dias)</label>
            <input
              type="number"
              value={configuracoes.funcionamento.antecedenciaMaxima}
              min="7"
              max="90"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderFinanceiroTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-slate-800 mb-4">Configurações Financeiras</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Comissão Padrão (%)</label>
            <input
              type="number"
              value={configuracoes.financeiro.comissaoPadrao}
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Taxa Cartão (%)</label>
            <input
              type="number"
              value={configuracoes.financeiro.taxaCartao}
              step="0.1"
              min="0"
              max="10"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Meta Mensal (R$)</label>
            <input
              type="number"
              value={configuracoes.financeiro.metaPadrao}
              min="0"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Moeda</label>
            <select 
              value={configuracoes.financeiro.moeda}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="BRL">Real (R$)</option>
              <option value="USD">Dólar ($)</option>
              <option value="EUR">Euro (€)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSistemaTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-slate-800 mb-4">Preferências do Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tema</label>
            <select 
              value={configuracoes.sistema.tema}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="claro">Claro</option>
              <option value="escuro">Escuro</option>
              <option value="auto">Automático</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Idioma</label>
            <select 
              value={configuracoes.sistema.idioma}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">English (US)</option>
              <option value="es-ES">Español</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Formato de Data</label>
            <select 
              value={configuracoes.sistema.formatoData}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Formato de Hora</label>
            <select 
              value={configuracoes.sistema.formatoHora}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="24h">24 horas</option>
              <option value="12h">12 horas (AM/PM)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificacoesTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-slate-800 mb-4">Notificações para Clientes</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={configuracoes.notificacoes.emailClientes}
              className="mr-3"
              onChange={(e) => setConfiguracoes(prev => ({
                ...prev,
                notificacoes: { ...prev.notificacoes, emailClientes: e.target.checked }
              }))}
            />
            <span className="text-slate-700">Enviar confirmações por email</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={configuracoes.notificacoes.smsClientes}
              className="mr-3"
            />
            <span className="text-slate-700">Enviar SMS de lembrete</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={configuracoes.notificacoes.whatsappClientes}
              className="mr-3"
            />
            <span className="text-slate-700">Integração com WhatsApp</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={configuracoes.notificacoes.lembretesAgendamento}
              className="mr-3"
            />
            <span className="text-slate-700">Lembretes automáticos de agendamento</span>
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-slate-800 mb-4">Relatórios</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={configuracoes.notificacoes.relatoriosAutomaticos}
              className="mr-3"
            />
            <span className="text-slate-700">Relatórios automáticos semanais</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSegurancaTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-slate-800 mb-4">Configurações de Segurança</h3>
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={configuracoes.seguranca.autenticacaoTwoFactor}
              className="mr-3"
            />
            <span className="text-slate-700">Autenticação de dois fatores (2FA)</span>
          </label>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Expiração da Sessão (horas)</label>
            <input
              type="number"
              value={configuracoes.seguranca.sessaoExpira}
              min="1"
              max="24"
              className="w-32 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={configuracoes.seguranca.backupAutomatico}
              className="mr-3"
            />
            <span className="text-slate-700">Backup automático diário</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={configuracoes.seguranca.logAuditoria}
              className="mr-3"
            />
            <span className="text-slate-700">Log de auditoria de ações</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderBackupTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-slate-800 mb-4">Backup e Restauração</h3>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800 mb-3">Último backup: 13/10/2025 às 03:00</p>
            <div className="flex gap-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                Fazer Backup Agora
              </button>
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm">
                Baixar Backup
              </button>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-medium text-orange-800 mb-2">Restaurar Dados</h4>
            <p className="text-sm text-orange-700 mb-3">
              Cuidado: Esta ação irá substituir todos os dados atuais.
            </p>
            <input
              type="file"
              accept=".json,.sql"
              className="mb-3 text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200"
            />
            <br />
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm">
              Restaurar Dados
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'empresa': return renderEmpresaTab();
      case 'funcionamento': return renderFuncionamentoTab();
      case 'financeiro': return renderFinanceiroTab();
      case 'sistema': return renderSistemaTab();
      case 'notificacoes': return renderNotificacoesTab();
      case 'seguranca': return renderSegurancaTab();
      case 'backup': return renderBackupTab();
      default: return renderEmpresaTab();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-4 lg:p-6">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-1 lg:mb-2">Configurações</h1>
          <p className="text-slate-600 text-sm lg:text-base">Gerencie as configurações gerais do sistema</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          {/* Tabs */}
          <div className="border-b border-slate-200">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-amber-500 text-amber-600 bg-amber-50'
                        : 'border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Conteúdo */}
          <div className="p-6">
            {renderActiveTab()}

            {/* Botões de Ação */}
            <div className="flex justify-end gap-3 pt-8 border-t border-slate-200 mt-8">
              <button className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
              >
                Salvar Configurações
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;