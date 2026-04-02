import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
          throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set for credentials auth.");
        }

        if (credentials?.email === adminEmail && credentials?.password === adminPassword) {
          return { id: "1", name: "Admin", email: adminEmail, role: "SUPER_ADMIN" };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login', // Ye 2 form aane wali problem rokega
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};