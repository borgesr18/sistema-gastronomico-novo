'use client';

import { useState } from 'react';
import Link from 'next/link';
import Table, { TableRow, TableCell } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal, { useModal } from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { useUsuarios } from '@/lib/usuariosService';

export default function UsuariosConfigPage() {
  const { usuarios, registrarUsuario, removerUsuario, alterarSenha } = useUsuarios();
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isSenhaOpen, openModal: openSenhaModal, closeModal: closeSenhaModal } = useModal();
  const [novo, setNovo] = useState({ nome: '', email: '', senha: '', confirmarSenha: '' });
  const [erro, setErro] = useState('');
  const [senhaForm, setSenhaForm] = useState({ id: '', senha: '', confirmarSenha: '' });
  const [erroSenha, setErroSenha] = useState('');
  const { usuarios, registrarUsuario, removerUsuario } = useUsuarios();
  const { isOpen, openModal, closeModal } = useModal();
  const [novo, setNovo] = useState({ nome: '', email: '', senha: '', confirmarSenha: '' });
  const [erro, setErro] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (novo.senha !== novo.confirmarSenha) {
      setErro('Senhas não conferem');
      return;
    }
    registrarUsuario({ nome: novo.nome, email: novo.email, senha: novo.senha });
    setNovo({ nome: '', email: '', senha: '', confirmarSenha: '' });
    setErro('');
    closeModal();
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
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Controle de Usuários</h1>
      <Button onClick={openModal} variant="primary">Novo Usuário</Button>
      <Table headers={["Nome", "Email", "Ações"]}>
        {usuarios.map(u => (
          <TableRow key={u.id}>
            <TableCell>{u.nome}</TableCell>
            <TableCell>{u.email}</TableCell>
            <TableCell className="space-x-2">
              <Button size="sm" variant="secondary" onClick={() => iniciarAlterarSenha(u.id)}>
                Alterar Senha
              </Button>
              <Button size="sm" variant="danger" onClick={() => removerUsuario(u.id)}>
                Excluir
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </Table>

      <Modal isOpen={isOpen} onClose={closeModal} title="Novo Usuário">
        <form onSubmit={handleSubmit} className="space-y-4">
          {erro && <p className="text-sm text-red-600">{erro}</p>}
          <Input label="Nome" value={novo.nome} onChange={e => setNovo({ ...novo, nome: e.target.value })} required />
          <Input label="Email" type="email" value={novo.email} onChange={e => setNovo({ ...novo, email: e.target.value })} required />
          <Input label="Senha" type="password" value={novo.senha} onChange={e => setNovo({ ...novo, senha: e.target.value })} required />
          <Input label="Confirmar Senha" type="password" value={novo.confirmarSenha} onChange={e => setNovo({ ...novo, confirmarSenha: e.target.value })} required />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={closeModal}>Cancelar</Button>
            <Button type="submit" variant="primary">Salvar</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isSenhaOpen} onClose={closeSenhaModal} title="Alterar Senha">
        <form onSubmit={handleAlterarSenha} className="space-y-4">
          {erroSenha && <p className="text-sm text-red-600">{erroSenha}</p>}
          <Input
            label="Nova Senha"
            type="password"
            value={senhaForm.senha}
            onChange={e => setSenhaForm({ ...senhaForm, senha: e.target.value })}
            required
          />
          <Input
            label="Confirmar Senha"
            type="password"
            value={senhaForm.confirmarSenha}
            onChange={e => setSenhaForm({ ...senhaForm, confirmarSenha: e.target.value })}
            required
          />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={closeSenhaModal}>Cancelar</Button>
            <Button type="submit" variant="primary">Salvar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
