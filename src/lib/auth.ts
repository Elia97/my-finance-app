// lib/auth.ts (o un file simile)

import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { SessionStrategy } from "next-auth";

const strategy: SessionStrategy = "jwt";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        if (user && credentials?.password) {
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isValid) return user;
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
};
