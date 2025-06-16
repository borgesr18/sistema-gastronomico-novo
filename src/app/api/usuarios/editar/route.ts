import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    const { id, nome, email, role } = await request.json();

    const usuario = await prisma.usuario.update({
      where: { id },
      data: {
        nome,
        email,
        role,
      },
    });

    return NextResponse.json(usuario);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
