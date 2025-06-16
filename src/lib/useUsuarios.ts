'use client';

import { useState, useEffect } from 'react';

export type Role = 'admin' | 'editor' | 'viewer' | 'manager';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: Role;
  createdAt: string;
  oculto?: boolean;
}

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioAtual, setUsuarioAtual] = useState<Usuario | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Carregar lista de usuários
  const listarUsuarios = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/usuarios/listar');
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  // Criar novo usuário
  const criarUsuario = async (novo: { nome: string; email: string; senha: string; role?: Role }) => {
    setErro(null);
    try {
      const response = await fetch('/api/usuarios/criar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novo),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.error || 'Erro ao criar usuário');
        return null;
      }

      await listarUsuarios();
      return data;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      setErro('Erro inesperado');
      return null;
    }
  };

  // Editar usuário
  const editarUsuario = async (id: string, dados: { nome: string; email: string; role: Role }) => {
    try {
      const response = await fetch(`/api/usuarios/editar?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.error || 'Erro ao editar usuário');
        return false;
      }

      await listarUsuarios();
      return true;
    } catch (error) {
      console.error('Erro ao editar usuário:', error);
      setErro('Erro inesperado');
      return false;
    }
  };

  // Remover usuário
  const removerUsuario = async (id: string) => {
    try {
      const response = await fetch(`/api/usuarios/remover?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await listarUsuarios();
      } else {
        const data = await response.json();
        setErro(data.error || 'Erro ao remover usuário');
      }
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
    }
  };

  // Alterar senha
  const alterarSenha = async (id: string, novaSenha: string) => {
    try {
      const response = await fetch(`/api/usuarios/alterarSenha?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ novaSenha }),
      });

      if (!response.ok) {
        const data = await response.json();
        setErro(data.error || 'Erro ao alterar senha');
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
    }
  };

  // Login
  const login = async (email: string, senha: string) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        setUsuarioAtual(data.usuario);
        return data.usuario;
      } else {
        setErro(data.error || 'Credenciais inválidas');
        return null;
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setErro('Erro inesperado no login');
      return null;
    }
  };

  // Logout
  const logout = () => {
    setUsuarioAtual(null);
  };

  useEffect(() => {
    listarUsuarios();
  }, []);

  return {
    usuarios,
    listarUsuarios,
    criarUsuario,
    editarUsuario,
    removerUsuario,
    alterarSenha,
    login,
    logout,
    usuarioAtual,
    erro,
    loading,
  };
};
