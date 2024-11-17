import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Get the token and verify it
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const secureRoutes = [
    '/feeds',
    '/recommended',
    '/popular'
  ];

  // Check if the current path requires authentication
  const isSecureRoute = secureRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  // Handle secure routes
  if (isSecureRoute) {
    if (!token) {
      // No token found, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(loginUrl);
    }
    
    // If token exists but might be expired, verify it
    try {
      if (token.exp && Date.now() >= token.exp * 1000) {
        // Token is expired, redirect to login
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', request.url);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      console.error('Token verification error:', error);
      // On error, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Update the config to include api routes that should bypass the middleware
export const config = {
  matcher: [
    '/feeds/:path*',
    '/recommended/:path*',
    '/popular/:path*',
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public|login|signup|$).*)',
  ],
};