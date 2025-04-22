import React from 'react';
import Card from '@/components/ui/Card';
import Table, { TableRow, TableCell } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import { useProdutos, ProdutoInfo } from '@/lib/produtosService';
import Link from 'next/link';

export default function ProdutosPage() {
  const { produtos, isLoading, removerProduto } = useProdutos();

  const handleRemover = (id: string) => {
    if (confirm('Tem certeza que deseja remover este produto?')) {
      removerProduto(id);
    }
  };

  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Produtos</h1>
        <Link href="/produtos/novo">
          <Button variant="primary">
            <span className="material-icons mr-1 text-sm">add</span>
            Novo Produto
          </Button>
        </Link>
      </div>

      <Card>
        <Table 
          headers={['Nome', 'Unidade', 'Preço', 'Fornecedor', 'Ações']}
          isLoading={isLoading}
          emptyMessage="Nenhum produto cadastrado. Clique em 'Novo Produto' para adicionar."
        >
          {produtos.map((produto: ProdutoInfo) => (
            <TableRow key={produto.id}>
              <TableCell className="font-medium text-gray-700">{produto.nome}</TableCell>
              <TableCell>{produto.unidadeMedida}</TableCell>
              <TableCell>{formatarPreco(produto.preco)}</TableCell>
              <TableCell>{produto.fornecedor}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Link href={`/produtos/${produto.id}`}>
                    <Button variant="outline" size="sm">
                      <span className="material-icons text-sm">visibility</span>
                    </Button>
                  </Link>
                  <Link href={`/produtos/${produto.id}/editar`}>
                    <Button variant="outline" size="sm">
                      <span className="material-icons text-sm">edit</span>
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRemover(produto.id)}
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
