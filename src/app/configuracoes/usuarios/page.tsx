'use client';

import { useEffect, useState } from 'react';
import Table from '@/components/ui/Table';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Modal, { useModal } from '@/components/ui/Modal';
import { useUsuarios, Usuario, Role } from '@/lib/useUsuarios';

export default function UsuariosConfigPage() {
  const {
    usuarios,
    listarUsuarios,
    criarUsuario,
    removerUsuario,
    alterarSenha,
    editarUsuario,
    erro,
    loading,
  } = useUsuarios();

  const { isOpen, openModal, closeModal } = useModal();

  const [filtro, setFiltro] = useState('');
  const [novo, setNovo] = useState<{ nome: string; email: string; senha: string; role: Role }>({
    nome: '',
    email: '',
    senha: '',
    role: 'viewer',
  });

  const [editando, setEditando] = useState<Usuario | null>(null);
  const [senhaNova, setSenhaNova] = useState('');

  useEffect(() => {
    listarUsuarios();
  }, []);

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      u.email.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const criado = await criarUsuario(novo);
    if (criado) {
      setNovo({ nome: '', email: '', senha: '', role: 'viewer' });
      closeModal();
    }
  };

  const handleEditar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editando) return;
    await editarUsuario(editando.id, {
      nome: editando.nome,
      email: editando.email,
      role: editando.role,
    });
    setEditando(null);
    closeModal();
  };

  const handleAlterarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editando) return;
    await alterarSenha(editando.id, senhaNova);
    setSenhaNova('');
    setEditando(null);
    closeModal();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Gerenciar Usuários</h1>

      <div className="flex space-x-2">
        <Input
          placeholder="Filtrar por nome ou email"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <Button onClick={openModal}>Novo Usuário</Button>
      </div>

      <Table headers={['Nome', 'Email', 'Perfil', 'Ações']}>
        {usuariosFiltrados.map((u) => (
          <tr key={u.id}>
            <td>{u.nome}</td>
            <td>{u.email}</td>
            <td>{u.role}</td>
            <td className="space-x-2">
              <Button
                size="xs"
                variant="secondary"
                onClick={() => {
                  setEditando(u);
                  setSenhaNova('');
                  openModal();
                }}
              >
                Editar
              </Button>
              <Button
                size="xs"
                variant="secondary"
                onClick={() => removerUsuario(u.id)}
              >
                Remover
              </Button>
            </td>
          </tr>
        ))}
      </Table>

      {isOpen && (
        <Modal onClose={() => {
          setEditando(null);
          setSenhaNova('');
          closeModal();
        }}>
          {editando ? (
            senhaNova ? (
              <form onSubmit={handleAlterarSenha} className="space-y-2">
                <h3 className="font-bold">Alterar Senha</h3>
                <Input
                  type="password"
                  placeholder="Nova Senha"
                  value={senhaNova}
                  onChange={(e) => setSenhaNova(e.target.value)}
                  required
                />
                <Button type="submit" variant="primary">
                  Salvar Senha
                </Button>
              </form>
            ) : (
              <form onSubmit={handleEditar} className="space-y-2">
                <h3 className="font-bold">Editar Usuário</h3>
                <Input
                  label="Nome"
                  value={editando.nome}
                  onChange={(e) =>
                    setEditando({ ...editando, nome: e.target.value })
                  }
                  required
                />
                <Input
                  label="Email"
                  value={editando.email}
                  onChange={(e) =>
                    setEditando({ ...editando, email: e.target.value })
                  }
                  required
                />
                <div>
                  <label className="block text-sm">Perfil</label>
                  <select
                    value={editando.role}
                    onChange={(e) =>
                      setEditando({
                        ...editando,
                        role: e.target.value as Role,
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
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setSenhaNova('iniciando')}
                >
                  Alterar Senha
                </Button>
                <Button type="submit" variant="primary">
                  Salvar Alterações
                </Button>
              </form>
            )
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2">
              <h3 className="font-bold">Novo Usuário</h3>
              <Input
                label="Nome"
                value={novo.nome}
                onChange={(e) =>
                  setNovo({ ...novo, nome: e.target.value })
                }
                required
              />
              <Input
                label="Email"
                value={novo.email}
                onChange={(e) =>
                  setNovo({ ...novo, email: e.target.value })
                }
                required
              />
              <Input
                label="Senha"
                type="password"
                value={novo.senha}
                onChange={(e) =>
                  setNovo({ ...novo, senha: e.target.value })
                }
                required
              />
              <div>
                <label className="block text-sm">Perfil</label>
                <select
                  value={novo.role}
                  onChange={(e) =>
                    setNovo({
                      ...novo,
                      role: e.target.value as Role,
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
              <Button type="submit" variant="primary">
                Criar Usuário
              </Button>
            </form>
          )}
          {erro && <p className="text-red-500">{erro}</p>}
        </Modal>
      )}
    </div>
  );
}
