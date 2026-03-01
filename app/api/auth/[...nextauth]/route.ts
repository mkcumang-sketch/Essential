import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Admin Portal",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.email === "admin@gmail.com" && credentials?.password === "Essential_rush_2390") {
          // Success hone par ye data return hoga
          return { id: "1", name: "Super Admin", email: "admin@gmail.com" };
        }
        return null; // Fail hone par null
      }
    })
  ],
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 din tak login rahega
  },
  // Wahi same secret jo Middleware mein hai
  secret: "EssentialRush_Ultra_Premium_Secret_2026", 
  pages: {
    signIn: '/login',
  },
});

export { handler as GET, handler as POST };