import NextAuth from "next-auth"
import Resend from "next-auth/providers/resend"
import { PrismaAdapter } from "@auth/prisma-adapter"

import { prisma } from "@/lib/prisma"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Resend({
      from: process.env.EMAIL_FROM,
    }),
  ],
  pages: {
    verifyRequest: "/verify-request",
  },
})
