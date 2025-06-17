export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const { nome, email, senha, role } = await req.json();

  const existe = await prisma.usuario.findUnique({
    where: { email },
  });

  if (existe) {
    return NextResponse.json({ message: 'E-mail já cadastrado.' }, { status: 400 });
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  await prisma.usuario.create({
    data: {
      nome,
      email,
      senhaHash,
      role,
    },
  });

  return NextResponse.json({ message: 'Usuário cadastrado com sucesso.' });
}
