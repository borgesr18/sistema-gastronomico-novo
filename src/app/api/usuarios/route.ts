import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({ usuarios });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { nome, email, senha, role } = await request.json();

    const senhaHash = crypto.createHash('sha256').update(senha).digest('hex');

    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senhaHash,
        role,
      },
    });

    return NextResponse.json({ sucesso: true, usuario: novoUsuario });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return NextResponse.json({ sucesso: false, erro: 'Erro ao criar usuário' }, { status: 500 });
  }
}
