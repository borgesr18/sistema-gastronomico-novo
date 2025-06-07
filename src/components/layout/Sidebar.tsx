'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={`text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} min-h-screen`}
      style={{ backgroundColor: 'var(--cor-primaria)' }}
    >
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && (
          <h1 className="text-xl font-bold">Sistema de Fichas Técnicas</h1>
        )}
        <button 
          onClick={toggleSidebar}
          className="p-1 rounded-full hover:bg-[var(--cor-secundaria)]"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="mt-6">
        <ul>
          <li>
            <Link 
              href="/"
              className="flex items-center p-4 hover:bg-[var(--cor-secundaria)]"
            >
              <span className="material-icons mr-3">dashboard</span>
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/produtos"
              className="flex items-center p-4 hover:bg-[var(--cor-secundaria)]"
            >
              <span className="material-icons mr-3">inventory</span>
              {!isCollapsed && <span>Produtos</span>}
            </Link>
          </li>
        <li>
          <Link
            href="/estoque"
            className="flex items-center p-4 hover:bg-[var(--cor-secundaria)]"
          >
            <span className="material-icons mr-3">store</span>
            {!isCollapsed && <span>Estoque</span>}
          </Link>
        </li>
        <li>
          <Link
            href="/producao"
            className="flex items-center p-4 hover:bg-[var(--cor-secundaria)]"
          >
            <span className="material-icons mr-3">factory</span>
            {!isCollapsed && <span>Produção</span>}
          </Link>
        </li>
          <li>
            <Link 
              href="/fichas-tecnicas"
              className="flex items-center p-4 hover:bg-[var(--cor-secundaria)]"
            >
              <span className="material-icons mr-3">receipt</span>
              {!isCollapsed && <span>Fichas Técnicas</span>}
            </Link>
          </li>
          <li>
            <Link 
              href="/relatorios"
              className="flex items-center p-4 hover:bg-[var(--cor-secundaria)]"
            >
              <span className="material-icons mr-3">bar_chart</span>
              {!isCollapsed && <span>Relatórios</span>}
            </Link>
          </li>
          <li>
            <Link 
              href="/configuracoes"
              className="flex items-center p-4 hover:bg-gray-700"
            >
              <span className="material-icons mr-3">settings</span>
              {!isCollapsed && <span>Configurações</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
