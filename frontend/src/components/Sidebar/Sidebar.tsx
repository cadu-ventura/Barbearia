import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Users, 
  Scissors, 
  DollarSign, 
  BarChart3, 
  Settings, 
  User,
  Clock,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/' },
    { id: 'agendamentos', label: 'Agendamentos', icon: Calendar, path: '/agendamentos' },
    { id: 'clientes', label: 'Clientes', icon: Users, path: '/clientes' },
    { id: 'servicos', label: 'Serviços', icon: Scissors, path: '/servicos' },
    { id: 'barbeiros', label: 'Barbeiros', icon: User, path: '/barbeiros' },
    { id: 'horarios', label: 'Horários', icon: Clock, path: '/horarios' },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign, path: '/financeiro' },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3, path: '/relatorios' },
    { id: 'configuracoes', label: 'Configurações', icon: Settings, path: '/configuracoes' },
  ];

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static top-0 left-0 h-screen w-64 bg-slate-900 text-white flex flex-col shadow-xl z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
      {/* Header da Sidebar */}
      <div className="p-6 text-center border-b border-slate-700">
        <div className="flex items-center justify-center mb-2">
          <Scissors className="w-8 h-8 text-amber-400 mr-2" />
          <h1 className="text-2xl font-bold text-amber-400">Hoshirara</h1>
        </div>
        <p className="text-sm text-slate-400">Barbearia Premium</p>
      </div>

      {/* Navegação */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group ${
                    isActive 
                      ? 'bg-amber-500 text-white shadow-lg' 
                      : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-amber-400'
                  }`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer da Sidebar */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800">
          <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Admin</p>
            <p className="text-xs text-slate-400">Gerente</p>
          </div>
        </div>
      </div>
      
      {/* Botão de fechar para mobile */}
      <button 
        onClick={onToggle}
        className="absolute top-4 right-4 lg:hidden text-white hover:text-amber-400 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>
    </aside>
    </>
  );
};

export default Sidebar;