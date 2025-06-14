'use client';
export const dynamic = "force-dynamic";
import Link from 'next/link';

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
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
    </div>
  );
}
