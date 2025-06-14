'use client';
export const dynamic = "force-dynamic";
import Link from 'next/link';
      <div className="space-y-2">
        <Link
          href="/configuracoes/usuarios"
          className="block bg-[var(--cor-acao)] text-white px-4 py-2 rounded-md hover:brightness-90"
        >
          Controle de Usuários
        </Link>
        <Link
          href="/configuracoes/categorias"
          className="block bg-[var(--cor-acao)] text-white px-4 py-2 rounded-md hover:brightness-90"
        >
          Categorias de Produtos
        </Link>
        <Link
          href="/configuracoes/categorias-receitas"
          className="block bg-[var(--cor-acao)] text-white px-4 py-2 rounded-md hover:brightness-90"
        >
          Categorias de Receitas
        </Link>
        <Link
          href="/configuracoes/unidades"
          className="block bg-[var(--cor-acao)] text-white px-4 py-2 rounded-md hover:brightness-90"
        >
          Unidades de Medida
        </Link>
      </div>
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
