import { NextRequest, NextResponse } from 'next/server'
import { getUsuarios, addUsuario, senhaForte, ensureAdmin, findByEmail } from '@/lib/serverUsuarios'
import { hashSenha } from '@/lib/cryptoUtils'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  await ensureAdmin()
  const { nome, email, senha } = await req.json()
  if (await findByEmail(email)) {
    return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 })
  }
  if (!senhaForte(senha)) {
    return NextResponse.json({ error: 'Senha fraca' }, { status: 400 })
  }
  const novo = await addUsuario({ nome, email, senha, role: 'viewer' })
  return NextResponse.json({ id: novo.id, nome: novo.nome, email: novo.email, role: novo.role })
}
