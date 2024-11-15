import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth();
  
  // Add your secure routes here
  const secureRoutes = [
    '/feeds',
    '/recommended',
    '/popular'
  ];

  const isSecureRoute = secureRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isSecureRoute && !session) {
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