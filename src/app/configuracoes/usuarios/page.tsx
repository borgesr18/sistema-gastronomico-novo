'use client';

import { useState } from 'react';
import Table, { TableRow, TableCell } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal, { useModal } from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { useUsuarios } from '@/lib/usuariosService';

export default function UsuariosConfigPage() {
  const { usuarios, registrarUsuario, removerUsuario, alterarSenha, editarUsuario } = useUsuarios();

  const { isOpen, openModal, closeModal } = useModal(); // Novo usuário
  const { isOpen: isSenhaOpen, openModal: openSenhaModal, closeModal: closeSenhaModal } = useModal(); // Senha
  const { isOpen: isEditOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal(); // Edição

  const [novo, setNovo] = useState<{ nome: string; email: string; senha: string; confirmarSenha: string; role: 'admin' | 'editor' | 'viewer' }>({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    role: 'viewer',
  });

  const [editar, setEditar] = useState<{ id: string; nome: string; email: string; role: 'admin' | 'editor' | 'viewer' }>({
    id: '',
    nome: '',
    email: '',
    role: 'viewer',
  });

  const [erro, setErro] = useState('');
  const [senhaForm, setSenhaForm] = useState({ id: '', senha: '', confirmarSenha: '' });
  const [erroSenha, setErroSenha] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (novo.senha !== novo.confirmarSenha) {
      setErro('Senhas não conferem');
      return;
    }

    const criado = registrarUsuario({ nome: novo.nome, email: novo.email, senha: novo.senha, role: novo.role });
    if (!criado) {
      setErro('Email já cadastrado ou senha fraca');
      return;
    }

    setNovo({ nome: '', email: '', senha: '', confirmarSenha: '', role: 'viewer' });
    setErro('');
    closeModal();
  };

  const iniciarAlterarSenha = (id: string) => {
    setSenhaForm({ id, senha: '', confirmarSenha: '' });
    setErroSenha('');
    openSenhaModal();
  };

  const iniciarEdicao = (u: { id: string; nome: string; email: string; role: 'admin' | 'editor' | 'viewer' }) => {
    setEditar(u);
    setErro('');
    openEditModal();
  };

  const handleAlterarSenha = (e: React.FormEvent) => {
    e.preventDefault();
    if (senhaForm.senha !== senhaForm.confirmarSenha) {
      setErroSenha('Senhas não conferem');
      return;
    }

    alterarSenha(senhaForm.id, senhaForm.senha);
    closeSenhaModal();
  };

  const handleEditar = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = editarUsuario(editar.id, editar);
    if (!ok) {
      setErro('Email já cadastrado');
      return;
    }

    closeEditModal();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Controle de Usuários</h1>
      <Button onClick={openModal} variant="primary">Novo Usuário</Button>

      <Table headers={["Nome", "Email", "Perfil", "Ações"]}>
        {usuarios.map(u => (
          <TableRow key={u.id}>
            <TableCell>{u.nome}</TableCell>
            <TableCell>{u.email}</TableCell>
            <TableCell>
              {u.role === 'admin' ? 'Administrador' : u.role === 'editor' ? 'Editor' : 'Visualizador'}
            </TableCell>
            <TableCell className="flex items-center space-x-2">
              <Button size="sm" variant="secondary" onClick={() => iniciarEdicao(u)}>Editar</Button>
              <Button size="sm" variant="secondary" onClick={() => iniciarAlterarSenha(u.id)}>Alterar Senha</Button>
              <Button size="sm" variant="danger" onClick={() => removerUsuario(u.id)}>Excluir</Button>
            </TableCell>
          </TableRow>
        ))}
      </Table>

      {/* Modal Novo Usuário */}
      <Modal isOpen={isOpen} onClose={closeModal} title="Novo Usuário">
        <form onSubmit={handleSubmit} className="space-y-4">
          {erro && <p className="text-sm text-red-600">{erro}</p>}
          <Input label="Nome" value={novo.nome} onChange={e => setNovo({ ...novo, nome: e.target.value })} required />
          <Input label="Email" type="email" value={novo.email} onChange={e => setNovo({ ...novo, email: e.target.value })} required />
          <Input label="Senha" type="password" value={novo.senha} onChange={e => setNovo({ ...novo, senha: e.target.value })} required />
          <Input label="Confirmar Senha" type="password" value={novo.confirmarSenha} onChange={e => setNovo({ ...novo, confirmarSenha: e.target.value })} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Perfil</label>
            <select
              className="border border-[var(--cor-borda)] rounded-md p-2 w-full"
              value={novo.role}
              onChange={e => setNovo({ ...novo, role: e.target.value as 'admin' | 'editor' | 'viewer' })}
            >
              <option value="viewer">Visualizador</option>
              <option value="editor">Editor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={closeModal}>Cancelar</Button>
            <Button type="submit" variant="primary">Salvar</Button>
          </div>
        </form>
      </Modal>

      {/* Modal Alterar Senha */}
      <Modal isOpen={isSenhaOpen} onClose={closeSenhaModal} title="Alterar Senha">
        <form onSubmit={handleAlterarSenha} className="space-y-4">
          {erroSenha && <p className="text-sm text-red-600">{erroSenha}</p>}
          <Input label="Nova Senha" type="password" value={senhaForm.senha} onChange={e => setSenhaForm({ ...senhaForm, senha: e.target.value })} required />
          <Input label="Confirmar Senha" type="password" value={senhaForm.confirmarSenha} onChange={e => setSenhaForm({ ...senhaForm, confirmarSenha: e.target.value })} required />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={closeSenhaModal}>Cancelar</Button>
            <Button type="submit" variant="primary">Salvar</Button>
          </div>
        </form>
      </Modal>

      {/* Modal Editar Usuário */}
      <Modal isOpen={isEditOpen} onClose={closeEditModal} title="Editar Usuário">
        <form onSubmit={handleEditar} className="space-y-4">
          {erro && <p className="text-sm text-red-600">{erro}</p>}
          <Input label="Nome" value={editar.nome} onChange={e => setEditar({ ...editar, nome: e.target.value })} required />
          <Input label="Email" type="email" value={editar.email} onChange={e => setEditar({ ...editar, email: e.target.value })} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Perfil</label>
            <select
              className="border border-[var(--cor-borda)] rounded-md p-2 w-full"
              value={editar.role}
              onChange={e => setEditar({ ...editar, role: e.target.value as 'admin' | 'editor' | 'viewer' })}
            >
              <option value="viewer">Visualizador</option>
              <option value="editor">Editor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={closeEditModal}>Cancelar</Button>
            <Button type="submit" variant="primary">Salvar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
