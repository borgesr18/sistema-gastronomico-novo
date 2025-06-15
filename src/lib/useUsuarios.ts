'use client';

import { useState, useEffect } from 'react';
import { prisma } from './prisma';
import { hashSenha } from './cryptoUtils';

export type Role = 'admin' | 'editor' | 'viewer' | 'manager';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senhaHash: string;
  role: Role;
  oculto?: boolean;
}

const ADMIN_EMAIL = 'rba1807@gmail.com';
const ADMIN_NOME = 'Admin';
const ADMIN_SENHA = 'Rb180780@';

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioAtual, setUsuarioAtual] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const ensureAdmin = async () => {
    const admin = await prisma.usuario.findUnique({ where: { email: ADMIN_EMAIL } });
    if (!admin) {
      await prisma.usuario.create({
        data: {
          nome: ADMIN_NOME,
          email: ADMIN_EMAIL,
          senhaHash: hashSenha(ADMIN_SENHA),
          role: 'admin',
          oculto: true,
        },
      });
    }
  };

  const listarUsuarios = async () => {
    setLoading(true);
    try {
      await ensureAdmin();
      const lista = await prisma.usuario.findMany({ where: { oculto: false } });
      setUsuarios(lista);
    } catch (error) {
      setErro('Erro ao listar usuários');
    } finally {
      setLoading(false);
    }
  };

  const criarUsuario = async (dados: { nome: string; email: string; senha: string; role?: Role }) => {
    setLoading(true);
    try {
      const existe = await prisma.usuario.findUnique({ where: { email: dados.email } });
      if (existe) {
        setErro('Email já cadastrado');
        return null;
      }

      const novo = await prisma.usuario.create({
        data: {
          nome: dados.nome,
          email: dados.email,
          senhaHash: hashSenha(dados.senha),
          role: dados.role ?? 'viewer',
        },
      });
      await listarUsuarios();
      return novo;
    } catch {
      setErro('Erro ao criar usuário');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const editarUsuario = async (
    id: string,
    dados: { nome: string; email: string; role: Role }
  ) => {
    setLoading(true);
    try {
      const existe = await prisma.usuario.findFirst({
        where: {
          email: dados.email,
          NOT: { id },
        },
      });
      if (existe) {
        setErro('Email já está sendo usado por outro usuário');
        return false;
      }

      await prisma.usuario.update({
        where: { id },
        data: {
          nome: dados.nome,
          email: dados.email,
          role: dados.role,
        },
      });

      await listarUsuarios();
      return true;
    } catch {
      setErro('Erro ao editar usuário');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removerUsuario = async (id: string) => {
    setLoading(true);
    try {
      await prisma.usuario.delete({ where: { id } });
      await listarUsuarios();
    } catch {
      setErro('Erro ao remover usuário');
    } finally {
      setLoading(false);
    }
  };

  const alterarSenha = async (id: string, novaSenha: string) => {
    setLoading(true);
    try {
      await prisma.usuario.update({
        where: { id },
        data: { senhaHash: hashSenha(novaSenha) },
      });
      await listarUsuarios();
    } catch {
      setErro('Erro ao alterar senha');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, senha: string) => {
    setLoading(true);
    try {
      await ensureAdmin();
      const usuario = await prisma.usuario.findUnique({ where: { email } });
      if (usuario && usuario.senhaHash === hashSenha(senha)) {
        setUsuarioAtual(usuario);
        return usuario;
      } else {
        setErro('Credenciais inválidas');
        return null;
      }
    } catch {
      setErro('Erro ao fazer login');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUsuarioAtual(null);
  };

  useEffect(() => {
    listarUsuarios();
  }, []);

  return {
    usuarios,
    usuarioAtual,
    loading,
    erro,
    listarUsuarios,
    criarUsuario,
    editarUsuario,
    removerUsuario,
    alterarSenha,
    login,
    logout,
  };
};
