import { NextResponse } from 'next/server';
import { getUsuarios } from '@/lib/serverUsuarios';

export async function GET() {
  const list = getUsuarios().map(u => ({ id: u.id, nome: u.nome, email: u.email, role: u.role }));
  return NextResponse.json(list);
}
