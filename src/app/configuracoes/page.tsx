'use client';
import Link from 'next/link';

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
      <ul className="space-y-2">
        <li>
          <Link
            href="/configuracoes/usuarios"
            className="block rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 bg-[var(--cor-acao)] text-white hover:brightness-90 focus:ring-[var(--cor-acao)] px-4 py-2"
          >
            Controle de Usuários
          </Link>
        </li>
        <li>
          <Link
            href="/configuracoes/categorias"
            className="block rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 bg-[var(--cor-acao)] text-white hover:brightness-90 focus:ring-[var(--cor-acao)] px-4 py-2"
          >
            Categorias de Produtos
          </Link>
        </li>
        <li>
          <Link
            href="/configuracoes/categorias-receitas"
            className="block rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 bg-[var(--cor-acao)] text-white hover:brightness-90 focus:ring-[var(--cor-acao)] px-4 py-2"
          >
            Categorias de Receitas
          </Link>
        </li>
        <li>
          <Link
            href="/configuracoes/unidades"
            className="block rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 bg-[var(--cor-acao)] text-white hover:brightness-90 focus:ring-[var(--cor-acao)] px-4 py-2"
          >
            Unidades de Medida
          </Link>
        </li>
      </ul>
    </div>
  );
}
