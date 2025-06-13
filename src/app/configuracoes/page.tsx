'use client';
import Tabs from '@/components/ui/Tabs';
import UsuariosConfigPage from './usuarios/page';
import CategoriasConfigPage from './categorias/page';
import CategoriasReceitasConfigPage from './categorias-receitas/page';
import UnidadesConfigPage from './unidades/page';

export default function ConfiguracoesPage() {
  const tabs = [
    { id: 'usuarios', label: 'Usuários', content: <UsuariosConfigPage /> },
    {
      id: 'categorias',
      label: 'Categorias de Produtos',
      content: <CategoriasConfigPage />,
    },
    {
      id: 'categorias-receitas',
      label: 'Categorias de Receitas',
      content: <CategoriasReceitasConfigPage />,
    },
    { id: 'unidades', label: 'Unidades', content: <UnidadesConfigPage /> },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
      <Tabs tabs={tabs} />
    </div>
  );
}
