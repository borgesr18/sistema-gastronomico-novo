import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

interface Params {
  params: { id: string };
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = params;

  try {
    const { nome, email, senha, role } = await request.json();

    const updateData: any = { nome, email, role };

    if (senha) {
      updateData.senhaHash = crypto.createHash('sha256').update(senha).digest('hex');
    }

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ sucesso: true, usuario: usuarioAtualizado });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return NextResponse.json({ sucesso: false, erro: 'Erro ao atualizar usuário' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const { id } = params;

  try {
    await prisma.usuario.delete({
      where: { id },
    });

    return NextResponse.json({ sucesso: true });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    return NextResponse.json({ sucesso: false, erro: 'Erro ao excluir usuário' }, { status: 500 });
  }
}
