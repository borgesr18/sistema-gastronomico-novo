'use client';
export const dynamic = "force-dynamic";

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Tabs from '@/components/ui/Tabs';
import UsuariosConfigPage from './usuarios/page';
import CategoriasConfigPage from './categorias/page';
import CategoriasReceitasConfigPage from './categorias-receitas/page';
import UnidadesConfigPage from './unidades/page';

function ConfiguracoesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [tab, setTab] = useState(searchParams.get('tab') || 'usuarios');

  const tabs = [
    { id: 'usuarios', label: 'Usuários' },
    { id: 'categorias', label: 'Categorias de Produtos' },
    { id: 'categorias-receitas', label: 'Categorias de Receitas' },
    { id: 'unidades', label: 'Unidades de Medida' },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
      <Tabs
        tabs={tabs}
        active={tab}
        onChange={(id) => {
          setTab(id);
          const params = new URLSearchParams(searchParams);
          params.set('tab', id);
          router.replace(`?${params.toString()}`);
        }}
      />
      {tab === 'usuarios' && <UsuariosConfigPage />}
      {tab === 'categorias' && <CategoriasConfigPage />}
      {tab === 'categorias-receitas' && <CategoriasReceitasConfigPage />}
      {tab === 'unidades' && <UnidadesConfigPage />}
    </div>
  );
}

export default function ConfiguracoesPage() {
  return (
    <Suspense>
      <ConfiguracoesContent />
    </Suspense>
  );
}
