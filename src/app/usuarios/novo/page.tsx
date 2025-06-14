'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useUsuarios } from '@/lib/usuariosService';
import { useEffect } from 'react';
import Logo from '@/components/ui/Logo';

export default function NovoUsuarioPage() {
  const router = useRouter();
  const { registrarUsuario, usuarioAtual } = useUsuarios();
  const [form, setForm] = useState({ nome: '', email: '', confirmarEmail: '', senha: '', confirmarSenha: '' });
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!usuarioAtual || usuarioAtual.role !== 'admin') {
      router.replace('/login');
    }
  }, [usuarioAtual, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.email !== form.confirmarEmail) {
      setErro('Emails não conferem');
      return;
    }
    if (form.senha !== form.confirmarSenha) {
      setErro('Senhas não conferem');
      return;
    }
    const criado = await registrarUsuario({ nome: form.nome, email: form.email, senha: form.senha });
    if (!criado) {
      setErro('Email já cadastrado ou senha fraca');
      return;
    }
    router.push('/login');
  };

  if (!usuarioAtual || usuarioAtual.role !== 'admin') return null;

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-96">
        <div className="flex justify-center mb-4">
          <Logo className="text-2xl" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-xl font-bold text-gray-800">Novo Usuário</h1>
          {erro && <p className="text-sm text-red-600">{erro}</p>}
          <Input label="Nome" name="nome" value={form.nome} onChange={handleChange} required />
          <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} required />
          <Input label="Confirmar Email" type="email" name="confirmarEmail" value={form.confirmarEmail} onChange={handleChange} required />
          <Input label="Senha" type="password" name="senha" value={form.senha} onChange={handleChange} required />
          <p className="text-xs text-gray-600">
            A senha deve ter ao menos 8 caracteres, incluindo letras maiúsculas,
            minúsculas, números e símbolos.
          </p>
          <Input label="Confirmar Senha" type="password" name="confirmarSenha" value={form.confirmarSenha} onChange={handleChange} required />
          <Button type="submit" variant="primary" fullWidth>Cadastrar</Button>
        </form>
      </Card>
    </div>
  );
}
