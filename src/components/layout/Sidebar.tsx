'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Logo from '../ui/Logo';

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
        {!isCollapsed && <Logo className="text-xl" showTagline={false} />}
  };

  const menuItems = [
    { href: '/', icon: 'dashboard', label: 'Dashboard' },
    { href: '/fichas-tecnicas', icon: 'receipt', label: 'Fichas Técnicas' },
    { href: '/produtos', icon: 'inventory', label: 'Insumos' },
    { href: '/estoque', icon: 'store', label: 'Estoque de Insumos' },
    { href: '/producao', icon: 'factory', label: 'Produção' },
    { href: '/estoque-producao', icon: 'warehouse', label: 'Estoque de Produção' },
    { href: '/precos', icon: 'attach_money', label: 'Preços de Venda' },
    { href: '/relatorios', icon: 'bar_chart', label: 'Relatórios' },
    { href: '/configuracoes', icon: 'settings', label: 'Configurações' },
  ];

  return (
    <aside
      className={`text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} min-h-screen`}
      style={{ backgroundColor: 'var(--cor-primaria)' }}
    >
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && <Logo className="text-xl" showTagline />}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-full hover:bg-[var(--cor-secundaria)] focus:outline-none"
          aria-label="Alternar menu lateral"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="mt-6">
        <ul>
          {menuItems.map(({ href, icon, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex items-center p-4 hover:bg-[var(--cor-secundaria)] transition-colors"
              >
                <span className="material-icons mr-3">{icon}</span>
                {!isCollapsed && <span>{label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
