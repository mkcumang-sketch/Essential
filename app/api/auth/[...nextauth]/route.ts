import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// 🌟 BULLETPROOF DATABASE CONNECTION 🌟
let isConnected = false; 

const connectDB = async () => {
    mongoose.set('strictQuery', true);
    
    if (isConnected || mongoose.connection.readyState >= 1) {
        return; 
    }
    
    try {
        await mongoose.connect(process.env.MONGODB_URI as string, {
            bufferCommands: true, 
            maxPoolSize: 10,
        });
        isConnected = true;
        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.error("❌ DB Connection Error:", error);
        throw new Error("Database connection failed! Please check your MONGODB_URI and IP Whitelist.");
    }
};

// 🌟 USER SCHEMA 🌟
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    name: String, 
    email: { type: String, unique: true, sparse: true }, 
    phone: { type: String, unique: true, sparse: true }, 
    password: String, 
    role: { type: String, default: 'USER' }, 
    image: String,

    // 🌟 ELITE LOYALTY PROGRAM (Phase 2) 🌟
    totalSpent: { type: Number, default: 0 },
    loyaltyTier: { type: String, default: 'Silver Vault' }
}));

export const authOptions: NextAuthOptions = {
    providers: [
        // 1. GOOGLE LOGIN
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        // 2. PHONE & PASSWORD LOGIN WITH reCAPTCHA
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

                // 🛡️ STEP 1: VERIFY GOOGLE reCAPTCHA SCORE 🛡️
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

                // 🛡️ STEP 2: VERIFY DATABASE USER 🛡️
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
                const existingUser = await User.findOne({ email: user.email });
                if (!existingUser) {
                    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
                    const role = superAdminEmail && user.email === superAdminEmail ? 'SUPER_ADMIN' : 'USER';
                    const newUser = await User.create({ 
                        name: user.name, 
                        email: user.email, 
                        image: user.image, 
                        role: role,
                        phone: null // Explicitly mark phone as null for new Google users
                    });
                    (user as any).role = newUser.role;
                    (user as any).phone = null;
                    user.id = newUser._id.toString();
                } else {
                    (user as any).role = existingUser.role;
                    (user as any).phone = existingUser.phone || null; // Fetch phone if exists
                    user.id = existingUser._id.toString();
                }
            }
            return true;
        },
        async jwt({ token, user, trigger, session }) {
            // Handle initial sign-in
            if (user) {
                token.id = user.id;
                token.role = (user as any).role || 'USER';
                token.phone = (user as any).phone;
            }
            // 🚨 NEW LOGIC: Handle manual session updates (when user adds phone via popup)
            if (trigger === "update" && session?.phone) {
                token.phone = session.phone;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
                (session.user as any).phone = token.phone; // Now frontend will know if phone is missing
            }
            return session;
        }
    },
    session: { 
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login',
        error: '/login', // 🚨 YE LINE ADD KARO 🚨
    }
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };