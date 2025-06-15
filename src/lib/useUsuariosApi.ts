'use client';

import { useState, useEffect } from 'react';

// Definindo o tipo de usuário
export type Usuario = {
  id: string;
  nome: string;
  email: string;
  senha?: string;
  role: 'admin' | 'editor' | 'viewer' | 'manager';
};

export function useUsuariosApi() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  // Simulação de API: Busca inicial de usuários
  const listarUsuarios = async () => {
    setLoading(true);
    try {
      // Substitua por sua API real
      const res = await fetch('/api/usuarios');
      const data = await res.json();
      setUsuarios(data);
    } catch (error) {
      console.error('Erro ao listar usuários', error);
      setErro('Erro ao carregar usuários.');
    } finally {
      setLoading(false);
    }
  };

  // Criar usuário
  const criarUsuario = async (novo: {
    nome: string;
    email: string;
    senha: string;
    role?: 'admin' | 'editor' | 'viewer' | 'manager';
  }) => {
    try {
      const res = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novo),
      });

      if (!res.ok) {
        setErro('Erro ao criar usuário.');
        return null;
      }

      const criado = await res.json();
      setUsuarios([...usuarios, criado]);
      return criado;
    } catch (error) {
      console.error('Erro ao criar usuário', error);
      setErro('Erro ao criar usuário.');
      return null;
    }
  };

  // Remover usuário
  const removerUsuario = async (id: string) => {
    try {
      await fetch(`/api/usuarios/${id}`, { method: 'DELETE' });
      setUsuarios(usuarios.filter((u) => u.id !== id));
    } catch (error) {
      console.error('Erro ao remover usuário', error);
      setErro('Erro ao remover usuário.');
    }
  };

  // Alterar senha
  const alterarSenha = async (id: string, novaSenha: string) => {
    try {
      await fetch(`/api/usuarios/${id}/senha`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha: novaSenha }),
      });
    } catch (error) {
      console.error('Erro ao alterar senha', error);
      setErro('Erro ao alterar senha.');
    }
  };

  // Editar usuário
  const editarUsuario = async (id: string, dados: Partial<Omit<Usuario, 'id'>>) => {
    try {
      await fetch(`/api/usuarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });
      setUsuarios(usuarios.map((u) => (u.id === id ? { ...u, ...dados } : u)));
    } catch (error) {
      console.error('Erro ao editar usuário', error);
      setErro('Erro ao editar usuário.');
    }
  };

  useEffect(() => {
    listarUsuarios();
  }, []);

  return {
    usuarios,
    listarUsuarios,
    criarUsuario,
    removerUsuario,
    alterarSenha,
    editarUsuario,
    erro,
    loading,
  };
}
