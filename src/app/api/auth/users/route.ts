import { NextResponse } from 'next/server'
import { getUsuarios, ensureAdmin } from '@/lib/serverUsuarios'

export const dynamic = 'force-dynamic'

export async function GET() {
  await ensureAdmin()
  const list = await getUsuarios()
  return NextResponse.json(list.map(u => ({ id: u.id, nome: u.nome, email: u.email, role: u.role })))
}
