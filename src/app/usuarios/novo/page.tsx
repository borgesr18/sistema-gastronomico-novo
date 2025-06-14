'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useUsuariosApi } from '@/lib/useUsuariosApi';
import Card from '@/components/ui/Card';
import Logo from '@/components/ui/Logo';

export default function NovoUsuarioPage() {
  const router = useRouter();
  const { criarUsuario, erro, loading, usuarioAtual } = useUsuariosApi();

  const [form, setForm] = useState({
    nome: '',
    email: '',
    confirmarEmail: '',
    senha: '',
    confirmarSenha: '',
    role: 'viewer' as 'admin' | 'editor' | 'viewer' | 'manager',
  });

  const [erroLocal, setErroLocal] = useState('');
  const [sucesso, setSucesso] = useState('');

  useEffect(() => {
    if (!usuarioAtual || usuarioAtual.role !== 'admin') {
      router.replace('/login');
    }
  }, [usuarioAtual, router]);

  if (!usuarioAtual || usuarioAtual.role !== 'admin') return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (form.email !== form.confirmarEmail) {
      setErroLocal('Emails não conferem');
      return;
    }

    if (form.senha !== form.confirmarSenha) {
      setErroLocal('Senhas não conferem');
      return;
    }

    const res = await criarUsuario({
      nome: form.nome,
      email: form.email,
      senha: form.senha,
      role: form.role,
    });

    if (res) {
      setSucesso('Usuário criado com sucesso!');
      setErroLocal('');
      setForm({
        nome: '',
        email: '',
        confirmarEmail: '',
        senha: '',
        confirmarSenha: '',
        role: 'viewer',
      });
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <Card>
        <div className="flex justify-center mb-4">
          <Logo className="text-2xl" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-xl font-bold text-gray-800">Novo Usuário</h1>

          {erroLocal && <p className="text-sm text-red-600">{erroLocal}</p>}
          {erro && <p className="text-sm text-red-600">{erro}</p>}
          {sucesso && <p className="text-sm text-green-600">{sucesso}</p>}

          <Input label="Nome" name="nome" value={form.nome} onChange={handleChange} required />

          <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} required />
          <Input label="Confirmar Email" type="email" name="confirmarEmail" value={form.confirmarEmail} onChange={handleChange} required />

          <Input label="Senha" type="password" name="senha" value={form.senha} onChange={handleChange} required />
          <p className="text-xs text-gray-600">
            A senha deve ter ao menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos.
          </p>
          <Input label="Confirmar Senha" type="password" name="confirmarSenha" value={form.confirmarSenha} onChange={handleChange} required />

          <div>
            <label className="block text-sm mb-1">Perfil</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="border rounded w-full p-2"
            >
              <option value="viewer">Visualizador</option>
              <option value="editor">Editor</option>
              <option value="manager">Gerente</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? 'Salvando...' : 'Cadastrar'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
