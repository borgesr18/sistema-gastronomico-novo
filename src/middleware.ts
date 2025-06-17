import { NextResponse, NextRequest } from 'next/server';

// Defina aqui as rotas que precisam de login
const rotasProtegidas = [
  '/configuracoes',
  '/estoque',
  '/fichas-tecnicas',
  '/producao',
  '/relatorios',
];

export function middleware(request: NextRequest) {
  const userId = request.cookies.get('userId')?.value;

  // Verificar se a rota acessada está entre as protegidas
  const isProtectedRoute = rotasProtegidas.some((path) => request.nextUrl.pathname.startsWith(path));

  if (isProtectedRoute && !userId) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Aplica o middleware só nas rotas que interessam
export const config = {
  matcher: ['/configuracoes/:path*', '/estoque/:path*', '/fichas-tecnicas/:path*', '/producao/:path*', '/relatorios/:path*'],
};
