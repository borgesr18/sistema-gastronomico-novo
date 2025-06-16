'use client';

import React, { useEffect, useState } from 'react';
import Modal, { useModal } from '@/components/ui/Modal';
import Table, { TableRow, TableCell } from '@/components/ui/Table';
import Toast from '@/components/ui/Toast';
import UsuarioForm from './UsuarioForm';
import SenhaForm from './SenhaForm';
import { Usuario, Role } from '@prisma/client';

export default function UsuariosConfigPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [usuarioAlterandoSenha, setUsuarioAlterandoSenha] = useState<Usuario | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isSenhaOpen, openModal: openSenhaModal, closeModal: closeSenhaModal } = useModal();

  const listarUsuarios = async () => {
    try {
      const res = await fetch('/api/usuarios');
      const data = await res.json();
      setUsuarios(data.usuarios);
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
    }
  };

  useEffect(() => {
    listarUsuarios();
  }, []);

  const handleNovo = () => {
    setUsuarioEditando(null);
    openModal();
  };

  const handleEditar = (usuario: Usuario) => {
    setUsuarioEditando(usuario);
    openModal();
  };

  const handleAlterarSenha = (usuario: Usuario) => {
    setUsuarioAlterandoSenha(usuario);
    openSenhaModal();
  };

  const handleRemover = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este usuário?')) {
      await fetch(`/api/usuarios/remover/${id}`, { method: 'DELETE' });
      listarUsuarios();
      setToast('Usuário removido com sucesso.');
    }
  };

  const handleSalvar = async (dados: { nome: string; email: string; role: Role }) => {
    if (usuarioEditando) {
      // Editando
      await fetch(`/api/usuarios/editar/${usuarioEditando.id}`, {
        method: 'PUT',
        body: JSON.stringify(dados),
      });
      setToast('Usuário atualizado com sucesso.');
    } else {
      // Criando novo
      await fetch('/api/usuarios/criar', {
        method: 'POST',
        body: JSON.stringify(dados),
      });
      setToast('Usuário criado com sucesso.');
    }
    closeModal();
    listarUsuarios();
  };

  const handleSalvarSenha = async (novaSenha: string) => {
    if (usuarioAlterandoSenha) {
      await fetch(`/api/usuarios/alterarSenha/${usuarioAlterandoSenha.id}`, {
        method: 'PUT',
        body: JSON.stringify({ novaSenha }),
      });
      setToast('Senha atualizada com sucesso.');
      closeSenhaModal();
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Gerenciar Usuários</h1>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <Table headers={['Nome', 'Email', 'Role', 'Ações']}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Role</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <TableRow key={usuario.id}>
              <TableCell>{usuario.nome}</TableCell>
              <TableCell>{usuario.email}</TableCell>
              <TableCell>{usuario.role}</TableCell>
              <TableCell>
                <button
                  className="text-blue-500 mr-2"
                  onClick={() => handleEditar(usuario)}
                >
                  Editar
                </button>
                <button
                  className="text-yellow-500 mr-2"
                  onClick={() => handleAlterarSenha(usuario)}
                >
                  Senha
                </button>
                <button
                  className="text-red-500"
                  onClick={() => handleRemover(usuario.id)}
                >
                  Remover
                </button>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>

      <button
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
        onClick={handleNovo}
      >
        Novo Usuário
      </button>

      {isOpen && (
        <Modal onClose={closeModal}>
          <UsuarioForm
            usuario={usuarioEditando}
            onSave={handleSalvar}
            onCancel={closeModal}
          />
        </Modal>
      )}

      {isSenhaOpen && (
        <Modal onClose={closeSenhaModal}>
          <SenhaForm
            onSave={handleSalvarSenha}
            onCancel={closeSenhaModal}
          />
        </Modal>
      )}
    </div>
  );
}
