'use client';

import React, { useEffect, useState } from 'react';
import { CategoriaReceita } from '@prisma/client';
import Modal, { useModal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Toast from '@/components/ui/Toast';
import { Table, TableRow, TableCell } from '@/components/ui/Table';
import CategoriaReceitaForm from './CategoriaReceitaForm';

export default function CategoriasReceitasConfigPage() {
  const [categorias, setCategorias] = useState<CategoriaReceita[]>([]);
  const [filtro, setFiltro] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [categoriaEditando, setCategoriaEditando] = useState<CategoriaReceita | null>(null);

  const { isOpen, openModal, closeModal } = useModal();

  const carregarCategorias = async () => {
    const res = await fetch('/api/categorias-receitas');
    const data = await res.json();
    setCategorias(data);
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  const handleSalvar = async (categoria: Partial<CategoriaReceita>) => {
    const method = categoria.id ? 'PUT' : 'POST';
    const url = categoria.id ? `/api/categorias-receitas/${categoria.id}` : '/api/categorias-receitas';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoria),
    });

    if (res.ok) {
      setToast('Categoria salva com sucesso!');
      closeModal();
      carregarCategorias();
    } else {
      setToast('Erro ao salvar categoria.');
    }
  };

  const handleRemover = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover esta categoria?')) return;

    const res = await fetch(`/api/categorias-receitas/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setToast('Categoria removida.');
      carregarCategorias();
    } else {
      setToast('Erro ao remover categoria.');
    }
  };

  const filtradas = categorias.filter((c) =>
    c.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-xl font-bold">Categorias de Receitas</h2>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <Button onClick={() => { setCategoriaEditando(null); openModal(); }}>Nova Categoria</Button>

      <Input
        label="Buscar"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        placeholder="Buscar..."
      />

      <Table headers={['Nome', 'Ações']}>
        {filtradas.map((c) => (
          <TableRow key={c.id}>
            <TableCell>{c.nome}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button variant="secondary" size="sm" variant="secondary" onClick={() => { setCategoriaEditando(c); openModal(); }}>
                  Editar
                </Button>
                <Button variant="secondary" size="sm" variant="danger" onClick={() => handleRemover(c.id)}>
                  Excluir
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </Table>

      {isOpen && (
        <Modal
          isOpen={isOpen}
          title={categoriaEditando ? 'Editar Categoria' : 'Nova Categoria'}
          onClose={closeModal}
        >
          <CategoriaReceitaForm
            categoria={categoriaEditando}
            onSave={handleSalvar}
            onCancel={closeModal}
          />
        </Modal>
      )}
    </div>
  );
}
