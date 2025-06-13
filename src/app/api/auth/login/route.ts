import { NextRequest, NextResponse } from 'next/server';
import { getAllUsuarios, hashSenha, ensureAdmin } from '@/lib/serverUsuarios';

export async function POST(req: NextRequest) {
  ensureAdmin();  // <-- Adicionado aqui antes de validar o login

  const { email, senha } = await req.json();
  const user = getAllUsuarios().find(
    u => u.email === email && u.senhaHash === hashSenha(senha)
  );

  if (!user) {
    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
  }

  return NextResponse.json({
    id: user.id,
    nome: user.nome,
    email: user.email,
    role: user.role,
  });
}

