import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "@/models/User"; 

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: { phone: { type: "text" }, password: { type: "password" } },
            async authorize(credentials) {
                if (mongoose.connection.readyState < 1) await mongoose.connect(process.env.MONGODB_URI!);
                const user = await User.findOne({ phone: credentials?.phone }).select('+password').lean() as any;
                
                if (!user || !user.password) throw new Error("User not found");
                const isValid = await bcrypt.compare(credentials!.password, user.password);
                if (!isValid) throw new Error("Wrong password");

                return { 
                    id: user._id.toString(), 
                    name: user.name, 
                    email: user.email, 
                    phone: user.phone, 
                    role: user.role,
                    walletPoints: user.walletPoints || 0,
                    loyaltyTier: user.loyaltyTier || 'Silver Vault'
                };
            }
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (mongoose.connection.readyState < 1) await mongoose.connect(process.env.MONGODB_URI!);
            if (account?.provider === "google") {
                let dbUser = await User.findOne({ email: user.email }).lean() as any;
                if (!dbUser) {
                    dbUser = await User.create({
                        name: user.name, email: user.email, image: user.image, role: 'USER',
                        phone: `GOOG-${Date.now().toString().slice(-5)}`
                    });
                }
                user.id = dbUser._id.toString();
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };