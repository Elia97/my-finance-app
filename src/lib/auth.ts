// lib/auth.ts (o un file simile)

import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { SessionStrategy } from "next-auth";
import { User } from "../types/types";
import type {
  NextAuthOptions,
  User as NextAuthUser,
  Session as NextAuthSession,
} from "next-auth";
import type { JWT } from "next-auth/jwt";

const strategy: SessionStrategy = "jwt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy,
    maxAge: 30 * 24 * 60 * 60, // 30 giorni
    updateAge: 24 * 60 * 60, // Aggiorna ogni 24 ore
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 giorni
  },
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
  callbacks: {
    async jwt({
      token,
      user,
    }: {
      token: JWT & { id?: string };
      user?: NextAuthUser | null;
    }) {
      // Se è la prima volta che il JWT viene creato, aggiungi l'id
      if (user && user.id) {
        token.id = user.id;
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: NextAuthSession;
      token: JWT;
    }) {
      // Inietta l'id nel session.user, così è disponibile nel client
      if (token?.id && session.user) {
        (session.user as User).id = token.id as string;
      }
      // Ensure session.user fields are defined as strings (not undefined)
      session.user = {
        ...session.user,
        id: (session.user as User).id,
        name: session.user?.name ?? "",
        email: session.user?.email ?? "",
        image: session.user?.image ?? undefined,
      };
      return session;
    },
  },
};
