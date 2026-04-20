import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/usertemp";
import connectDB from "@/lib/mongodb";

/** Google sign-ins with these emails are always stored and refreshed as SUPER_ADMIN. */
const VIP_ADMINS = [
  "us7081569@gmail.com",
  "us7907us@gmail.com",
  "shresthxmarketing@gmail.com",
];

function isVipAdminEmail(email: string | null | undefined): boolean {
  if (!email || typeof email !== "string") return false;
  const normalized = email.trim().toLowerCase();
  return VIP_ADMINS.some((e) => e.trim().toLowerCase() === normalized);
}

function caseInsensitiveEmailQuery(email: string) {
  const escaped = email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${escaped}$`, "i");
}

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
                const existing = await User.findOne({ phone: credentials?.phone }).select('+password').lean() as any;
                
                if (!User || !existing.password) throw new Error("User not found");
                const isValid = await bcrypt.compare(credentials!.password, existing.password);
                if (!isValid) throw new Error("Wrong password");

                // ✅ PERFECT: Database ID is mapped to `id`
                return { 
                    id: existing._id.toString(), 
                    name: existing.name, 
                    email: existing.email, 
                    phone: existing.phone, 
                    role: existing.role,
                    walletPoints: existing.walletPoints || 0,
                    loyaltyTier: existing.loyaltyTier || 'Silver Vault'
                };
            }
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            await connectDB();
            if (account?.provider === "google" && user.email) {
                const vip = isVipAdminEmail(user.email);
                let dbUser = await User.findOne({
                    email: caseInsensitiveEmailQuery(user.email),
                }).lean() as { _id: unknown; role?: string } | null;

                if (!dbUser) {
                    const created = await User.create({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        role: vip ? "SUPER_ADMIN" : "USER",
                        phone: `GOOG-${Date.now().toString().slice(-5)}`,
                    });
                    dbUser = created.toObject() as { _id: unknown; role?: string };
                } else if (vip && dbUser.role === "USER") {
                    await User.updateOne(
                        { _id: dbUser._id },
                        { $set: { role: "SUPER_ADMIN" } }
                    );
                    dbUser = { ...dbUser, role: "SUPER_ADMIN" };
                }

                // ✅ PERFECT: Map Google user to DB ID
                user.id = String(dbUser._id);
            }
            return true;
        },
        async jwt({ token, user, trigger }) {
            await connectDB();
            
            // ✅ PERFECT: Extracting ID from either user object or existing token
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
                // ✅ PERFECT: Injecting ID into the frontend session
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