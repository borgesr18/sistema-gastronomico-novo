'use server';

import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export type Role = 'admin' | 'editor' | 'viewer' | 'manager';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senhaHash: string;
  role: Role;
  oculto?: boolean;
}

// Função para gerar o hash da senha
const hashSenha = (senha: string) =>
  crypto.createHash('sha256').update(senha).digest('hex');

// Função para validar força da senha
const senhaForte = (senha: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(senha);

export const useUsuarios = () => {
  // Listar todos os usuários visíveis
  const listarUsuarios = async () => {
    return await prisma.usuario.findMany({
      where: { oculto: false },
      orderBy: { createdAt: 'desc' },
    });
  };

  // Criar novo usuário
  const criarUsuario = async (novo: { nome: string; email: string; senha: string; role?: Role }) => {
    if (!senhaForte(novo.senha)) {
      throw new Error('Senha fraca: precisa ter maiúscula, minúscula, número e símbolo');
    }

    const existente = await prisma.usuario.findUnique({
      where: { email: novo.email },
    });

    if (existente) {
      throw new Error('Email já cadastrado');
    }

    const senhaHash = hashSenha(novo.senha);

    const user = await prisma.usuario.create({
      data: {
        nome: novo.nome,
        email: novo.email,
        senhaHash,
        role: novo.role ?? 'viewer',
      },
    });

    return user;
  };

  // Editar usuário
  const editarUsuario = async (id: string, dados: { nome: string; email: string; role: Role }) => {
    const existente = await prisma.usuario.findFirst({
      where: {
        email: dados.email,
        NOT: { id },
      },
    });

    if (existente) {
      throw new Error('Email já cadastrado');
    }

    return await prisma.usuario.update({
      where: { id },
      data: {
        nome: dados.nome,
        email: dados.email,
        role: dados.role,
      },
    });
  };

  // Alterar senha
  const alterarSenha = async (id: string, novaSenha: string) => {
    if (!senhaForte(novaSenha)) {
      throw new Error('Senha fraca');
    }

    const senhaHash = hashSenha(novaSenha);

    return await prisma.usuario.update({
      where: { id },
      data: { senhaHash },
    });
  };

  // Remover usuário
  const removerUsuario = async (id: string) => {
    return await prisma.usuario.delete({
      where: { id },
    });
  };

  // Login
  const login = async (email: string, senha: string) => {
    const senhaHash = hashSenha(senha);

    const usuario = await prisma.usuario.findFirst({
      where: {
        email,
        senhaHash,
      },
    });

    return usuario;
  };

  return {
    listarUsuarios,
    criarUsuario,
    editarUsuario,
    alterarSenha,
    removerUsuario,
    login,
  };
};
