import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// 🌟 DATABASE CONNECTION 🌟
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
    } catch (error) {
        console.error("DB Connection Error:", error);
    }
};

// 🌟 USER SCHEMA 🌟
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    name: String, 
    email: { type: String, unique: true, sparse: true }, 
    phone: { type: String, unique: true, sparse: true }, 
    password: String, 
    role: { type: String, default: 'USER' }, 
    image: String
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
                    const role = user.email === 'mkcumang@gmail.com' ? 'SUPER_ADMIN' : 'USER';
                    const newUser = await User.create({ 
                        name: user.name, 
                        email: user.email, 
                        image: user.image, 
                        role: role 
                    });
                    // Attach to user object for JWT
                    (user as any).role = newUser.role;
                    user.id = newUser._id.toString();
                } else {
                    // Attach existing data to user object for JWT
                    (user as any).role = existingUser.role;
                    (user as any).phone = existingUser.phone;
                    user.id = existingUser._id.toString();
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            // 🌟 FIX: NO EXTRA DB CALLS HERE. Fast and secure.
            // 'user' only exists on the first sign-in, after that token persists.
            if (user) {
                token.id = user.id;
                token.role = (user as any).role || 'USER';
                token.phone = (user as any).phone;
            }
            return token;
        },
        async session({ session, token }) {
            // Send token data to frontend
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
                (session.user as any).phone = token.phone;
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
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };