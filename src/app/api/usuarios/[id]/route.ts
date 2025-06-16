import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
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
    return NextResponse.json({ sucesso: false, erro: 'Erro ao excluir' }, { status: 500 });
  }
}
