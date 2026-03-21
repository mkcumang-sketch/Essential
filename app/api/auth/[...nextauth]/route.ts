import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Database Connection inside NextAuth
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGODB_URI as string);
};

// Assuming the same User model structure
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    name: String, email: String, phone: String, password: String, role: String, image: String
}));

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
                phone: { label: "Phone Number", type: "text", placeholder: "e.g. 9876543210" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.phone || !credentials?.password) throw new Error("Missing credentials");
                await connectDB();
                
                const user = await User.findOne({ phone: credentials.phone });
                if (!user || !user.password) throw new Error("Account not found");

                const isValidPassword = await bcrypt.compare(credentials.password, user.password);
                if (!isValidPassword) throw new Error("Invalid password");

                return { id: user._id.toString(), name: user.name, email: user.email, phone: user.phone, role: user.role };
            }
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            await connectDB();
            if (account?.provider === "google") {
                const existingUser = await User.findOne({ email: user.email });
                if (!existingUser) {
                    // Create new user if they log in with Google for the first time
                    // NOTE: Assign SUPER_ADMIN here if it's your personal email, else USER
                    const role = user.email === 'mkcumang@gmail.com' ? 'SUPER_ADMIN' : 'USER';
                    await User.create({ name: user.name, email: user.email, image: user.image, role: role });
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                await connectDB();
                const dbUser = await User.findOne({ $or: [{ email: user.email }, { phone: (user as any).phone }] });
                token.role = dbUser?.role || 'USER';
                token.phone = dbUser?.phone;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                (session.user as any).role = token.role;
                (session.user as any).phone = token.phone;
            }
            return session;
        }
    },
    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login', // We are pointing NextAuth to our custom elegant login page
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };