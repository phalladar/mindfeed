import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Instead of using auth(), we'll use getToken()
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  // Add your secure routes here
  const secureRoutes = [
    '/feeds',
    '/recommended',
    '/popular'
  ];

  const isSecureRoute = secureRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isSecureRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - login page
     * - landing page (root)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public|login|$).*)',
  ],
};