'use client';

import React, { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Modal, { useModal } from '@/contexts/ModalContext';
import { Table,  TableRow, TableCell } from '@/components/ui/Table';
import Toast from '@/components/ui/Toast';
import UsuarioForm from './UsuarioForm';
import SenhaForm from './SenhaForm';
import { Usuario } from '@prisma/client';

export default function UsuariosConfigPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isSenhaOpen, openModal: openSenhaModal, closeModal: closeSenhaModal } = useModal();
  const [usuarioAlterandoSenha, setUsuarioAlterandoSenha] = useState<Usuario | null>(null);

  // Buscar lista de usuários
  const fetchUsuarios = async () => {
    try {
      const res = await fetch('/api/usuarios');
      const data = await res.json();
      setUsuarios(data);
    } catch (error) {
      setToast('Erro ao carregar usuários');
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleSalvar = async (usuario: Usuario) => {
    try {
      const method = usuario.id ? 'PUT' : 'POST';
      const endpoint = usuario.id ? `/api/usuarios/${usuario.id}` : '/api/usuarios';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario),
      });

      if (res.ok) {
        setToast('Usuário salvo com sucesso');
        closeModal();
        fetchUsuarios();
      } else {
        const errorData = await res.json();
        setToast(errorData.message || 'Erro ao salvar usuário');
      }
    } catch (error) {
      setToast('Erro ao salvar usuário');
    }
  };

  const handleExcluir = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
    try {
      const res = await fetch(`/api/usuarios/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setToast('Usuário excluído com sucesso');
        fetchUsuarios();
      } else {
        const errorData = await res.json();
        setToast(errorData.message || 'Erro ao excluir usuário');
      }
    } catch (error) {
      setToast('Erro ao excluir usuário');
    }
  };

  const handleEditar = (usuario: Usuario) => {
    setUsuarioEditando(usuario);
    openModal();
  };

  const handleNovo = () => {
    setUsuarioEditando(null);
    openModal();
  };

  const handleAbrirAlterarSenha = (usuario: Usuario) => {
    setUsuarioAlterandoSenha(usuario);
    openSenhaModal();
  };

  const handleSalvarSenha = async (novaSenha: string) => {
    if (!usuarioAlterandoSenha) return;
    try {
      const res = await fetch(`/api/usuarios/alterarSenha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: usuarioAlterandoSenha.id,
          novaSenha,
        }),
      });

      if (res.ok) {
        setToast('Senha alterada com sucesso');
        closeSenhaModal();
      } else {
        const errorData = await res.json();
        setToast(errorData.message || 'Erro ao alterar senha');
      }
    } catch (error) {
      setToast('Erro ao alterar senha');
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Gerenciar Usuários</h1>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <Button variant="primary" onClick={handleNovo}>
        Novo Usuário
      </Button>

      <Table headers={['Nome', 'Email', 'Role', 'Ações']}>
        <tbody>
          {usuarios.map((usuario) => (
            <TableRow key={usuario.id}>
              <TableCell>{usuario.nome}</TableCell>
              <TableCell>{usuario.email}</TableCell>
              <TableCell>{usuario.role}</TableCell>
              <TableCell>
                <Button variant="secondary" onClick={() => handleEditar(usuario)} >
                  Editar
                </Button>
                <Button variant="danger" onClick={() => handleExcluir(usuario.id)} >
                  Excluir
                </Button>
                <Button variant="primary" onClick={() => handleAbrirAlterarSenha(usuario)} >
                  Alterar Senha
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>

      {isOpen && (
        <Modal isOpen={isOpen} title="Usuário" onClose={closeModal}>
          <UsuarioForm
            usuario={usuarioEditando}
            onSave={handleSalvar}
            onCancel={closeModal}
          />
        </Modal>
      )}

      {isSenhaOpen && (
        <Modal isOpen={isSenhaOpen} title="Alterar Senha" onClose={closeSenhaModal}>
          <SenhaForm
            onSave={handleSalvarSenha}
            onCancel={closeSenhaModal}
          />
        </Modal>
      )}
    </div>
  );
}
