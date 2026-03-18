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
        // Yahan tera VIP Admin password set hai
        if (credentials?.email === "admin@gmail.com" && credentials?.password === "admin") {
          return { id: "1", name: "Admin", email: "admin@gmail.com", role: "admin" };
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
  secret: process.env.NEXTAUTH_SECRET || "EssentialRush_Ultra_Premium_Secret_2026",
};