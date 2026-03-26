import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    // 1. 🛡️ GODMODE (ADMIN PANEL) PROTECTION
    if (pathname.startsWith('/godmode')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
        if (token.role !== 'SUPER_ADMIN') {
            return NextResponse.redirect(new URL('/account', req.url)); // Send them to normal account
        }
    }

    // 2. 👤 CLIENT ACCOUNT PROTECTION
    if (pathname.startsWith('/account') || pathname.startsWith('/checkout')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    return NextResponse.next();
}

// Ensure paths match exactly what you use in your app
export const config = {
    matcher: ['/godmode/:path*', '/account/:path*', '/checkout/:path*']
};