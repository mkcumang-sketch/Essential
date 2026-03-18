import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        // Aap yahan check kar sakte ho ki admin email kaunsi hai
        const adminEmails = ["umang.sharma@example.com", "your.email@gmail.com"]; // Yahan apni email dalo
        
        if (session.user.email && adminEmails.includes(session.user.email)) {
            (session.user as any).role = "SUPER_ADMIN";
        } else {
            (session.user as any).role = "USER";
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };