import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";

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
                await connectDB();
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
            await connectDB();
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
        async jwt({ token, user, trigger }) {
            await connectDB();
            const uid = (user?.id as string | undefined) ?? (token.id as string | undefined);
            if (!uid) return token;

            const shouldRefresh =
                !!user ||
                trigger === "update" ||
                typeof token.walletPoints !== "number";

            if (shouldRefresh) {
                const dbUser = await User.findById(uid).select("role walletPoints loyaltyTier").lean() as {
                    role?: string;
                    walletPoints?: number;
                    loyaltyTier?: string;
                } | null;

                if (dbUser) {
                    token.id = uid;
                    token.role = dbUser.role ?? "USER";
                    token.walletPoints = Number(dbUser.walletPoints) || 0;
                    token.loyaltyTier = dbUser.loyaltyTier ?? "Silver Vault";
                } else if (user) {
                    token.id = user.id;
                    token.role = (user as { role?: string }).role ?? "USER";
                    token.walletPoints = Number((user as { walletPoints?: number }).walletPoints) || 0;
                    token.loyaltyTier = (user as { loyaltyTier?: string }).loyaltyTier ?? "Silver Vault";
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.walletPoints = token.walletPoints as number;
                session.user.loyaltyTier = token.loyaltyTier as string;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
