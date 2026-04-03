import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "@/models/User"; // ⚠️ Check: Agar tera folder Capital 'M' se hai toh '@/Models/user' kar dena

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

                // 🚨 DEV BYPASS: reCAPTCHA commented out for local testing. Uncomment when pushing to Vercel.
                /*
                try {
                    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${credentials.captchaToken}`;
                    const captchaRes = await fetch(verifyUrl, { method: 'POST' });
                    const captchaData = await captchaRes.json();
                    if (!captchaData.success || captchaData.score < 0.5) {
                        throw new Error("Security check failed. Bots are not allowed.");
                    }
                } catch (err) {
                    throw new Error("Security verification service unavailable.");
                }
                */

                // 🛡️ VERIFY DATABASE USER 🛡️
                await connectDB();
                const user = await User.findOne({ phone: credentials.phone });
                
                if (!user || !user.password) {
                    throw new Error("No account found with this phone number.");
                }

                const isValidPassword = await bcrypt.compare(credentials.password, user.password);
                if (!isValidPassword) {
                    throw new Error("Incorrect password.");
                }

                // Success: Return user data to JWT
                return { 
                    id: user._id.toString(), 
                    name: user.name, 
                    email: user.email, 
                    phone: user.phone, 
                    role: user.role 
                };
            }
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            await connectDB();
            if (account?.provider === "google") {
                let existingUser = await User.findOne({ email: user.email });
                if (!existingUser) {
                    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
                    const role = superAdminEmail && user.email === superAdminEmail ? 'SUPER_ADMIN' : 'USER';
                    
                    // 🚀 MongoDB Crash Fix: 'phone: null' hata diya 
                    existingUser = await User.create({ 
                        name: user.name, 
                        email: user.email, 
                        image: user.image, 
                        role: role
                    });
                }
                (user as any).role = existingUser.role;
                (user as any).phone = existingUser.phone || null;
                user.id = existingUser._id.toString();
            }
            return true;
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role || 'USER';
                token.phone = (user as any).phone;
            }
            // User can update their phone number later
            if (trigger === "update" && session?.phone) {
                token.phone = session.phone;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
                (session.user as any).phone = token.phone;
            }
            return session;
        }
    },
    // 🎯 THE MAGIC FIX: NextAuth ko tera custom page bata diya
    pages: {
        signIn: '/login', 
    },
    session: { 
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: true,
    
    // 🛡️ LOCALHOST LOOP PREVENTER (Forces browser to accept cookies locally)
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