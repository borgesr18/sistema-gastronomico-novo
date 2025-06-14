import { NextRequest, NextResponse } from 'next/server'
import { getUsuarios, addUsuario, ensureAdmin, senhaForte, findByEmail } from '@/lib/serverUsuarios'

export const dynamic = 'force-dynamic'

export async function GET() {
  await ensureAdmin()
  const list = await getUsuarios()
  return NextResponse.json(list.map(u => ({ id: u.id, nome: u.nome, email: u.email, role: u.role })))
}

export async function POST(req: NextRequest) {
  await ensureAdmin()
  const { nome, email, senha, role } = await req.json()
  if (await findByEmail(email)) {
    return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 })
  }
  if (!senhaForte(senha)) {
    return NextResponse.json({ error: 'Senha fraca' }, { status: 400 })
  }
  const user = await addUsuario({ nome, email, senha, role })
  return NextResponse.json({ id: user.id, nome: user.nome, email: user.email, role: user.role })
}
