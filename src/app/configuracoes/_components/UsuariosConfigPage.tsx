'use client';

import React, { useEffect, useState } from 'react';
import Modal, { useModal } from '@/components/ui/Modal';
import Table, { TableRow, TableCell } from '@/components/ui/Table';
import Toast from '@/components/ui/Toast';
import UsuarioForm from './UsuarioForm';
import SenhaForm from './SenhaForm';
import { useModal as useSenhaModal } from '@/components/ui/Modal';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: string;
}

export default function UsuariosConfigPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isSenhaOpen, openModal: openSenhaModal, closeModal: closeSenhaModal } = useSenhaModal();

  const listarUsuarios = async () => {
    const res = await fetch('/api/usuarios');
    const data = await res.json();
    setUsuarios(data);
  };

  useEffect(() => {
    listarUsuarios();
  }, []);

  const handleCriar = () => {
    setUsuarioSelecionado(null);
    openModal();
  };

  const handleEditar = (user: Usuario) => {
    setUsuarioSelecionado(user);
    openModal();
  };

  const handleAlterarSenha = (user: Usuario) => {
    setUsuarioSelecionado(user);
    openSenhaModal();
  };

  const handleRemover = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      await fetch(`/api/usuarios/${id}`, { method: 'DELETE' });
      setToast('Usuário removido com sucesso');
      listarUsuarios();
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Gerenciar Usuários</h1>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <Table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Função</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.nome}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <button onClick={() => handleEditar(user)} className="text-blue-500 mr-2">
                  Editar
                </button>
                <button onClick={() => handleAlterarSenha(user)} className="text-yellow-500 mr-2">
                  Alterar Senha
                </button>
                <button onClick={() => handleRemover(user.id)} className="text-red-500">
                  Excluir
                </button>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>

      {isOpen && (
        <Modal isOpen={isOpen} onClose={closeModal}>
          <UsuarioForm
            usuario={usuarioSelecionado}
            onSuccess={() => {
              listarUsuarios();
              closeModal();
            }}
          />
        </Modal>
      )}

      {isSenhaOpen && usuarioSelecionado && (
        <Modal isOpen={isSenhaOpen} onClose={closeSenhaModal}>
          <SenhaForm
            usuario={usuarioSelecionado}
            onSuccess={() => {
              listarUsuarios();
              closeSenhaModal();
            }}
          />
        </Modal>
      )}

      <button onClick={handleCriar} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        Novo Usuário
      </button>
    </div>
  );
}
