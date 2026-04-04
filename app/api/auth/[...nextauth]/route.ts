import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "@/models/User"; 

let isConnected = false; 

const connectDB = async () => {
    mongoose.set('strictQuery', true);
    if (isConnected || mongoose.connection.readyState >= 1) return; 
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        isConnected = true;
    } catch (error) {
        console.error("❌ DB Connection Error");
    }
};

const generateReferralCode = (name: string) => {
    const prefix = name.split(' ')[0].toUpperCase().slice(0, 4).replace(/[^A-Z0-9]/g, '');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase().replace(/[^A-Z0-9]/g, '');
    return `ESS${prefix}${random}`.replace(/[^A-Z0-9]/g, '').substring(0, 8);
};

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "MISSING_ID",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "MISSING_SECRET",
        }),
        CredentialsProvider({
            name: "Mobile Number",
            credentials: {
                phone: { type: "text" },
                password: { type: "password" },
                captchaToken: { type: "text" } 
            },
            async authorize(credentials) {
                if (!credentials?.phone || !credentials?.password) throw new Error("Please enter details.");
                
                await connectDB();
                const user = await User.findOne({ 
                    phone: { $regex: new RegExp(`^${credentials.phone.trim()}$`, 'i') } 
                }).select('+password').lean() as any;
                
                if (!user) throw new Error("No account found with this phone number.");
                if (!user.password) throw new Error("This is a Google account. Use Google login.");

                const isValidPassword = await bcrypt.compare(credentials.password, user.password);
                if (!isValidPassword) throw new Error("Incorrect password.");

                // 🚨 RETURN EXACT DB VALUES
                return { 
                    id: user._id.toString(), 
                    name: user.name, 
                    email: user.email || null, 
                    phone: user.phone, 
                    role: user.role,
                    myReferralCode: user.myReferralCode,
                    walletPoints: user.walletPoints,
                    loyaltyTier: user.loyaltyTier
                };
            }
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            await connectDB();
            if (account?.provider === "google") {
                try {
                    let existingUser = await User.findOne({ email: user.email }).lean() as any;
                    
                    if (!existingUser) {
                        const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
                        const role = superAdminEmail && user.email === superAdminEmail ? 'SUPER_ADMIN' : 'USER';
                        existingUser = await User.create({ 
                            name: user.name || "Google User", 
                            email: user.email, 
                            image: user.image, 
                            role: role,
                            phone: `GOOG-${Date.now().toString().slice(-6)}`, 
                            myReferralCode: generateReferralCode(user.name || "Elite"),
                            walletPoints: 0,
                            totalEarned: 0,
                            loyaltyTier: 'Silver Vault'
                        });
                    }
                    
                    // 🚨 MAP EXACT DB VALUES TO USER OBJECT
                    user.id = existingUser._id.toString();
                    (user as any).role = existingUser.role;
                    (user as any).phone = existingUser.phone;
                    (user as any).myReferralCode = existingUser.myReferralCode;
                    (user as any).walletPoints = existingUser.walletPoints;
                    (user as any).loyaltyTier = existingUser.loyaltyTier;
                    
                    return true;
                } catch (error) {
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, trigger, session }) {
            // 🚨 NO DATABASE CALLS HERE ANYMORE. JUST TRUST THE 'user' OBJECT.
            if (user) {
                token.id = user.id;
                token.role = (user as any).role || 'USER';
                token.phone = (user as any).phone || null;
                token.email = user.email || null;
                token.myReferralCode = (user as any).myReferralCode;
                token.walletPoints = (user as any).walletPoints || 0;
                token.loyaltyTier = (user as any).loyaltyTier || 'Silver Vault';
            }
            if (trigger === "update" && session) {
                if (session.phone) token.phone = session.phone;
                if (session.walletPoints !== undefined) token.walletPoints = session.walletPoints;
            }
            return token;
        },
     async session({ session, token }) {
            if (session.user) {
                // Type errors hatane ke liye simple direct assignment
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
                (session.user as any).phone = token.phone;
                (session.user as any).myReferralCode = token.myReferralCode;
                (session.user as any).walletPoints = token.walletPoints;
                (session.user as any).loyaltyTier = token.loyaltyTier;
                // NextAuth by default email set karta hai, toh usko chhedne ki zaroorat nahi
            }
            return session;
        }
    },
    pages: { signIn: '/login' },
    session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };