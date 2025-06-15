'use client';

import React, { useState } from 'react';
import Table, { TableRow, TableCell } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal, { useModal } from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { useCategoriasReceita } from '@/lib/categoriasReceitasService';

export default function CategoriasReceitasConfigPage() {
  const { categorias, adicionar } = useCategoriasReceita();
  const { isOpen, openModal, closeModal } = useModal();
  const [nova, setNova] = useState('');
  const [filtro, setFiltro] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    adicionar(nova);
    setNova('');
    closeModal();
  };

  const filtradas = categorias.filter(c => c.nome.toLowerCase().includes(filtro.toLowerCase()));

  return (
    <div>
      <h2 className="text-xl font-bold">Categorias de Receitas</h2>
      <Button onClick={openModal}>Nova Categoria</Button>
      <Input value={filtro} onChange={(e) => setFiltro(e.target.value)} placeholder="Buscar..." />

      <Table headers={['Nome']}>
        {filtradas.map(c => (
          <TableRow key={c.id}>
            <TableCell>{c.nome}</TableCell>
          </TableRow>
        ))}
      </Table>

      <Modal isOpen={isOpen} onClose={closeModal} title="Nova Categoria">
        <form onSubmit={handleAdd} className="space-y-2">
          <Input value={nova} onChange={(e) => setNova(e.target.value)} placeholder="Nome da Categoria" />
          <Button type="submit">Salvar</Button>
        </form>
      </Modal>
    </div>
  );
}
