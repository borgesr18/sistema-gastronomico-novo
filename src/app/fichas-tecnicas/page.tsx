'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import { Table,  TableRow, TableCell } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import SlideOver from '@/components/ui/SlideOver';
import {
  useFichasTecnicas,
  FichaTecnicaInfo,
  obterLabelCategoriaReceita
} from '@/lib/fichasTecnicasService';
import Link from 'next/link';

export default function FichasTecnicasPage() {
  const { fichasTecnicas, isLoading, removerFichaTecnica } = useFichasTecnicas();

  const [selecionada, setSelecionada] = useState<FichaTecnicaInfo | null>(null);

  const handleRemover = (id: string) => {
    if (confirm('Tem certeza que deseja remover esta ficha técnica?')) {
      removerFichaTecnica(id);
      setSelecionada(null);
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
            'Data de Modificação'
          ]}
          
          emptyMessage="Nenhuma ficha técnica cadastrada. Clique em 'Nova Ficha Técnica' para adicionar."
        >
          {fichasTecnicas.map((ficha: FichaTecnicaInfo) => (
            <TableRow
              key={ficha.id}
              className="relative cursor-pointer"
              onClick={() => setSelecionada(ficha)}
            >
              <TableCell>{ficha.nome}</TableCell>
              <TableCell>{obterLabelCategoriaReceita(ficha.categoria)}</TableCell>
              <TableCell>{ficha.rendimentoTotal} {ficha.unidadeRendimento}</TableCell>
              <TableCell>{formatarPreco(ficha.custoTotal)}</TableCell>
              <TableCell>{formatarData(ficha.dataModificacao)}</TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
      <SlideOver
        isOpen={!!selecionada}
        onClose={() => setSelecionada(null)}
        title={selecionada?.nome}
      >
        {selecionada && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Rendimento: {selecionada.rendimentoTotal} {selecionada.unidadeRendimento}
            </p>
            <p className="text-sm text-gray-600">Custo Total: {formatarPreco(selecionada.custoTotal)}</p>
            <p className="text-sm text-gray-600">Data: {formatarData(selecionada.dataModificacao)}</p>
            <div className="flex flex-col space-y-2">
              <Link href={`/fichas-tecnicas/${selecionada.id}}> <Button variant="secondary">Ver</Button> </Link>
              <Link href={`/fichas-tecnicas/${selecionada.id}/editar}> <Button variant="primary">Editar</Button> </Link>
              <Button variant="danger" onClick={() => handleRemover(selecionada.id)}>Excluir</Button>
              <Link href={`/producao?ficha=${selecionada.id}}><Button>Produzir</Button></Link>
              <Link href={`/precos?ficha=${selecionada.id}}><Button>Calcular Preço</Button></Link>
            </div>
          </div>
        )}
      </SlideOver>
    </div>
  );
}
