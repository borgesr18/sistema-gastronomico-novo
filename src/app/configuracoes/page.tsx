'use client';
export const dynamic = "force-dynamic";

import { ReactNode, Suspense, useState } from 'react';
import Tabs from '@/components/ui/Tabs';
import UsuariosConfigPage from '@/app/configuracoes/usuarios/page';
import CategoriasConfigPage from '@/app/configuracoes/categorias/page';
import CategoriasReceitasConfigPage from '@/app/configuracoes/categorias-receitas/page';
import UnidadesConfigPage from '@/app/configuracoes/unidades/page';

type TabConfig = {
  id: string;
  label: string;
  content: ReactNode;
};

function ConfiguracoesContent() {
  const [activeTab, setActiveTab] = useState<string>('usuarios');

  const tabs: TabConfig[] = [
    { id: 'usuarios', label: 'Usuários', content: <UsuariosConfigPage /> },
    { id: 'categorias', label: 'Categorias de Produtos', content: <CategoriasConfigPage /> },
    { id: 'categorias-receitas', label: 'Categorias de Receitas', content: <CategoriasReceitasConfigPage /> },
    { id: 'unidades', label: 'Unidades de Medida', content: <UnidadesConfigPage /> },
  ];

  const activeContent = tabs.find((t) => t.id === activeTab)?.content;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
      <Tabs
        tabs={tabs.map(({ id, label }) => ({ id, label }))}
        active={activeTab}
        onChange={setActiveTab}
      />
      {activeContent}
    </div>
  );
}

export default function ConfiguracoesPage() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <ConfiguracoesContent />
    </Suspense>
  );
}
