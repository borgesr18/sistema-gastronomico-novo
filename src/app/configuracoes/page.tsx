'use client';
export const dynamic = "force-dynamic";

import { ReactNode, useState } from 'react';
import Tabs from '@/components/ui/Tabs';
import { useAuth } from '@/lib/useAuth'

import UsuariosConfigPage from './_components/UsuariosConfigPage';
import CategoriasConfigPage from './_components/CategoriasConfigPage';
import CategoriasReceitasConfigPage from './_components/CategoriasReceitasConfigPage';
import UnidadesConfigPage from './_components/UnidadesConfigPage';

type TabConfig = {
  id: string;
  label: string;
  content: ReactNode;
};

export default function ConfiguracoesPage() {
  const [tab, setTab] = useState('usuarios');

  const tabs: TabConfig[] = [
    { id: 'usuarios', label: 'Usuários', content: <UsuariosConfigPage /> },
    { id: 'categorias', label: 'Categorias de Produtos', content: <CategoriasConfigPage /> },
    { id: 'categorias-receitas', label: 'Categorias de Receitas', content: <CategoriasReceitasConfigPage /> },
    { id: 'unidades', label: 'Unidades de Medida', content: <UnidadesConfigPage /> },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
      <Tabs tabs={tabs} active={tab} onChange={setTab} />
      {tabs.find(t => t.id === tab)?.content}
    </div>
  );
}

)