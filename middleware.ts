import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const { pathname, origin } = req.nextUrl;

    // 🚨 1. FIX: NEXTAUTH LOGIN LOOP PREVENTER
    // Agar route NextAuth ka hai, toh middleware ko usme ungli mat karne do
    if (pathname.startsWith('/api/auth')) {
        return NextResponse.next();
    }

    // ==========================================
    // 2. 🚀 SEO REDIRECT MANAGER
    // ==========================================
    if (!pathname.startsWith('/api') && 
        !pathname.startsWith('/_next') && 
        !pathname.startsWith('/godmode') &&
        !pathname.includes('.')) {
        
        try {
            const res = await fetch(`${origin}/api/seo/redirects/check?path=${encodeURIComponent(pathname)}`);
            if (res.ok) {
                const data = await res.json();
                if (data?.redirectUrl) {
                    return NextResponse.redirect(new URL(data.redirectUrl, req.url), data.isPermanent ? 301 : 302);
                }
            }
        } catch (error) {
            console.error("Redirect check skipped");
        }
    }

    // ==========================================
    // 3. 🛡️ SECURITY & AUTHENTICATION
    // ==========================================
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // 👑 GODMODE (ADMIN PANEL) PROTECTION
    if (pathname.startsWith('/godmode')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
        if (token.role !== 'SUPER_ADMIN') {
            return NextResponse.redirect(new URL('/account', req.url)); 
        }
    }

    // � ADMIN PANEL PROTECTION (EDGE LEVEL)
    if (pathname.startsWith('/admin')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
        if (token.role !== 'SUPER_ADMIN') {
            return NextResponse.redirect(new URL('/account', req.url)); 
        }
    }

    // �👤 CLIENT ACCOUNT PROTECTION
    if (pathname.startsWith('/account') || pathname.startsWith('/checkout')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ]
};