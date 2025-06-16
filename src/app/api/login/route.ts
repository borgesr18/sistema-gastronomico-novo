import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { SignJWT } from 'jose';

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || 'chave_secreta_forte');

async function generateJWT(userId: string) {
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secretKey);
}

export async function POST(request: Request) {
  const { email, senha } = await request.json();

  const senhaHash = crypto.createHash('sha256').update(senha).digest('hex');

  const usuario = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!usuario || usuario.senhaHash !== senhaHash) {
    return NextResponse.json({ sucesso: false, mensagem: 'Credenciais inválidas' }, { status: 401 });
  }

  const token = await generateJWT(usuario.id);

  const response = NextResponse.json({
    sucesso: true,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role,
    },
  });

  response.cookies.set('token', token, {
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  });

  return response;
}
