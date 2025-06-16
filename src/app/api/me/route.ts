import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJwt } from '@/lib/jwt';
import { cookies } from 'next/headers'; // <-- Importa o helper correto

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  const decoded = await verifyJwt(token);

  if (!decoded) {
    return NextResponse.json({ user: null });
  }

  const user = await prisma.usuario.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      nome: true,
      email: true,
      role: true,
    },
  });

  return NextResponse.json({ user });
}
