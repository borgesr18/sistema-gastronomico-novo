'use client';

import React, { useEffect, useState } from 'react';
import { Categoria } from '@prisma/client';
import Button from '@/components/ui/Button';
import Modal, { useModal } from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Toast from '@/components/ui/Toast';
import { Table, TableRow, TableCell } from '@/components/ui/Table';
import CategoriaForm from '../_components/CategoriaForm';

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [filtro, setFiltro] = useState('');
  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const { isOpen, openModal, closeModal } = useModal();

  const carregarCategorias = async () => {
    const res = await fetch('/api/categorias');
    const data = await res.json();
    setCategorias(data);
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  const handleSalvar = async (categoria: Partial<Categoria>) => {
    const metodo = categoria.id ? 'PUT' : 'POST';
    const url = categoria.id ? `/api/categorias/${categoria.id}` : '/api/categorias`;

    await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoria),
    });

    setToast('Categoria salva com sucesso!');
    closeModal();
    carregarCategorias();
  };

  const handleRemover = async (id: string) => {
    await fetch(`/api/categorias/${id}`, { method: 'DELETE' });
    setToast('Categoria removida com sucesso!');
    carregarCategorias();
  };

  const filtradas = categorias.filter((c) =>
    c.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Categorias de Produtos</h2>

      <Button onClick={openModal}>Nova Categoria</Button>

      <Input
        label="Buscar"
        placeholder="Buscar..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      <Table headers={['Nome', 'Ações']}>
        {filtradas.map((c) => (
          <TableRow key={c.id}>
            <TableCell>{c.nome}</TableCell>
            <TableCell className="flex space-x-2">
              <Button size="sm" onClick={() => { setCategoriaEditando(c); openModal(); }}>
                Editar
              </Button>
              <Button size="sm" variant="danger" onClick={() => handleRemover(c.id)}>
                Remover
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </Table>

      {isOpen && (
        <Modal title={categoriaEditando ? 'Editar Categoria' : 'Nova Categoria'} onClose={closeModal}>
          <CategoriaForm
            categoria={categoriaEditando}
            onSave={handleSalvar}
            onCancel={() => {
              setCategoriaEditando(null);
              closeModal();
            }}
          />
        </Modal>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
