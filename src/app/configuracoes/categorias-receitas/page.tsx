'use client';

import React, { useEffect, useState } from 'react';
import { CategoriaReceita } from '@prisma/client';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Table, TableRow, TableCell } from '@/components/ui/Table';

export default function CategoriasReceitasPage() {
  const [categorias, setCategorias] = useState<CategoriaReceita[]>([]);
  const [nome, setNome] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [filtro, setFiltro] = useState('');

  const listarCategorias = async () => {
    const res = await fetch('/api/categorias-receitas');
    const data = await res.json();
    setCategorias(data);
  };

  useEffect(() => {
    listarCategorias();
  }, []);

  const abrirModalNova = () => {
    setNome('');
    setEditandoId(null);
    setModalAberto(true);
  };

  const iniciarEdicao = (id: string, nomeAtual: string) => {
    setNome(nomeAtual);
    setEditandoId(id);
    setModalAberto(true);
  };

  const handleSalvar = async () => {
    const url = editandoId ? `/api/categorias-receitas/${editandoId}` : '/api/categorias-receitas';
    const method = editandoId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome }),
    });

    setModalAberto(false);
    listarCategorias();
  };

  const handleRemover = async (id: string) => {
    await fetch(`/api/categorias-receitas/${id}`, {
      method: 'DELETE',
    });
    listarCategorias();
  };

  const categoriasFiltradas = categorias.filter((c) =>
    c.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Categorias de Receitas</h2>

      <div className="flex items-center space-x-2 mb-4">
        <Button onClick={abrirModalNova}>Nova Categoria</Button>
        <Input
          label="Buscar"
          placeholder="Buscar..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      <Table headers={['Nome', 'Ações']}>
        {categoriasFiltradas.map((cat) => (
          <TableRow key={cat.id}>
            <TableCell>{cat.nome}</TableCell>
            <TableCell>
              <Button variant="secondary" onClick={() => iniciarEdicao(cat.id, cat.nome)}>
                ✏️ Editar
              </Button>
              <Button variant="danger" onClick={() => handleRemover(cat.id)}>
                🗑️ Excluir
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </Table>

      {modalAberto && (
        <Modal title={editandoId ? 'Editar Categoria' : 'Nova Categoria'} isOpen={modalAberto} onClose={() => setModalAberto(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSalvar();
            }}
            className="space-y-4"
          >
            <Input
              label="Nome da Categoria"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="secondary" onClick={() => setModalAberto(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                Salvar
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

)