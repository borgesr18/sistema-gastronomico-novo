'use client';

import { useState } from 'react';
import Table, { TableRow, TableCell } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal, { useModal } from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { useUnidadesMedida } from '@/lib/unidadesService';

export default function UnidadesConfigPage() {
  const { unidades, adicionarUnidade, atualizarUnidade, removerUnidade } = useUnidadesMedida();
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isEditOpen, openModal: openEdit, closeModal: closeEdit } = useModal();
  const [nova, setNova] = useState({ id: '', nome: '' });
  const [editar, setEditar] = useState({ id: '', nome: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    adicionarUnidade(nova.id.trim(), nova.nome.trim());
    setNova({ id: '', nome: '' });
    closeModal();
  };

  const iniciarEdicao = (id: string, nome: string) => {
    setEditar({ id, nome });
    openEdit();
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    atualizarUnidade(editar.id, editar.nome.trim());
    closeEdit();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Unidades de Medida</h1>
      <Button onClick={openModal} variant="primary">Nova Unidade</Button>
      <Table headers={["Sigla", "Nome", "Ações"]}>
        {unidades.map(u => (
          <TableRow key={u.id}>
            <TableCell>{u.id}</TableCell>
            <TableCell>{u.nome}</TableCell>
            <TableCell className="flex items-center space-x-2">
              <Button size="sm" variant="secondary" onClick={() => iniciarEdicao(u.id, u.nome)}>Editar</Button>
              <Button size="sm" variant="danger" onClick={() => removerUnidade(u.id)}>Excluir</Button>
            </TableCell>
          </TableRow>
        ))}
      </Table>
      <Modal isOpen={isOpen} onClose={closeModal} title="Nova Unidade">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label="Sigla" value={nova.id} onChange={e => setNova({ ...nova, id: e.target.value })} required />
          <Input label="Nome" value={nova.nome} onChange={e => setNova({ ...nova, nome: e.target.value })} required />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={closeModal}>Cancelar</Button>
            <Button type="submit" variant="primary">Salvar</Button>
          </div>
        </form>
      </Modal>
      <Modal isOpen={isEditOpen} onClose={closeEdit} title="Editar Unidade">
        <form onSubmit={handleEdit} className="space-y-4">
          <Input label="Sigla" value={editar.id} disabled />
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
