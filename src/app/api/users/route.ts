import { NextRequest, NextResponse } from 'next/server';
import { getUsuarios, addUsuario, ensureAdmin, senhaForte, findByEmail } from '@/lib/serverUsuarios';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET: Lista de usuários
export async function GET() {
  await ensureAdmin();

  // Recupera usuários direto do banco via Prisma
  const usuarios = await prisma.usuario.findMany({
    select: {
      id: true,
      nome: true,
      email: true,
      role: true,
      createdAt: true
    }
  });

  return NextResponse.json(usuarios);
}

// POST: Criação de novo usuário
export async function POST(req: NextRequest) {
  await ensureAdmin();

  const { nome, email, senha, role } = await req.json();

  if (await findByEmail(email)) {
    return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 });
  }

  if (!senhaForte(senha)) {
    return NextResponse.json({ error: 'Senha fraca' }, { status: 400 });
  }

  const user = await addUsuario({ nome, email, senha, role });

  return NextResponse.json({
    id: user.id,
    nome: user.nome,
    email: user.email,
    role: user.role
  });
}
