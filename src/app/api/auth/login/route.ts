import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const { email, senha } = await request.json();

  const usuario = await prisma.usuario.findUnique({ where: { email } });

  if (!usuario || !(await bcrypt.compare(senha, usuario.senhaHash))) {
    return NextResponse.json({ error: 'Credenciais inválidas.' }, { status: 401 });
  }

  const token = jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      role: usuario.role,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: '1d' }
  );

  return NextResponse.json({ token });
}
