'use client';

import React, { useEffect, useState, ChangeEvent } from 'react';
import { Categoria } from '@prisma/client';
import { useModal } from '@/components/ui/Modal';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Table, TableRow, TableCell } from '@/components/ui/Table';
import Toast from '@/components/ui/Toast';
import CategoriaForm from './CategoriaForm';

export default function CategoriasConfigPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [filtro, setFiltro] = useState('');
  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    listarCategorias();
  }, []);

  const listarCategorias = async () => {
    const res = await fetch('/api/categorias');
    const data = await res.json();
    setCategorias(data);
  };

  const handleSalvar = async (categoria: Partial<Categoria>) => {
    const method = categoria.id ? 'PUT' : 'POST';
    const url = categoria.id ? `/api/categorias/${categoria.id}` : '/api/categorias';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoria),
    });

    if (res.ok) {
      setToast('Categoria salva com sucesso!');
      closeModal();
      listarCategorias();
    } else {
      setToast('Erro ao salvar categoria');
    }
  };

  const handleRemover = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta categoria?')) return;

    const res = await fetch(`/api/categorias/${id}`, { method: 'DELETE' });

    if (res.ok) {
      setToast('Categoria removida');
      listarCategorias();
    } else {
      setToast('Erro ao remover categoria');
    }
  };

  const filtradas = categorias.filter((c) =>
    c.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Categorias de Produtos</h2>

      <Input
        label="Buscar"
        value={filtro}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setFiltro(e.target.value)}
        placeholder="Digite para filtrar..."
      />

      <Button onClick={() => { setCategoriaEditando(null); openModal(); }}>
        Nova Categoria
      </Button>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <Table headers={['Nome', 'Ações']}>
        {filtradas.map((c) => (
          <tr key={c.id}>
            <td>{c.nome}</td>
            <td>
              <Button variant="secondary" size="sm" onClick={() => { setCategoriaEditando(c); openModal(); }}>
                Editar
              </Button>
              <Button variant="secondary" size="sm" variant="danger" onClick={() => handleRemover(c.id)}>
                Excluir
              </Button>
            </td>
          </tr>
        ))}
      </Table>

      {isOpen && (
        <Modal isOpen={isOpen} title="Categoria" onClose={closeModal}>
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
