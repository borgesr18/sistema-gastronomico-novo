import { NextRequest, NextResponse } from 'next/server'
import { ensureAdmin, findByEmail } from '@/lib/serverUsuarios'
import { hashSenha } from '@/lib/cryptoUtils'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  await ensureAdmin()
  const { email, senha } = await req.json()
  const user = await findByEmail(email)
  if (!user || user.senhaHash !== hashSenha(senha)) {
    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
  }
  return NextResponse.json({
    id: user.id,
    nome: user.nome,
    email: user.email,
    role: user.role,
  })
}
