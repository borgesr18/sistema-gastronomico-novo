import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashSenha } from '@/lib/cryptoUtils';

export async function POST(req: NextRequest) {
  const { email, senha } = await req.json();

  if (!email || !senha) {
    return NextResponse.json({ error: 'Email e senha obrigatórios' }, { status: 400 });
  }

  const user = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
  }

  const senhaHash = hashSenha(senha);

  if (user.senhaHash !== senhaHash) {
    return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
  }

  // Retornar os dados básicos do usuário (sem a senha)
  return NextResponse.json({
    id: user.id,
    nome: user.nome,
    email: user.email,
    role: user.role,
  });
}
