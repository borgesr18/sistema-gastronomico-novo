'use client';

import { useState, useEffect } from 'react';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer' | 'manager';
  createdAt: string;
}

export const useUsuariosApi = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarUsuarios = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/usuarios');
      if (!res.ok) throw new Error('Erro ao carregar usuários');
      const data = await res.json();
      setUsuarios(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const criarUsuario = async (dados: {
    nome: string;
    email: string;
    senha: string;
    role?: 'admin' | 'editor' | 'viewer' | 'manager';
  }) => {
    try {
      const res = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });

      if (!res.ok) throw new Error('Erro ao criar usuário');
      const novo = await res.json();
      setUsuarios((prev) => [...prev, novo]);
      return novo;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const atualizarUsuario = async (id: string, dados: Partial<Omit<Usuario, 'id' | 'createdAt'>>) => {
    try {
      const res = await fetch(`/api/usuarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });

      if (!res.ok) throw new Error('Erro ao atualizar usuário');
      const atualizado = await res.json();
      setUsuarios((prev) => prev.map((u) => (u.id === id ? atualizado : u)));
      return atualizado;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const excluirUsuario = async (id: string) => {
    try {
      const res = await fetch(`/api/usuarios/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Erro ao excluir usuário');
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return {
    usuarios,
    loading,
    error,
    carregarUsuarios,
    criarUsuario,
    atualizarUsuario,
    excluirUsuario,
  };
};
