'use client';

import React, { useEffect, useState } from 'react';
import { Categoria } from '@prisma/client';
import Button from '@/components/ui/Button';
import Modal, { useModal } from '@/components/ui/Modal';
import { Table, TableRow, TableCell } from '@/components/ui/Table';
import Toast from '@/components/ui/Toast';
import Input from '@/components/ui/Input';
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
    const url = categoria.id ? `/api/categorias/${categoria.id}` : '/api/categorias';

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
    if (!confirm('Tem certeza que deseja remover?')) return;

    await fetch(`/api/categorias/${id}`, { method: 'DELETE' });

    setToast('Categoria removida com sucesso!');
    carregarCategorias();
  };

  const categoriasFiltradas = categorias.filter(c =>
    c.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Categorias de Produtos</h1>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div className="flex items-center space-x-2 mb-4">
        <Button onClick={() => { setCategoriaEditando(null); openModal(); }}>
          Nova Categoria
        </Button>
        <Input
          label="Buscar"
          placeholder="Digite para filtrar..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      <Table headers={['Nome', 'Ações']}>
        {categoriasFiltradas.map(c => (
          <TableRow key={c.id}>
            <TableCell>{c.nome}</TableCell>
            <TableCell>
              <Button variant="secondary" onClick={() => { setCategoriaEditando(c); openModal(); }}>
                Editar
              </Button>
              <Button variant="danger" onClick={() => handleRemover(c.id)} >
                Remover
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </Table>

      {isOpen && (
        <Modal title={categoriaEditando ? 'Editar Categoria' : 'Nova Categoria'} isOpen={isOpen} onClose={closeModal}>
          <CategoriaForm
            categoria={categoriaEditando}
            onSave={handleSalvar}
            onCancel={closeModal}
          />
        </Modal>
      )}
    </div>
  );
}

