import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const { pathname, origin } = req.nextUrl;
    const response = NextResponse.next();

    // ================================================================
    // 🛡️ SECURITY HEADERS (DISABLED ON LOCALHOST TO PREVENT JS CRASH)
    // ================================================================
    // Bhai, production (Vercel) par CSP headers zaroori hain, 
    // par localhost par ye React ko freeze kar dete hain.
    if (process.env.NODE_ENV === 'production') {
        const cspHeader = `
            default-src 'self';
            script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://js.stripe.com https://checkout.razorpay.com;
            style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
            img-src 'self' data: blob: https://images.unsplash.com https://images.pexels.com https://*.pexels.com https://res.cloudinary.com https://*.googleusercontent.com https://cdn.pixabay.com;
            font-src 'self' https://fonts.gstatic.com data:;
            media-src 'self' blob: data: https://cdn.pixabay.com https://*.pixabay.com https://videos.pexels.com https://*.pexels.com https://www.pexels.com https://res.cloudinary.com;
            connect-src 'self' https://api.resend.com https://*.mongodb.net https://*.upstash.io https://www.google.com https://accounts.google.com https://oauth2.googleapis.com https://api.stripe.com https://checkout.razorpay.com https://cdn.pixabay.com https://res.cloudinary.com https://*.cloudinary.com;
            frame-src 'self' https://www.google.com https://checkout.razorpay.com https://js.stripe.com;
            object-src 'none';
            base-uri 'self';
            form-action 'self';
            frame-ancestors 'none';
            upgrade-insecure-requests;
        `.replace(/\s{2,}/g, ' ').trim();

        response.headers.set('Content-Security-Policy', cspHeader);
        response.headers.set('X-Frame-Options', 'DENY');
        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    }

    // ==========================================
    // 🚨 1. NEXTAUTH LOGIN LOOP PREVENTER
    // ==========================================
    if (pathname.startsWith('/api/auth')) {
        return response;
    }

    // ==========================================
    // 2. 🛡️ AUTHENTICATION & PROTECTION
    // ==========================================
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // 👑 GODMODE / ADMIN PROTECTION
    if (pathname.startsWith('/godmode') || pathname.startsWith('/admin')) {
        if (!token) return NextResponse.redirect(new URL('/login', req.url));
        if ((token as any).role !== 'SUPER_ADMIN') return NextResponse.redirect(new URL('/account', req.url)); 
    }

    // 👤 CLIENT ACCOUNT PROTECTION
    if (pathname.startsWith('/account') || pathname.startsWith('/checkout')) {
        if (!token) return NextResponse.redirect(new URL('/login', req.url));
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};