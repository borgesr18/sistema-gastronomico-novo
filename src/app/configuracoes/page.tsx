'use client';
import Link from 'next/link';

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
      <ul className="list-disc pl-6 space-y-2 text-blue-600">
        <li>
          <Link href="/configuracoes/usuarios" className="hover:underline">
            Controle de Usuários
          </Link>
        </li>
      </ul>
    </div>
  );
}
