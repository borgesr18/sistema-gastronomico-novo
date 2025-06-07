'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Table, { TableRow, TableCell } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import {
  useFichasTecnicas,
  FichaTecnicaInfo,
  obterLabelCategoriaReceita
} from '@/lib/fichasTecnicasService';
import Link from 'next/link';

export default function FichasTecnicasPage() {
  const { fichasTecnicas, isLoading, removerFichaTecnica } = useFichasTecnicas();

  const [menuRow, setMenuRow] = useState<string | null>(null);

  const handleRemover = (id: string) => {
    if (confirm('Tem certeza que deseja remover esta ficha técnica?')) {
      removerFichaTecnica(id);
    }
  };

  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco);
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Fichas Técnicas</h1>
        <Link href="/fichas-tecnicas/nova">
          <Button variant="primary">
            <span className="material-icons mr-1 text-sm">add</span>
            Nova Ficha Técnica
          </Button>
        </Link>
      </div>

      <Card>
        <Table
          headers={[
            'Nome',
            'Categoria',
            'Rendimento',
            'Custo Total',
            'Data de Modificação',
            ''
          ]}
          isLoading={isLoading}
          emptyMessage="Nenhuma ficha técnica cadastrada. Clique em 'Nova Ficha Técnica' para adicionar."
        >
          {fichasTecnicas.map((ficha: FichaTecnicaInfo) => (
            <TableRow key={ficha.id} className="relative">
              <TableCell className="font-medium text-gray-700">{ficha.nome}</TableCell>
              <TableCell>{obterLabelCategoriaReceita(ficha.categoria)}</TableCell>
              <TableCell>{ficha.rendimentoTotal} {ficha.unidadeRendimento}</TableCell>
              <TableCell>{formatarPreco(ficha.custoTotal)}</TableCell>
              <TableCell>{formatarData(ficha.dataModificacao)}</TableCell>
              <TableCell className="w-10 text-right">
                <button
                  className="p-1 rounded hover:bg-gray-100"
                  onClick={() => setMenuRow(menuRow === ficha.id ? null : ficha.id)}
                >
                  <span className="material-icons text-gray-600">more_vert</span>
                </button>
                {menuRow === ficha.id && (
                  <div className="absolute right-2 mt-2 w-32 bg-white border rounded shadow z-10">
                    <Link
                      href={`/fichas-tecnicas/${ficha.id}`}
                      className="block px-3 py-2 hover:bg-gray-50"
                      onClick={() => setMenuRow(null)}
                    >
                      Ver
                    </Link>
                    <Link
                      href={`/fichas-tecnicas/${ficha.id}/editar`}
                      className="block px-3 py-2 hover:bg-gray-50"
                      onClick={() => setMenuRow(null)}
                    >
                      Editar
                    </Link>
                    <button
                      className="block w-full text-left px-3 py-2 hover:bg-gray-50 text-red-600"
                      onClick={() => {
                        setMenuRow(null);
                        handleRemover(ficha.id);
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
}
