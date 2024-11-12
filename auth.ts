import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import type { User } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

async function getUser(email: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    })
    return user
  } catch (error) {
    console.error("Failed to fetch user:", error)
    throw new Error("Failed to fetch user.")
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (!parsedCredentials.success) {
          console.error("Invalid credentials format")
          return null
        }

        const { email, password } = parsedCredentials.data
        const user = await getUser(email)
        
        if (!user) {
          console.error("User not found")
          return null
        }
        
        const passwordsMatch = await bcrypt.compare(password, user.password)

        if (!passwordsMatch) {
          console.error("Passwords do not match")
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],
})
