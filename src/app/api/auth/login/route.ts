export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const { email, senha } = await req.json();

  const usuario = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!usuario || !(await bcrypt.compare(senha, usuario.senhaHash))) {
    return NextResponse.json({ message: 'Credenciais inválidas.' }, { status: 401 });
  }

  const token = jwt.sign(
    {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );

  const response = NextResponse.json({ token });

  response.cookies.set('token', token, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  });

  return response;
}
