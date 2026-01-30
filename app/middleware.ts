import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value;
  const { pathname } = request.nextUrl;

  // Rutas públicas
  const publicPaths = ['/login', '/signup'];
  const isPublicPath = publicPaths.includes(pathname);

  // Si NO tiene token y trata de acceder a ruta privada → redirige a login
  if (!token && !isPublicPath) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Si SÍ tiene token y está en ruta pública (login/signup) → redirige al dashboard
  if (token && isPublicPath) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// Configura el middleware para que se ejecute en las rutas que necesitas
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
};
