'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Dashboard' },
    { href: '/fichas-tecnicas', label: 'Fichas Técnicas' },
    { href: '/produtos', label: 'Insumos' },
    { href: '/producao', label: 'Produção' },
    { href: '/estoque', label: 'Estoque' },
    { href: '/relatorios', label: 'Relatórios' },
    { href: '/configuracoes', label: 'Configurações' },
  ];

  return (
    <aside className="w-64 h-full bg-white border-r p-4 space-y-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`block px-3 py-2 rounded ${
            pathname === link.href ? 'bg-gray-200 font-medium' : 'hover:bg-gray-50'
          }`}
        >
          {link.label}
        </Link>
      ))}
    </aside>
  );
};

export default Sidebar;
