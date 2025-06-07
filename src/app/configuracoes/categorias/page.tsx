'use client';

import { useState } from 'react';
import Table, { TableRow, TableCell } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal, { useModal } from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { useCategorias } from '@/lib/categoriasService';

export default function CategoriasConfigPage() {
  const { categorias, adicionarCategoria, atualizarCategoria, removerCategoria } = useCategorias();
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isEditOpen, openModal: openEdit, closeModal: closeEdit } = useModal();
  const [nova, setNova] = useState('');
  const [editar, setEditar] = useState({ id: '', nome: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    adicionarCategoria(nova.trim());
    setNova('');
    closeModal();
  };

  const iniciarEdicao = (id: string, nome: string) => {
    setEditar({ id, nome });
    openEdit();
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    atualizarCategoria(editar.id, editar.nome.trim());
    closeEdit();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Categorias de Produtos</h1>
      <Button onClick={openModal} variant="primary">Nova Categoria</Button>
      <Table headers={["Nome", "Ações"]}>
        {categorias.map(cat => (
          <TableRow key={cat.id}>
            <TableCell>{cat.nome}</TableCell>
            <TableCell className="flex items-center space-x-2">
              <Button size="sm" variant="secondary" onClick={() => iniciarEdicao(cat.id, cat.nome)}>Editar</Button>
              <Button size="sm" variant="danger" onClick={() => removerCategoria(cat.id)}>Excluir</Button>
            </TableCell>
          </TableRow>
        ))}
      </Table>
      <Modal isOpen={isOpen} onClose={closeModal} title="Nova Categoria">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label="Nome" value={nova} onChange={e => setNova(e.target.value)} required />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={closeModal}>Cancelar</Button>
            <Button type="submit" variant="primary">Salvar</Button>
          </div>
        </form>
      </Modal>
      <Modal isOpen={isEditOpen} onClose={closeEdit} title="Editar Categoria">
        <form onSubmit={handleEdit} className="space-y-4">
          <Input label="Nome" value={editar.nome} onChange={e => setEditar({ ...editar, nome: e.target.value })} required />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={closeEdit}>Cancelar</Button>
            <Button type="submit" variant="primary">Salvar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
