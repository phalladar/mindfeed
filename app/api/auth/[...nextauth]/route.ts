import NextAuth from 'next-auth'
import { authConfig } from '@/auth.config'
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

const handler = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const parsedCredentials = z
            .object({ email: z.string().email(), password: z.string().min(6) })
            .safeParse(credentials)

          if (!parsedCredentials.success) {
            return null
          }

          const { email, password } = parsedCredentials.data
          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
            },
          })

          if (!user?.password) return null

          const passwordsMatch = await bcrypt.compare(password, user.password)
          if (!passwordsMatch) return null

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
})

export { handler as GET, handler as POST } 