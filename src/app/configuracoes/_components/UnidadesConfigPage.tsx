'use client';

import React, { useEffect, useState } from 'react';
import { Unidade } from '@prisma/client';
import Modal, { useModal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Toast from '@/components/ui/Toast';
import { Table, TableRow, TableCell } from '@/components/ui/Table';
import UnidadeForm from './UnidadeForm';

export default function UnidadesConfigPage() {
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [filtro, setFiltro] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [unidadeEditando, setUnidadeEditando] = useState<Unidade | null>(null);

  const { isOpen, openModal, closeModal } = useModal();

  const carregarUnidades = async () => {
    const res = await fetch('/api/unidades');
    const data = await res.json();
    setUnidades(data);
  };

  useEffect(() => {
    carregarUnidades();
  }, []);

  const handleSalvar = async (unidade: Partial<Unidade>) => {
    const method = unidade.id ? 'PUT' : 'POST';
    const url = unidade.id ? `/api/unidades/${unidade.id}` : '/api/unidades';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(unidade),
    });

    if (res.ok) {
      setToast('Unidade salva com sucesso!');
      closeModal();
      carregarUnidades();
    } else {
      setToast('Erro ao salvar unidade.');
    }
  };

  const handleRemover = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover esta unidade?')) return;

    const res = await fetch(`/api/unidades/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setToast('Unidade removida.');
      carregarUnidades();
    } else {
      setToast('Erro ao remover unidade.');
    }
  };

  const filtradas = unidades.filter((u) =>
    u.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    u.sigla.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-xl font-bold">Unidades de Medida</h2>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <Button onClick={() => { setUnidadeEditando(null); openModal(); }}>Nova Unidade</Button>

      <Input
        label="Buscar"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        placeholder="Buscar..."
      />

      <Table headers={['Sigla', 'Nome', 'Ações']}>
        {filtradas.map((u) => (
          <TableRow key={u.id}>
            <TableCell>{u.sigla}</TableCell>
            <TableCell>{u.nome}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button variant="secondary" size="sm" onClick={() => { setUnidadeEditando(u); openModal(); }}>
                  Editar
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleRemover(u.id)}>
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
          title={unidadeEditando ? 'Editar Unidade' : 'Nova Unidade'}
          onClose={closeModal}
        >
          <UnidadeForm
            unidade={unidadeEditando}
            onSave={handleSalvar}
            onCancel={closeModal}
          />
        </Modal>
      )}
    </div>
  );
}
