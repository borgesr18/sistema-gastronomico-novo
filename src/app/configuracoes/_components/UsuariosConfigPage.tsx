'use client';

import React, { useState, useEffect } from 'react';
import Table, { TableRow, TableCell } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal, { useModal } from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { useUsuarios } from '@/lib/usuariosService';

export default function UsuariosConfigPage() {
  const { usuarios, registrarUsuario, removerUsuario, alterarSenha, editarUsuario } = useUsuarios();
  const { isOpen, openModal, closeModal } = useModal();
  const [novo, setNovo] = useState({ nome: '', email: '', senha: '', role: 'viewer' });
  const [filtro, setFiltro] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const criado = await registrarUsuario(novo);
    if (criado) {
      setNovo({ nome: '', email: '', senha: '', role: 'viewer' });
      closeModal();
    }
  };

  const filtrados = usuarios.filter(u =>
    u.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    u.email.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-xl font-bold">Usuários</h2>
      <Button onClick={openModal}>Novo Usuário</Button>
      <Input value={filtro} onChange={(e) => setFiltro(e.target.value)} placeholder="Buscar..." />

      <Table headers={['Nome', 'Email', 'Perfil']}>
        {filtrados.map(u => (
          <TableRow key={u.id}>
            <TableCell>{u.nome}</TableCell>
            <TableCell>{u.email}</TableCell>
            <TableCell>{u.role}</TableCell>
          </TableRow>
        ))}
      </Table>

      <Modal isOpen={isOpen} onClose={closeModal} title="Novo Usuário">
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input value={novo.nome} onChange={(e) => setNovo({ ...novo, nome: e.target.value })} placeholder="Nome" />
          <Input value={novo.email} onChange={(e) => setNovo({ ...novo, email: e.target.value })} placeholder="Email" />
          <Input type="password" value={novo.senha} onChange={(e) => setNovo({ ...novo, senha: e.target.value })} placeholder="Senha" />
          <Button type="submit">Salvar</Button>
        </form>
      </Modal>
    </div>
  );
}
