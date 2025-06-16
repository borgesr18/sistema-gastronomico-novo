import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID do usuário não fornecido' }, { status: 400 });
    }

    const body = await request.json();
    const { novaSenha } = body;

    if (!novaSenha) {
      return NextResponse.json({ error: 'Nova senha não fornecida' }, { status: 400 });
    }

    // Hash da nova senha
    const senhaHash = crypto.createHash('sha256').update(novaSenha).digest('hex');

    // Atualiza no banco
    await prisma.usuario.update({
      where: { id },
      data: { senhaHash },
    });

    return NextResponse.json({ message: 'Senha atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    return NextResponse.json({ error: 'Erro ao alterar senha' }, { status: 500 });
  }
}
