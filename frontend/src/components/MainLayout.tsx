import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import MobileNavBar from '../components/common/MobileNavBar';
import { Menu, Scissors, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Dashboard from '../pages/Dashboard';
import Agendamentos from '../pages/Agendamentos';
import Clientes from '../pages/Clientes';
import Servicos from '../pages/Servicos';
import Barbeiros from '../pages/Barbeiros';
import Financeiro from '../pages/Financeiro';
import Configuracoes from '../pages/Configuracoes';
import Horarios from '../pages/Horarios';
import Relatorios from '../pages/Relatorios';

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Header Mobile */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-slate-200 z-30">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={toggleSidebar}
            className="text-slate-600 hover:text-slate-800 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <Scissors className="w-6 h-6 text-amber-500" />
            <h1 className="text-lg font-bold text-slate-800">Hoshirara</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="text-slate-600 hover:text-red-600 transition-colors"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Header Desktop */}
      <div className="hidden lg:block fixed top-0 right-0 z-30 p-4">
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-600">
            <span>Bem-vindo, </span>
            <span className="font-medium text-slate-800">{user?.nome}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      <main className="flex-1 p-4 lg:p-8 pt-20 lg:pt-16 pb-20 lg:pb-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/agendamentos" element={<Agendamentos />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/barbeiros" element={<Barbeiros />} />
          <Route path="/horarios" element={<Horarios />} />
          <Route path="/financeiro" element={<Financeiro />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
        </Routes>
      </main>

      <MobileNavBar />
    </div>
  );
};

export default MainLayout;