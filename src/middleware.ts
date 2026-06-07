import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const DASHBOARD_PATHS = ['/dashboard'];
const AUTH_PATHS = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  const isDashboard = DASHBOARD_PATHS.some(p => pathname.startsWith(p));
  const isAuth = AUTH_PATHS.some(p => pathname.startsWith(p));

  let isValidToken = false;
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-in-production');
      await jwtVerify(token, secret);
      isValidToken = true;
    } catch {
      isValidToken = false;
    }
  }

  if (isDashboard && !isValidToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuth && isValidToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};