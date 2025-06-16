import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { nome, email, senha, role } = await request.json();

    const senhaHash = crypto.createHash('sha256').update(senha).digest('hex');

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senhaHash,
        role: role ?? 'viewer',
      },
    });

    return NextResponse.json(usuario);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
