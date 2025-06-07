'use client';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
      <ul className="space-y-4">
        <li>
          <Link href="/configuracoes/usuarios">
            <Button
              variant="outline"
              className="w-full flex items-center justify-between"
            >
              <span className="text-gray-700 font-medium">Controle de Usuários</span>
              <span className="material-icons text-gray-400">chevron_right</span>
            </Button>
          </Link>
        </li>
      </ul>
    </div>
  );
}
