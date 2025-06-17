'use client';

import React, { useState } from 'react';
import { Tabs, Tab } from '@/components/ui/Tabs';
import CategoriasConfigPage from './_components/CategoriasConfigPage';
import UnidadesConfigPage from './_components/UnidadesConfigPage';
import UsuariosConfigPage from './_components/UsuariosConfigPage';

export default function ConfiguracoesPage() {
  const [tab, setTab] = useState('categorias');

  const tabs: Tab[] = [
    { id: 'categorias', label: 'Categorias', content: <CategoriasConfigPage /> },
    { id: 'unidades', label: 'Unidades', content: <UnidadesConfigPage /> },
    { id: 'usuarios', label: 'Usuários', content: <UsuariosConfigPage /> },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
      <Tabs tabs={tabs} activeTabId={tab} onChange={setTab} />
      {tabs.find((t) => t.id === tab)?.content}
    </div>
  );
}
