import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuario) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    await prisma.usuario.delete({
      where: { id },
    });

    return NextResponse.json({ sucesso: true, mensagem: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro interno ao excluir usuário' },
      { status: 500 }
    );
  }
}

