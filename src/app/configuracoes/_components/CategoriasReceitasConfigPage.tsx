'use client';

import React, { useState, useEffect } from 'react';
import { CategoriaReceita } from '@prisma/client';
import Modal, { useModal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Table, { TableRow, TableCell } from '@/components/ui/Table';
import Toast from '@/components/ui/Toast';
import Input from '@/components/ui/Input';
import CategoriaReceitaForm from './CategoriaReceitaForm';

export default function CategoriasReceitasConfigPage() {
  const [categorias, setCategorias] = useState<CategoriaReceita[]>([]);
  const [categoriaEditando, setCategoriaEditando] = useState<CategoriaReceita | null>(null);
  const [filtro, setFiltro] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const res = await fetch('/api/categorias-receitas');
      const data = await res.json();
      setCategorias(data);
    } catch (err) {
      setToast('Erro ao carregar categorias');
    }
  };

  const handleSalvar = async (categoria: Partial<CategoriaReceita>) => {
    try {
      const method = categoria.id ? 'PUT' : 'POST';
      const url = categoria.id ? `/api/categorias-receitas/${categoria.id}` : '/api/categorias-receitas';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: categoria.nome }),
      });

      if (!res.ok) {
        throw new Error('Erro ao salvar categoria');
      }

      closeModal();
      fetchCategorias();
      setToast('Categoria salva com sucesso!');
    } catch (err) {
      setToast('Erro ao salvar categoria');
    }
  };

  const handleRemover = async (id: string) => {
    try {
      const res = await fetch(`/api/categorias-receitas/${id}`, { method: 'DELETE' });

      if (!res.ok) {
        throw new Error('Erro ao remover categoria');
      }

      fetchCategorias();
      setToast('Categoria removida com sucesso!');
    } catch (err) {
      setToast('Erro ao remover categoria');
    }
  };

  const filtradas = categorias.filter((c) => c.nome.toLowerCase().includes(filtro.toLowerCase()));

  return (
    <div>
      <h2 className="text-xl font-bold">Categorias de Receitas</h2>

      <Button onClick={() => { setCategoriaEditando(null); openModal(); }}>
        Nova Categoria
      </Button>

      <Input
        label="Filtro"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        placeholder="Buscar..."
      />

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <Table headers={['Nome', 'Ações']}>
        {filtradas.map((c) => (
          <TableRow key={c.id}>
            <TableCell>{c.nome}</TableCell>
            <TableCell className="flex items-center space-x-2">
              <Button size="sm" variant="secondary" onClick={() => { setCategoriaEditando(c); openModal(); }}>
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
