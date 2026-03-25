import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 🌟 THE BULLETPROOF MIDDLEWARE (NO LOOPS, NO FALSE 429 BLOCKS) 🌟
export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    // 1. 🛡️ GODMODE (ADMIN PANEL) PROTECTION
    if (pathname.startsWith('/godmode')) {
        // Agar user logged in nahi hai, toh seedha login par bhejo
        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
        // Agar user logged in hai par ADMIN nahi hai, toh wapas home par bhejo
        if (token.role !== 'SUPER_ADMIN') {
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    // 2. 👤 CLIENT ACCOUNT PROTECTION
    if (pathname.startsWith('/account') || pathname.startsWith('/checkout')) {
        // Agar normal user bina login kiye account ya checkout par jana chahe
        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    // Agar sab theek hai, toh page load hone do (No loops!)
    return NextResponse.next();
}

// Sirf in pages par yeh police (middleware) check karegi
export const config = {
    matcher: ['/godmode/:path*', '/account/:path*', '/checkout/:path*']
};