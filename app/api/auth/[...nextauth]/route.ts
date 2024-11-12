import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

// Create handler directly in route
const handler = NextAuth({
  providers: [Google],  // Simplified provider config
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
    error: '/auth/error',
  }
});

// Export auth helper for server components
export const auth = handler.auth;

// Export route handlers
export { handler as GET, handler as POST }; 