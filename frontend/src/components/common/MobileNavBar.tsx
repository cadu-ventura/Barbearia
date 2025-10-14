import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Users, DollarSign, BarChart3 } from 'lucide-react';

const MobileNavBar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { id: 'dashboard', icon: Home, path: '/', label: 'Início' },
    { id: 'agendamentos', icon: Calendar, path: '/agendamentos', label: 'Agenda' },
    { id: 'clientes', icon: Users, path: '/clientes', label: 'Clientes' },
    { id: 'financeiro', icon: DollarSign, path: '/financeiro', label: 'Financeiro' },
    { id: 'relatorios', icon: BarChart3, path: '/relatorios', label: 'Relatórios' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-30">
      <div className="flex">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex-1 flex flex-col items-center py-2 px-1 transition-colors ${
                isActive 
                  ? 'text-amber-600 bg-amber-50' 
                  : 'text-slate-600 hover:text-amber-600'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavBar;