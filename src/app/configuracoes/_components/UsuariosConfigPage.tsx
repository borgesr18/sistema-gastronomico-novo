'use client';

import React, { useEffect, useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Modal, { useModal } from '@/components/ui/Modal';
import Table, { TableRow, TableCell } from '@/components/ui/Table';
import { useUsuarios } from '@/lib/useUsuarios';
import Toast from '@/components/ui/Toast';

export default function UsuariosConfigPage() {
  const {
    usuarios,
    registrarUsuario,
    removerUsuario,
    alterarSenha,
    editarUsuario,
  } = useUsuarios();

  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isSenhaOpen, openModal: openSenhaModal, closeModal: closeSenhaModal } = useModal();
  const { isOpen: isEditOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();

  const [filtro, setFiltro] = useState('');
  const [novo, setNovo] = useState({
    nome: '',
    email: '',
    senha: '',
    role: 'viewer' as 'admin' | 'editor' | 'viewer' | 'manager',
  });
  const [editar, setEditar] = useState<{
    id: string;
    nome: string;
    email: string;
    role: 'admin' | 'editor' | 'viewer' | 'manager';
  }>({
    id: '',
    nome: '',
    email: '',
    role: 'viewer',
  });
  const [senhaForm, setSenhaForm] = useState({
    id: '',
    senha: '',
    confirmarSenha: '',
  });
  const [erro, setErro] = useState('');
  const [erroSenha, setErroSenha] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(''), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const criado = await registrarUsuario({
      ...novo,
      role: novo.role as 'admin' | 'editor' | 'viewer' | 'manager',
    });

    if (!criado) {
      setErro('Email já cadastrado ou senha fraca');
      return;
    }

    setNovo({ nome: '', email: '', senha: '', role: 'viewer' });
    setErro('');
    closeModal();
    setToast('Usuário criado com sucesso');
  };

  const iniciarEdicao = (u: typeof editar) => {
    setEditar(u);
    setErro('');
    openEditModal();
  };

  const handleEditar = (e: React.FormEvent) => {
    e.preventDefault();

    const ok = editarUsuario(editar.id, editar);
    if (!ok) {
      setErro('Email já cadastrado');
      return;
    }
    closeEditModal();
    setToast('Usuário atualizado');
  };

  const iniciarAlterarSenha = (id: string) => {
    setSenhaForm({ id, senha: '', confirmarSenha: '' });
    setErroSenha('');
    openSenhaModal();
  };

  const handleAlterarSenha = (e: React.FormEvent) => {
    e.preventDefault();
    if (senhaForm.senha !== senhaForm.confirmarSenha) {
      setErroSenha('Senhas não conferem');
      return;
    }
    alterarSenha(senhaForm.id, senhaForm.senha);
    closeSenhaModal();
    setToast('Senha alterada');
  };

  const filtrados = usuarios.filter(
    (u) =>
      u.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      u.email.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Toast message={toast} onClose={() => setToast('')} />

      <div className="flex flex-wrap gap-2 items-center">
        <Button onClick={openModal} variant="primary">➕ Novo Usuário</Button>
        <div className="flex-1 min-w-[150px]">
          <Input
            label=""
            placeholder="Buscar..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
      </div>

      <Table headers={['Nome', 'Email', 'Perfil', 'Ações']}>
        {filtrados.map((u) => (
          <TableRow key={u.id}>
            <TableCell>{u.nome}</TableCell>
            <TableCell>{u.email}</TableCell>
            <TableCell>{u.role}</TableCell>
            <TableCell className="flex items-center space-x-2">
              <Button size="sm" variant="secondary" onClick={() => iniciarEdicao(u)}>
                ✏️ Editar
              </Button>
              <Button size="sm" variant="secondary" onClick={() => iniciarAlterarSenha(u.id)}>
                🔑 Senha
              </Button>
              <Button size="sm" variant="danger" onClick={() => removerUsuario(u.id)}>
                🗑️ Excluir
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </Table>

      {/* Modal Novo Usuário */}
      <Modal isOpen={isOpen} onClose={closeModal} title="Novo Usuário">
        <form onSubmit={handleSubmit} className="space-y-3">
          {erro && <p className="text-red-600 text-sm">{erro}</p>}
          <Input
            label="Nome"
            value={novo.nome}
            onChange={(e) => setNovo({ ...novo, nome: e.target.value })}
            required
          />
          <Input
            label="Email"
            value={novo.email}
            onChange={(e) => setNovo({ ...novo, email: e.target.value })}
            required
          />
          <Input
            label="Senha"
            type="password"
            value={novo.senha}
            onChange={(e) => setNovo({ ...novo, senha: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm mb-1">Perfil</label>
            <select
              value={novo.role}
              onChange={(e) =>
                setNovo({
                  ...novo,
                  role: e.target.value as 'admin' | 'editor' | 'viewer' | 'manager',
                })
              }
              className="border rounded w-full p-2"
            >
              <option value="viewer">Visualizador</option>
              <option value="editor">Editor</option>
              <option value="manager">Gerente</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Salvar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Editar */}
      <Modal isOpen={isEditOpen} onClose={closeEditModal} title="Editar Usuário">
        <form onSubmit={handleEditar} className="space-y-4">
          {erro && <p className="text-sm text-red-600">{erro}</p>}
          <Input
            label="Nome"
            value={editar.nome}
            onChange={(e) => setEditar({ ...editar, nome: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={editar.email}
            onChange={(e) => setEditar({ ...editar, email: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm mb-1">Perfil</label>
            <select
              value={editar.role}
              onChange={(e) =>
                setEditar({
                  ...editar,
                  role: e.target.value as 'admin' | 'editor' | 'viewer' | 'manager',
                })
              }
              className="border rounded p-2 w-full"
            >
              <option value="viewer">Visualizador</option>
              <option value="editor">Editor</option>
              <option value="manager">Gerente</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={closeEditModal}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Salvar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Alterar Senha */}
      <Modal isOpen={isSenhaOpen} onClose={closeSenhaModal} title="Alterar Senha">
        <form onSubmit={handleAlterarSenha} className="space-y-4">
          {erroSenha && <p className="text-sm text-red-600">{erroSenha}</p>}
          <Input
            label="Nova Senha"
            type="password"
            value={senhaForm.senha}
            onChange={(e) => setSenhaForm({ ...senhaForm, senha: e.target.value })}
            required
          />
          <Input
            label="Confirmar Senha"
            type="password"
            value={senhaForm.confirmarSenha}
            onChange={(e) => setSenhaForm({ ...senhaForm, confirmarSenha: e.target.value })}
            required
          />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={closeSenhaModal}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Salvar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
