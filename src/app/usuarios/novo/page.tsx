'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useUsuarios, Usuario } from '@/lib/useUsuarios';

export default function NovoUsuarioPage() {
  const router = useRouter();
  const { criarUsuario, erro, loading } = useUsuariosApi();

  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    role: 'viewer' as 'admin' | 'editor' | 'viewer' | 'manager',
  });

  const [sucesso, setSucesso] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const criado = await criarUsuario(form);
    if (criado) {
      setSucesso('Usuário criado com sucesso!');
      setForm({ nome: '', email: '', senha: '', role: 'viewer' });
      router.push('/login');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Novo Usuário</h1>

      {erro && <p className="text-sm text-red-600">{erro}</p>}
      {sucesso && <p className="text-sm text-green-600">{sucesso}</p>}

      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          label="Nome"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          required
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <Input
          label="Senha"
          type="password"
          value={form.senha}
          onChange={(e) => setForm({ ...form, senha: e.target.value })}
          required
        />
        <div>
          <label className="block text-sm mb-1">Perfil</label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as any })}
            className="border rounded w-full p-2"
          >
            <option value="viewer">Visualizador</option>
            <option value="editor">Editor</option>
            <option value="manager">Gerente</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </form>
    </div>
  );
}
