import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session }) {
      if (session.user) {
        // Check if the logged-in email matches the ADMIN_EMAIL in .env.local
        const isAdmin = session.user.email === process.env.ADMIN_EMAIL;
        
        // Give SUPER_ADMIN power if it matches
        (session.user as any).role = isAdmin ? "SUPER_ADMIN" : "USER";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };