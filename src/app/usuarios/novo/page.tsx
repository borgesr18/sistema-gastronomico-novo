'use client';

import React, { useState } from 'react';
import { useUsuarios } from '@/lib/useUsuarios';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Role } from '@prisma/client';  // IMPORTANTE: importa o tipo Role

export default function NovoUsuarioPage() {
  const router = useRouter();
  const { criarUsuario, erro, loading } = useUsuarios();

  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    role: 'viewer',  // valor inicial válido
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const criado = await criarUsuario({
      ...form,
      role: form.role as Role,  // Aqui convertemos explicitamente
    });
    if (criado) {
      router.push('/login');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-xl font-bold">Criar Novo Usuário</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          label="Nome"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          required
        />
        <Input
          label="Email"
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
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="border rounded w-full p-2"
          >
            <option value="viewer">Visualizador</option>
            <option value="editor">Editor</option>
            <option value="manager">Gerente</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Criando...' : 'Criar Usuário'}
        </Button>
      </form>
      {erro && <p className="text-red-600 text-sm">{erro}</p>}
    </div>
  );
}
