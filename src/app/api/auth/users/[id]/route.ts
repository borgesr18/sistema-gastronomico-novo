import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashSenha } from '@/lib/cryptoUtils';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await prisma.usuario.findUnique({
    where: { id: params.id },
  });

  if (!user) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();

  try {
    const atualizado = await prisma.usuario.update({
      where: { id: params.id },
      data: {
        nome: data.nome,
        email: data.email,
        role: data.role,
      },
    });

    return NextResponse.json(atualizado);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.usuario.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir usuário' }, { status: 500 });
  }
}
