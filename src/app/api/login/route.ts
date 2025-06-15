import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
  const { email, senha } = await request.json();

  const senhaHash = crypto.createHash('sha256').update(senha).digest('hex');

  const usuario = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!usuario) {
    return NextResponse.json({ sucesso: false, mensagem: 'Usuário não encontrado' }, { status: 401 });
  }

  if (usuario.senhaHash !== senhaHash) {
    return NextResponse.json({ sucesso: false, mensagem: 'Senha incorreta' }, { status: 401 });
  }

  // Opcional: Você pode devolver só os campos que quiser
  return NextResponse.json({
    sucesso: true,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role,
    },
  });
}
