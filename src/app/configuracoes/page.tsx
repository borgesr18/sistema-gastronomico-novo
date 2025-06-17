'use client';

import React, { useState } from 'react';
import { Tabs } from '@/components/ui/Tabs';
import CategoriasConfigPage from './_components/CategoriasConfigPage';
import UnidadesConfigPage from './_components/UnidadesConfigPage';
import UsuariosConfigPage from './_components/UsuariosConfigPage';
import CategoriasReceitasConfigPage from './_components/CategoriasReceitasConfigPage';

interface Tab {
  id: string;
  title: string;
  content: React.ReactNode;
}

export default function ConfiguracoesPage() {
  const [tab, setTab] = useState<string>('categorias');

  const tabs: Tab[] = [
    { id: 'categorias', title: 'Categorias', content: <CategoriasConfigPage /> },
    { id: 'unidades', title: 'Unidades', content: <UnidadesConfigPage /> },
    { id: 'usuarios', title: 'Usuários', content: <UsuariosConfigPage /> },
    { id: 'categorias-receitas', title: 'Categorias de Receita', content: <CategoriasReceitasConfigPage /> },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
      <Tabs tabs={tabs} activeTab={tab} onChange={setTab} />
      {tabs.find((t) => t.id === tab)?.content}
    </div>
  );
}
