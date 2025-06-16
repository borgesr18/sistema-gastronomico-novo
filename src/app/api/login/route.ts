import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { signJwt } from '@/lib/jwt';

export async function POST(request: Request) {
  const { email, senha } = await request.json();

  const senhaHash = crypto.createHash('sha256').update(senha).digest('hex');

  const usuario = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!usuario) {
    return NextResponse.json(
      { sucesso: false, mensagem: 'Usuário não encontrado' },
      { status: 401 }
    );
  }

  if (usuario.senhaHash !== senhaHash) {
    return NextResponse.json(
      { sucesso: false, mensagem: 'Senha incorreta' },
      { status: 401 }
    );
  }

  const token = await signJwt({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    role: usuario.role,
  });

  const response = NextResponse.json({
    sucesso: true,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role,
    },
  });

  // Salvar o token como cookie HttpOnly
  response.cookies.set('token', token, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  });

  return response;
}

