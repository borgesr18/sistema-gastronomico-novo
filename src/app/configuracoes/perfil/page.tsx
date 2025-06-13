'use client';

import { useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import { useUsuarios } from '@/lib/usuariosService';

export default function PerfilPage() {
  const { usuarioAtual, alterarSenha, editarUsuario } = useUsuarios();
  const [perfilForm, setPerfilForm] = useState({ nome: '', email: '', role: 'viewer' as 'admin' | 'editor' | 'viewer' | 'manager' });
    nome: '',
    email: '',
    role: 'viewer' as 'admin' | 'editor' | 'viewer',
  });
  const [senhaForm, setSenhaForm] = useState({ senha: '', confirmar: '' });
  const [erro, setErro] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (usuarioAtual) {
      setPerfilForm({
        nome: usuarioAtual.nome,
        email: usuarioAtual.email,
        role: usuarioAtual.role,
      });
    }
  }, [usuarioAtual]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  if (!usuarioAtual) return <p className="p-4">Nenhum usuário logado.</p>;

  const handlePerfil = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = editarUsuario(usuarioAtual.id, perfilForm);
    if (ok) {
      setToast('Perfil atualizado');
    } else {
      setErro('Email já cadastrado');
    }
  };

            onChange={e =>
              setPerfilForm({ ...perfilForm, role: e.target.value as 'admin' | 'editor' | 'viewer' | 'manager' })
            }
            <option value="manager">Gerente</option>
    e.preventDefault();
    if (senhaForm.senha !== senhaForm.confirmar) {
      setErro('Senhas não conferem');
      return;
    }
    alterarSenha(usuarioAtual.id, senhaForm.senha);
    setSenhaForm({ senha: '', confirmar: '' });
    setErro('');
    setToast('Senha alterada');
  };

  return (
    <div className="space-y-4">
      <Toast message={toast} onClose={() => setToast('')} />
      <h1 className="text-2xl font-bold text-gray-800">Perfil</h1>

      <form onSubmit={handlePerfil} className="space-y-2 max-w-sm">
        <Input
          label="Nome"
          value={perfilForm.nome}
          onChange={e => setPerfilForm({ ...perfilForm, nome: e.target.value })}
          required
        />
        <Input
          label="Email"
          type="email"
          value={perfilForm.email}
          onChange={e => setPerfilForm({ ...perfilForm, email: e.target.value })}
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Perfil</label>
          <select
            value={perfilForm.role}
            onChange={e => setPerfilForm({ ...perfilForm, role: e.target.value as 'admin' | 'editor' | 'viewer' })}
            className="border border-[var(--cor-borda)] rounded-md p-2 w-full"
          >
            <option value="viewer">Visualizador</option>
            <option value="editor">Editor</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        {erro && <p className="text-sm text-red-600">{erro}</p>}
        <Button type="submit" variant="primary">Salvar Perfil</Button>
      </form>

      <form onSubmit={handleSenha} className="space-y-2 max-w-sm">
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
          value={senhaForm.confirmar}
          onChange={e => setSenhaForm({ ...senhaForm, confirmar: e.target.value })}
          required
        />
        <Button type="submit" variant="primary">Alterar Senha</Button>
      </form>
    </div>
  );
}
