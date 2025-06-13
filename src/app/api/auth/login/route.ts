import { NextRequest, NextResponse } from 'next/server';
import { getUsuarios, hashSenha } from '@/lib/serverUsuarios';

export async function POST(req: NextRequest) {
  const { email, senha } = await req.json();
  const user = getUsuarios().find(u => u.email === email && u.senhaHash === hashSenha(senha));
  if (!user) {
    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
  }
  return NextResponse.json({ id: user.id, nome: user.nome, email: user.email, role: user.role });
}
