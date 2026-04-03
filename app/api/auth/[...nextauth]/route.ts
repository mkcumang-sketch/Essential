import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "@/models/User"; // Apne path ke hisaab se adjust kar lena

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
    } catch (error) {
        throw new Error("DB_CONNECTION_FAILED");
    }
};

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: "Mobile Number",
            credentials: {
                phone: { label: "Phone Number", type: "text" },
                password: { label: "Password", type: "password" },
                captchaToken: { label: "Captcha", type: "text" } 
            },
            async authorize(credentials) {
                if (!credentials?.phone || !credentials?.password) throw new Error("Missing credentials");

                // 🛡️ RECAPTCHA VERIFICATION
                try {
                    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${credentials.captchaToken}`;
                    const captchaRes = await fetch(verifyUrl, { method: 'POST' });
                    const captchaData = await captchaRes.json();
                    if (!captchaData.success || captchaData.score < 0.5) throw new Error("Bot detected");
                } catch (err) {
                    throw new Error("Security check failed");
                }

                await connectDB();
                const user = await User.findOne({ phone: credentials.phone });
                if (!user || !user.password) throw new Error("Invalid Phone or Password");

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) throw new Error("Invalid Phone or Password");

                return { id: user._id.toString(), name: user.name, email: user.email, phone: user.phone, role: user.role };
            }
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            await connectDB();
            if (account?.provider === "google") {
                // 🛡️ DATA LEAK PROTECTION: Link account safely
                let existingUser = await User.findOne({ email: user.email });
                
                if (!existingUser) {
                    const superAdmin = process.env.SUPER_ADMIN_EMAIL;
                    const role = superAdmin && user.email === superAdmin ? 'SUPER_ADMIN' : 'USER';
                    existingUser = await User.create({ 
                        name: user.name, 
                        email: user.email, 
                        image: user.image, 
                        role: role,
                        phone: null // Explicitly null
                    });
                }
                
                // Pass data to JWT callback
                (user as any).role = existingUser.role;
                (user as any).phone = existingUser.phone || null;
                user.id = existingUser._id.toString();
            }
            return true;
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
                token.phone = (user as any).phone;
            }
            // Update session when user adds phone number later
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
    session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
    secret: process.env.NEXTAUTH_SECRET,
    // 🚨 LOGIN LOOP FIX: Hata diya yahan se custom error page redirect, isse Vercel par loop banta hai agar URL mismatch ho.
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };