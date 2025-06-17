'use server';

import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { Usuario } from '@prisma/client';

// Busca o usuário atualmente autenticado (Exemplo usando cookie 'userId' como base)
export async function getUsuarioAtualAPI(): Promise<Usuario | null> {
  const cookieStore = cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) {
    return null;
  }

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
    });
    return usuario;
  } catch (error) {
    console.error('Erro ao buscar usuário atual:', error);
    return null;
  }
}

// Faz logout (Exemplo simples: remove cookie de sessão)
export async function logoutAPI(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete('userId');
}
