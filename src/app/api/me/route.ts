import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || 'chave_secreta_forte');

async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as { userId: string };
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  const payload = await verifyJWT(token);

  if (!payload) {
    return NextResponse.json({ user: null });
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id: payload.userId },
    select: { id: true, nome: true, email: true, role: true },
  });

  return NextResponse.json({ user: usuario });
}
