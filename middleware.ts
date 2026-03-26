import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const { pathname, origin } = req.nextUrl;

    // ==========================================
    // 1. 🚀 SEO REDIRECT MANAGER (Runs First)
    // ==========================================
    // We skip API, static files, and admin panels to keep the site lightning fast
    if (!pathname.startsWith('/api') && 
        !pathname.startsWith('/_next') && 
        !pathname.startsWith('/godmode') &&
        !pathname.includes('.')) {
        
        try {
            // Fast Edge-compatible API call to check if this URL needs a 301/302 redirect
            const res = await fetch(`${origin}/api/seo/redirects/check?path=${encodeURIComponent(pathname)}`);
            if (res.ok) {
                const data = await res.json();
                if (data?.redirectUrl) {
                    return NextResponse.redirect(new URL(data.redirectUrl, req.url), data.isPermanent ? 301 : 302);
                }
            }
        } catch (error) {
            console.error("Redirect check skipped (Network/Build phase)");
        }
    }

    // ==========================================
    // 2. 🛡️ SECURITY & AUTHENTICATION
    // ==========================================
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // 👑 GODMODE (ADMIN PANEL) PROTECTION
    if (pathname.startsWith('/godmode')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
        if (token.role !== 'SUPER_ADMIN') {
            return NextResponse.redirect(new URL('/account', req.url)); // Send them to normal account
        }
    }

    // 👤 CLIENT ACCOUNT PROTECTION
    if (pathname.startsWith('/account') || pathname.startsWith('/checkout')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    return NextResponse.next();
}

// ⚙️ MATCHER CONFIGURATION
// It must check everything EXCEPT static files to catch old broken URLs for SEO redirects
export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ]
};