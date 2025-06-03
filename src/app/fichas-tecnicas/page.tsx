'use client';

// Esta página depende de dados do localStorage e não deve ser pré-renderizada
export const dynamic = 'force-dynamic';

import React from 'react';
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
          headers={['Nome', 'Categoria', 'Rendimento', 'Custo Total', 'Custo por Porção', 'Última Atualização', 'Ações']}
          isLoading={isLoading}
          emptyMessage="Nenhuma ficha técnica cadastrada. Clique em 'Nova Ficha Técnica' para adicionar."
        >
          {fichasTecnicas.map((ficha: FichaTecnicaInfo) => (
            <TableRow key={ficha.id}>
              <TableCell className="font-medium text-gray-700">{ficha.nome}</TableCell>
              <TableCell>{obterLabelCategoriaReceita(ficha.categoria)}</TableCell>
              <TableCell>{ficha.rendimentoTotal} {ficha.unidadeRendimento}</TableCell>
              <TableCell>{formatarPreco(ficha.custoTotal)}</TableCell>
              <TableCell>{formatarPreco(ficha.custoPorcao)}</TableCell>
              <TableCell>{formatarData(ficha.ultimaAtualizacao)}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Link href={`/fichas-tecnicas/${ficha.id}`}>
                    <Button variant="outline" size="sm">
                      <span className="material-icons text-sm">visibility</span>
                    </Button>
                  </Link>
                  <Link href={`/fichas-tecnicas/${ficha.id}/editar`}>
                    <Button variant="outline" size="sm">
                      <span className="material-icons text-sm">edit</span>
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRemover(ficha.id)}
                  >
                    <span className="material-icons text-sm text-red-500">delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
}
