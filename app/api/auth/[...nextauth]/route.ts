import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "@/models/User"; 

// 🌟 BULLETPROOF DATABASE CONNECTION 🌟
let isConnected = false; 

const connectDB = async () => {
    mongoose.set('strictQuery', true);
    if (isConnected || mongoose.connection.readyState >= 1) return; 
    try {
        await mongoose.connect(process.env.MONGODB_URI as string, {
            bufferCommands: true, 
            maxPoolSize: 10,
        });
        isConnected = true;
        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.error("❌ DB Connection Error:", error);
        throw new Error("Database connection failed!");
    }
};

// 💎 HELPER: Unique Referral Code Generator
const generateReferralCode = (name: string) => {
    const prefix = name.split(' ')[0].toUpperCase().slice(0, 4);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ESS-${prefix}-${random}`;
};

export const authOptions: NextAuthOptions = {
    providers: [
        // 1. GOOGLE LOGIN
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        
        // 2. PHONE & PASSWORD LOGIN
        CredentialsProvider({
            name: "Mobile Number",
            credentials: {
                phone: { label: "Phone Number", type: "text" },
                password: { label: "Password", type: "password" },
                captchaToken: { label: "Captcha", type: "text" } 
            },
            async authorize(credentials) {
                if (!credentials?.phone || !credentials?.password) {
                    throw new Error("Please enter phone and password.");
                }

                // 🛡️ RECAPTCHA VERIFICATION
                if (process.env.NODE_ENV === 'production' && credentials.captchaToken) {
                    try {
                        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${credentials.captchaToken}`;
                        const captchaRes = await fetch(verifyUrl, { method: 'POST' });
                        const captchaData = await captchaRes.json();
                        
                        if (!captchaData.success || captchaData.score < 0.5) {
                            throw new Error("Security verification failed.");
                        }
                    } catch (err) {
                        console.error("reCAPTCHA Error:", err);
                        throw new Error("Security service unavailable.");
                    }
                }

                await connectDB();
                
                // 🛡️ FIX: Cast to any after .lean() to solve TS errors
                const user = (await User.findOne({ phone: credentials.phone })
                    .select('+password') 
                    .lean()) as any;
                
                if (!user || !user.password) {
                    throw new Error("No account found with this phone number.");
                }

                const isValidPassword = await bcrypt.compare(credentials.password, user.password);
                if (!isValidPassword) {
                    throw new Error("Incorrect password.");
                }

                // 🛡️ LOGIN HISTORY
                await User.findByIdAndUpdate(user._id, {
                    $push: {
                        loginHistory: {
                            ip: '0.0.0.0', 
                            device: 'Web Browser',
                            date: new Date()
                        }
                    }
                });

                return { 
                    id: user._id.toString(), 
                    name: user.name, 
                    email: user.email, 
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
                // 🛡️ FIX: Remove semicolon and cast correctly
                let existingUser = (await User.findOne({ email: user.email }).lean()) as any;
                
                if (!existingUser) {
                    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
                    const role = superAdminEmail && user.email === superAdminEmail ? 'SUPER_ADMIN' : 'USER';
                    
                    existingUser = await User.create({ 
                        name: user.name, 
                        email: user.email, 
                        image: user.image, 
                        role: role,
                        myReferralCode: generateReferralCode(user.name || "Elite"),
                        walletPoints: 0,
                        totalEarned: 0,
                        loyaltyTier: 'Silver Vault'
                    });
                }
                
                // Sync data for session
                (user as any).role = existingUser.role;
                (user as any).phone = existingUser.phone || null;
                (user as any).myReferralCode = existingUser.myReferralCode;
                (user as any).walletPoints = existingUser.walletPoints;
                (user as any).loyaltyTier = existingUser.loyaltyTier;
                user.id = existingUser._id.toString();
            }
            return true;
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role || 'USER';
                token.phone = (user as any).phone;
                token.myReferralCode = (user as any).myReferralCode;
                token.walletPoints = (user as any).walletPoints;
                token.loyaltyTier = (user as any).loyaltyTier;
            }
            if (trigger === "update") {
                if (session?.phone) token.phone = session.phone;
                if (session?.walletPoints !== undefined) token.walletPoints = session.walletPoints;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
                (session.user as any).phone = token.phone;
                (session.user as any).myReferralCode = token.myReferralCode;
                (session.user as any).walletPoints = token.walletPoints;
                (session.user as any).loyaltyTier = token.loyaltyTier;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login', 
    },
    session: { 
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, 
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
    
    cookies: {
        sessionToken: {
            name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };