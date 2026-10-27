import { db } from "@/lib/db";
import { compare } from "bcryptjs";
import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [CredentialsProvider({ name: "credentials", credentials: { email: {}, password: {} }, async authorize(credentials) {
    if (!credentials?.email || !credentials.password) return null;
    const user = await db.user.findUnique({ where: { email: credentials.email.toLowerCase() } });
    if (!user || !(await compare(credentials.password, user.passwordHash))) return null;
    return { id: user.id, email: user.email, name: user.name ?? user.email.split("@")[0] };
  } })],
  callbacks: { async jwt({ token, user }) { if (user) token.id = user.id; return token; }, async session({ session, token }) { if (session.user) session.user.id = token.id as string; return session; } },
  pages: { signIn: "/" },
};
