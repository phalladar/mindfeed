import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  const secureRoutes = [
    '/feeds',
    '/recommended',
    '/popular'
  ];

  const isSecureRoute = secureRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isSecureRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/feeds/:path*',
    '/recommended/:path*',
    '/popular/:path*',
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public|login|$).*)',
  ],
};