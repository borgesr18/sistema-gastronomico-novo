import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashSenha } from '@/lib/cryptoUtils';

export async function GET() {
  const usuarios = await prisma.usuario.findMany();
  return NextResponse.json(usuarios);
}

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
