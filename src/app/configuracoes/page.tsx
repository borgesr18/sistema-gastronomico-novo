'use client';
import Link from 'next/link';

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
      <ul className="space-y-2">
        <li>
          <Link
            href="/configuracoes/usuarios"
            className="flex items-center justify-between p-4 bg-white rounded-md border shadow-sm hover:bg-gray-50"
          >
            <span className="text-gray-700 font-medium">Controle de Usuários</span>
            <span className="material-icons text-gray-400">chevron_right</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
