'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useUsuarios } from '@/lib/usuariosService';

export default function NovoUsuarioPage() {
  const router = useRouter();
  const { registrarUsuario } = useUsuarios();
  const [form, setForm] = useState({ nome: '', email: '', senha: '', confirmarSenha: '' });
  const [erro, setErro] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.senha !== form.confirmarSenha) {
      setErro('Senhas não conferem');
      return;
    }
    registrarUsuario({ nome: form.nome, email: form.email, senha: form.senha, role: 'viewer' });
    registrarUsuario({ nome: form.nome, email: form.email, senha: form.senha });
    router.push('/login');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-96">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-xl font-bold text-gray-800">Novo Usuário</h1>
          {erro && <p className="text-sm text-red-600">{erro}</p>}
          <Input label="Nome" name="nome" value={form.nome} onChange={handleChange} required />
          <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} required />
          <Input label="Senha" type="password" name="senha" value={form.senha} onChange={handleChange} required />
          <Input label="Confirmar Senha" type="password" name="confirmarSenha" value={form.confirmarSenha} onChange={handleChange} required />
          <Button type="submit" variant="primary" fullWidth>Cadastrar</Button>
        </form>
      </Card>
    </div>
  );
}
