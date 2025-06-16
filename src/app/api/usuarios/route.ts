import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
  const { nome, email, role } = await request.json();

  const senhaPadrao = '123456';
  const senhaHash = crypto.createHash('sha256').update(senhaPadrao).digest('hex');

  try {
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        role,
        senhaHash,
      },
    });

    return NextResponse.json({ sucesso: true, usuario: novoUsuario });
  } catch (error) {
    return NextResponse.json({ sucesso: false, mensagem: 'Erro ao criar usuário.' }, { status: 500 });
  }
}
