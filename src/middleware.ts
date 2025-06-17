import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const PUBLIC_ROUTES = ['/login', '/api/auth/login', '/api/auth/register', '/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir acesso livre às rotas públicas
  if (PUBLIC_ROUTES.includes(pathname) || pathname.startsWith('/_next') || pathname.startsWith('/static')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET as string);
    return NextResponse.next();
  } catch (error) {
    console.error('Token inválido:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/api/(.*)', '/configuracoes/:path*', '/estoque/:path*', '/fichas-tecnicas/:path*', '/producao/:path*', '/relatorios/:path*'],
};
