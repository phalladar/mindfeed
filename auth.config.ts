import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAuthPage = nextUrl.pathname.startsWith('/login')
      const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth')

      // Allow access to auth API routes
      if (isApiAuthRoute) return true

      // Redirect logged in users away from auth pages
      if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL('/', nextUrl))
      }

      return !!isLoggedIn
    }
  }
} satisfies NextAuthConfig;