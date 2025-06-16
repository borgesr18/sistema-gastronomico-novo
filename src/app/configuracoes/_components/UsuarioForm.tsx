'use client';

import React, { useState, FormEvent } from 'react';

interface Props {
  usuario?: {
    id: string;
    nome: string;
    email: string;
    role: string;
  };
  onSuccess: () => void;
}

export default function UsuarioForm({ usuario, onSuccess }: Props) {
  const [nome, setNome] = useState(usuario?.nome || '');
  const [email, setEmail] = useState(usuario?.email || '');
  const [role, setRole] = useState(usuario?.role || 'viewer');
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);

    try {
      const res = await fetch(usuario ? `/api/usuarios/${usuario.id}` : '/api/usuarios', {
        method: usuario ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.mensagem || 'Erro ao salvar usuário');
      } else {
        onSuccess();
      }
    } catch (err) {
      setErro('Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {erro && <p className="text-red-500">{erro}</p>}

      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
        className="border p-2 w-full"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border p-2 w-full"
      />

      <select value={role} onChange={(e) => setRole(e.target.value)} className="border p-2 w-full">
        <option value="admin">Admin</option>
        <option value="editor">Editor</option>
        <option value="viewer">Viewer</option>
        <option value="manager">Manager</option>
      </select>

      <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
        {loading ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  );
}
