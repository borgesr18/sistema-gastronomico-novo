import { NextResponse } from 'next/server';
import { getJwtUser } from '@/lib/jwt';

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie');

  if (!cookieHeader) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const token = cookieHeader
    .split(';')
    .find((c) => c.trim().startsWith('token='))
    ?.split('=')[1];

  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const user = await getJwtUser(token);

  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json({ user }, { status: 200 });
}
