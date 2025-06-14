'use client';
export const dynamic = "force-dynamic";

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Table, { TableRow, TableCell } from '@/components/ui/Table';
import Input from '@/components/ui/Input';
import Modal, { useModal } from '@/components/ui/Modal';
import { useUsuarios, Usuario } from '@/lib/useUsuariosApi';

export default function UsuariosConfigPage() {
<<<<<<< HEAD
  const { usuarios, registrarUsuario, removerUsuario, alterarSenha, editarUsuario } = useUsuarios();
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isSenhaOpen, openModal: openSenhaModal, closeModal: closeSenhaModal } = useModal();
  const { isOpen: isEditOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();
  const [novo, setNovo] = useState<{ nome: string; email: string; senha: string; confirmarSenha: string; role: 'admin' | 'editor' | 'viewer' | 'manager' }>({ nome: '', email: '', senha: '', confirmarSenha: '', role: 'viewer' });
  const [editar, setEditar] = useState<{ id: string; nome: string; email: string; role: 'admin' | 'editor' | 'viewer' | 'manager' }>({ id: '', nome: '', email: '', role: 'viewer' });
  const [erro, setErro] = useState('');
  const [senhaForm, setSenhaForm] = useState({ id: '', senha: '', confirmarSenha: '' });
  const [erroSenha, setErroSenha] = useState('');
  const [filtro, setFiltro] = useState('');

=======
  const { usuarios, listarUsuarios, criarUsuario, removerUsuario, alterarSenha, editarUsuario, erro, loading } = useUsuarios();
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isSenhaOpen, openModal: openSenhaModal, closeModal: closeSenhaModal } = useModal();
  const { isOpen: isEditOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();

  const [filtro, setFiltro] = useState('');
  const [novo, setNovo] = useState<{
    nome: string;
    email: string;
    senha: string;
    role: Usuario['role'];
  }>({
    nome: '',
    email: '',
    senha: '',
    role: 'viewer',
  });

  const [editar, setEditar] = useState<{ id: string; nome: string; email: string; role: Usuario['role'] }>({
    id: '',
    nome: '',
    email: '',
    role: 'viewer',
  });

  const [senhaForm, setSenhaForm] = useState({ id: '', senha: '', confirmarSenha: '' });
  const [erroSenha, setErroSenha] = useState('');
  const [sucesso, setSucesso] = useState('');

  useEffect(() => {
    listarUsuarios();
  }, []);

>>>>>>> main
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await criarUsuario(novo);
    if (res) {
      setSucesso('Usuário criado com sucesso!');
      setNovo({ nome: '', email: '', senha: '', role: 'viewer' });
      closeModal();
      listarUsuarios();
    }
<<<<<<< HEAD
    const criado = await registrarUsuario({ nome: novo.nome, email: novo.email, senha: novo.senha, role: novo.role });
    if (!criado) {
      setErro('Email já cadastrado ou senha fraca');
      return;
    }
    setNovo({ nome: '', email: '', senha: '', confirmarSenha: '', role: 'viewer' });
    setErro('');
    closeModal();
=======
>>>>>>> main
  };

  const iniciarAlterarSenha = (id: string) => {
    setSenhaForm({ id, senha: '', confirmarSenha: '' });
    setErroSenha('');
    openSenhaModal();
  };

<<<<<<< HEAD
  const iniciarEdicao = (u: { id: string; nome: string; email: string; role: 'admin' | 'editor' | 'viewer' }) => {
    setEditar(u);
    setErro('');
=======
  const iniciarEdicao = (u: { id: string; nome: string; email: string; role: Usuario['role'] }) => {
    setEditar(u);
>>>>>>> main
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

  const filtrados = usuarios.filter(u =>
    u.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    u.email.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold text-gray-800">Controle de Usuários</h1>
<<<<<<< HEAD
      <div className="flex flex-wrap items-end gap-2">
        <Button onClick={openModal} variant="primary">Novo Usuário</Button>
        <div className="flex-1 min-w-[150px]">
          <Input label="Buscar" value={filtro} onChange={e => setFiltro(e.target.value)} className="mb-0" />
        </div>
      </div>
      <Table headers={["Nome", "Email", "Perfil", "Ações"]}>
=======

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

      {loading && <p>Carregando usuários...</p>}
      {erro && <p className="text-red-600">{erro}</p>}

      <Table headers={['Nome', 'Email', 'Perfil', 'Ações']}>
>>>>>>> main
        {filtrados.map(u => (
          <TableRow key={u.id}>
            <TableCell>{u.nome}</TableCell>
            <TableCell>{u.email}</TableCell>
<<<<<<< HEAD
            <TableCell>
              {u.role === 'admin'
                ? 'Administrador'
                : u.role === 'editor'
                ? 'Editor'
                : u.role === 'manager'
                ? 'Gerente'
                : 'Visualizador'}
            </TableCell>
            <TableCell className="flex items-center space-x-2">
              <Button size="sm" variant="secondary" onClick={() => iniciarEdicao(u)}>
                Editar
=======
            <TableCell>{u.role}</TableCell>
            <TableCell className="flex items-center space-x-2">
              <Button size="sm" variant="secondary" onClick={() => iniciarEdicao(u)}>
                ✏️ Editar
>>>>>>> main
              </Button>
              <Button size="sm" variant="secondary" onClick={() => iniciarAlterarSenha(u.id)}>
                🔑 Alterar Senha
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
          {sucesso && <p className="text-green-600">{sucesso}</p>}
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
<<<<<<< HEAD
              onChange={e =>
                setNovo({ ...novo, role: e.target.value as 'admin' | 'editor' | 'viewer' | 'manager' })
              }
=======
              onChange={(e) => setNovo({ ...novo, role: e.target.value as Usuario['role'] })}
              className="border rounded p-2 w-full"
>>>>>>> main
            >
              <option value="viewer">Visualizador</option>
              <option value="editor">Editor</option>
              <option value="manager">Gerente</option>
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
            <Button type="button" variant="secondary" onClick={closeSenhaModal}>Cancelar</Button>
            <Button type="submit" variant="primary">Salvar</Button>
          </div>
        </form>
      </Modal>

<<<<<<< HEAD
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
              onChange={e =>
                setEditar({ ...editar, role: e.target.value as 'admin' | 'editor' | 'viewer' | 'manager' })
              }
=======
      {/* Modal Editar Usuário */}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Perfil</label>
            <select
              value={editar.role}
              onChange={(e) => setEditar({ ...editar, role: e.target.value as Usuario['role'] })}
              className="border border-[var(--cor-borda)] rounded-md p-2 w-full"
>>>>>>> main
            >
              <option value="viewer">Visualizador</option>
              <option value="editor">Editor</option>
              <option value="manager">Gerente</option>
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
