'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Table, { TableRow, TableCell } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import { useProdutos, ProdutoInfo, obterLabelCategoria } from '@/lib/produtosService';
import Link from 'next/link';

export default function ProdutosPage() {
  const { produtos, isLoading, removerProduto } = useProdutos();

  const [menuOpen, setMenuOpen] = useState<string | null>(null);

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
          headers={['Nome', 'Categoria', 'Unidade', 'Preço', 'Fornecedor', '']}
          isLoading={isLoading}
          emptyMessage="Nenhum produto cadastrado. Clique em 'Novo Produto' para adicionar."
        >
          {produtos.map((produto: ProdutoInfo) => (
            <TableRow key={produto.id} className="relative">
              <TableCell className="font-medium text-gray-700">{produto.nome}</TableCell>
              <TableCell>{obterLabelCategoria(produto.categoria)}</TableCell>
              <TableCell>{produto.unidadeMedida}</TableCell>
              <TableCell>{formatarPreco(produto.preco)}</TableCell>
              <TableCell>{produto.fornecedor}</TableCell>
              <TableCell className="text-right">
                <button
                  className="p-1 rounded hover:bg-gray-100"
                  onClick={() => setMenuOpen(menuOpen === produto.id ? null : produto.id)}
                >
                  <span className="material-icons text-gray-600">more_vert</span>
                </button>
                {menuOpen === produto.id && (
                  <div className="absolute right-4 mt-2 w-32 bg-white border rounded shadow z-10">
                    <Link
                      href={`/produtos/${produto.id}`}
                      className="block px-3 py-2 hover:bg-gray-50"
                    >
                      Ver
                    </Link>
                    <Link
                      href={`/produtos/${produto.id}/editar`}
                      className="block px-3 py-2 hover:bg-gray-50 flex items-center"
                    >
                      <span className="material-icons mr-1 text-black text-sm">edit</span>
                      Editar
                    </Link>
                    <button
                      onClick={() => {
                        setMenuOpen(null);
                        handleRemover(produto.id);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center text-red-600"
                    >
                      <span className="material-icons mr-1 text-black text-sm">delete</span>
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
