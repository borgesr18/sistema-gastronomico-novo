'use client';
import Link from 'next/link';

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
      <div className="space-y-2">
        <Link
          href="/configuracoes/usuarios"
          className="inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 bg-[var(--cor-acao)] text-white hover:brightness-90 focus:ring-[var(--cor-acao)] px-4 py-2"
        >
          Controle de Usuários
        </Link>
        <Link
          href="/configuracoes/categorias"
          className="inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 bg-[var(--cor-acao)] text-white hover:brightness-90 focus:ring-[var(--cor-acao)] px-4 py-2"
        >
          Categorias de Produtos
        </Link>
        <Link
          href="/configuracoes/categorias-receitas"
          className="inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 bg-[var(--cor-acao)] text-white hover:brightness-90 focus:ring-[var(--cor-acao)] px-4 py-2"
        >
          Categorias de Receitas
        </Link>
        <Link
          href="/configuracoes/unidades"
          className="inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 bg-[var(--cor-acao)] text-white hover:brightness-90 focus:ring-[var(--cor-acao)] px-4 py-2"
        >
          Unidades de Medida
        </Link>
      </div>
    </div>
  );
}
