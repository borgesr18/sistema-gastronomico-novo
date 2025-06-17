import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const { nome, email, senha } = await request.json();

  const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
  if (usuarioExistente) {
    return NextResponse.json({ error: 'Email já cadastrado.' }, { status: 400 });
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  await prisma.usuario.create({
    data: {
      nome,
      email,
      senhaHash,
      role: 'admin',  // Ou outro role que preferir
    },
  });

  return NextResponse.json({ message: 'Usuário criado com sucesso.' });
}
