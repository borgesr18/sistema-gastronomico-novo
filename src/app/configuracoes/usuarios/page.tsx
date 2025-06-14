'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Table, { TableRow, TableCell } from '@/components/ui/Table';
import Input from '@/components/ui/Input';
import Modal, { useModal } from '@/components/ui/Modal';
import { useUsuariosApi, Usuario } from '@/lib/useUsuariosApi';

export default function UsuariosConfigPage() {
  const { usuarios, listarUsuarios, criarUsuario, erro, loading } = useUsuariosApi();
  const { isOpen, openModal, closeModal } = useModal();
  const [filtro, setFiltro] = useState('');
  const [novo, setNovo] = useState({
    nome: '',
    email: '',
    senha: '',
    role: 'viewer' as Usuario['role'],
  });
  const [sucesso, setSucesso] = useState('');

  useEffect(() => {
    listarUsuarios();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await criarUsuario(novo);
    if (res) {
      setSucesso('Usuário criado com sucesso!');
      setNovo({ nome: '', email: '', senha: '', role: 'viewer' });
      closeModal();
      listarUsuarios();
    }
  };

  const filtrados = usuarios.filter(u =>
    u.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    u.email.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold text-gray-800">Usuários (Banco Supabase)</h1>

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
              onChange={(e) => setNovo({ ...novo, role: e.target.value as Usuario['role'] })}
              className="border rounded p-2 w-full"
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
    </div>
  );
}
