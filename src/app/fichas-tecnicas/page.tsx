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

  const [selected, setSelected] = useState<FichaTecnicaInfo | null>(null);
  const [actionsOpen, setActionsOpen] = useState(false);

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
        <div className="flex items-center space-x-2">
          <Link href="/fichas-tecnicas/nova">
            <Button variant="primary">
              <span className="material-icons mr-1 text-sm">add</span>
              Nova Ficha Técnica
            </Button>
          </Link>
          {selected && (
            <div className="relative">
              <button
                className="p-1 rounded hover:bg-gray-100"
                onClick={() => setActionsOpen(!actionsOpen)}
              >
                <span className="material-icons">more_vert</span>
              </button>
              {actionsOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10">
                  <Link href={`/fichas-tecnicas/${selected.id}`} className="block px-3 py-2 hover:bg-gray-50">
                    Ver
                  </Link>
                  <Link href={`/fichas-tecnicas/${selected.id}/editar`} className="block px-3 py-2 hover:bg-gray-50">
                    Editar
                  </Link>
                  <button
                    onClick={() => { setActionsOpen(false); handleRemover(selected.id); }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 text-red-600"
                  >
                    Excluir
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {selected && (
        <p className="text-sm" style={{ color: 'var(--cor-texto-secundario)' }}>
          Ficha Selecionada: {selected.nome}
        </p>
      )}

      <Card>
        <Table
          headers={['Nome', 'Categoria', 'Rendimento', 'Custo Total', 'Data de Modificação']}
          isLoading={isLoading}
          emptyMessage="Nenhuma ficha técnica cadastrada. Clique em 'Nova Ficha Técnica' para adicionar."
        >
          {fichasTecnicas.map((ficha: FichaTecnicaInfo) => (
            <TableRow
              key={ficha.id}
              className={`relative cursor-pointer ${selected?.id === ficha.id ? 'bg-[var(--cor-secundaria)/20]' : ''}`}
              onClick={() => { setSelected(ficha); setActionsOpen(false); }}
            >
              <TableCell className="font-medium text-gray-700">{ficha.nome}</TableCell>
              <TableCell>{obterLabelCategoriaReceita(ficha.categoria)}</TableCell>
              <TableCell>{ficha.rendimentoTotal} {ficha.unidadeRendimento}</TableCell>
              <TableCell>{formatarPreco(ficha.custoTotal)}</TableCell>
              <TableCell>{formatarData(ficha.dataModificacao)}</TableCell>

            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
}
