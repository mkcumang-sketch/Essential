import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "./db";
import User from "@/models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session }: any) {
      await connectDB();
      const dbUser = await User.findOne({ email: session.user.email });
      session.user.role = dbUser?.role || "user"; // Role-based Access
      return session;
    },
  },
};