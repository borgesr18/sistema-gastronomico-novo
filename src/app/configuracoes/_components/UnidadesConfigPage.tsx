'use client';

import React, { useState } from 'react';
import Table, { TableRow, TableCell } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal, { useModal } from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { useUnidadesMedida } from '@/lib/unidadesService';

export default function UnidadesConfigPage() {
  const { unidades, adicionarUnidade } = useUnidadesMedida();
  const { isOpen, openModal, closeModal } = useModal();
  const [nova, setNova] = useState({ id: '', nome: '' });
  const [filtro, setFiltro] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    adicionarUnidade(nova.id, nova.nome);
    setNova({ id: '', nome: '' });
    closeModal();
  };

  const filtradas = unidades.filter(u =>
    u.id.toLowerCase().includes(filtro.toLowerCase()) ||
    u.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-xl font-bold">Unidades de Medida</h2>
      <Button onClick={openModal}>Nova Unidade</Button>
      <Input value={filtro} onChange={(e) => setFiltro(e.target.value)} placeholder="Buscar..." />

      <Table headers={['Sigla', 'Nome']}>
        {filtradas.map(u => (
          <TableRow key={u.id}>
            <TableCell>{u.id}</TableCell>
            <TableCell>{u.nome}</TableCell>
          </TableRow>
        ))}
      </Table>

      <Modal isOpen={isOpen} onClose={closeModal} title="Nova Unidade">
        <form onSubmit={handleAdd} className="space-y-2">
          <Input value={nova.id} onChange={(e) => setNova({ ...nova, id: e.target.value })} placeholder="Sigla" />
          <Input value={nova.nome} onChange={(e) => setNova({ ...nova, nome: e.target.value })} placeholder="Nome da Unidade" />
          <Button type="submit">Salvar</Button>
        </form>
      </Modal>
    </div>
  );
}
