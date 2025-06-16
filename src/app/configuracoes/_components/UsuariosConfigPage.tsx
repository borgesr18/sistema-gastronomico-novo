'use client';

import React, { useEffect, useState } from 'react';
import Modal, { useModal } from '@/components/ui/Modal';
import Table, { TableRow, TableCell } from '@/components/ui/Table';
import Toast from '@/components/ui/Toast';
import Button from '@/components/ui/Button';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: string;
}

const UsuariosConfigPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const { isOpen, openModal, closeModal } = useModal();

  // Buscar usuários da API
  const fetchUsuarios = async () => {
    try {
      const res = await fetch('/api/usuarios');
      const data = await res.json();
      setUsuarios(data.usuarios);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Deletar usuário
  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      const res = await fetch(`/api/usuarios/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setToast('Usuário excluído com sucesso!');
        fetchUsuarios();
      } else {
        setToast('Erro ao excluir usuário');
      }
    } catch (error) {
      console.error('Erro ao excluir:', error);
      setToast('Erro inesperado');
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Gerenciar Usuários</h1>

      {toast && <Toast>{toast}</Toast>}

      <Table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Role</th>
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
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(user.id)}
                >
                  Excluir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UsuariosConfigPage;
