import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { Usuario } from '@prisma/client';
import jwt from 'jsonwebtoken';

export async function getUsuarioAtual(): Promise<Usuario | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id },
    });
    return usuario;
  } catch (error) {
    console.error('Erro ao verificar o token:', error);
    return null;
  }
}
