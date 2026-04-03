import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/ratelimit';

export async function middleware(req: NextRequest) {
    const { pathname, origin } = req.nextUrl;
    const response = NextResponse.next();

    // ==========================================
    // 🛡️ ZERO-TRUST SECURITY HEADERS
    // ==========================================
    
    // Content Security Policy - Block inline scripts, only allow trusted sources
    const cspHeader = `
        default-src 'self';
        script-src 'self' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://js.stripe.com https://checkout.razorpay.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        img-src 'self' https://images.unsplash.com https://res.cloudinary.com https://*.googleusercontent.com data: blob:;
        font-src 'self' https://fonts.gstatic.com;
        connect-src 'self' https://api.resend.com https://*.mongodb.net https://*.upstash.io https://www.google.com;
        frame-src 'self' https://www.google.com https://checkout.razorpay.com https://js.stripe.com;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim();

    response.headers.set('Content-Security-Policy', cspHeader);
    
    // Prevent clickjacking
    response.headers.set('X-Frame-Options', 'DENY');
    
    // Prevent MIME type sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff');
    
    // XSS Protection
    response.headers.set('X-XSS-Protection', '1; mode=block');
    
    // Referrer Policy
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // HSTS (HTTPS Strict Transport Security)
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    
    // Permissions Policy
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(self)');

    // ==========================================
    // 🚨 1. FIX: NEXTAUTH LOGIN LOOP PREVENTER
    // ==========================================
    if (pathname.startsWith('/api/auth')) {
        return response;
    }

    // ==========================================
    // 2. 🚀 RATE LIMITING (BOT PROTECTION)
    // ==========================================
    // Get client IP from headers (works with Vercel, AWS, and other platforms)
    const forwarded = req.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
    const userAgent = req.headers.get('user-agent') ?? 'unknown';
    
    // Determine rate limit type based on route
    let rateLimitType: 'user' | 'auth' | 'admin' = 'user';
    if (pathname.startsWith('/api/auth')) {
        rateLimitType = 'auth';
    } else if (pathname.startsWith('/api/admin') || pathname.startsWith('/godmode')) {
        rateLimitType = 'admin';
    }
    
    // Create unique identifier (IP + UserAgent hash for auth routes, just IP for others)
    const identifier = rateLimitType === 'auth' 
        ? `${clientIp}:${userAgent}` 
        : clientIp;
    
    const rateLimitResult = await checkRateLimit(identifier, rateLimitType);
    
    // Add rate limit headers to all responses
    const rateLimitHeaders = getRateLimitHeaders(rateLimitResult);
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
    });
    
    // Block if rate limit exceeded
    if (!rateLimitResult.success) {
        return NextResponse.json(
            { 
                success: false, 
                error: 'Rate limit exceeded. Please try again later.',
                retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
            }, 
            { 
                status: 429,
                headers: {
                    ...rateLimitHeaders,
                    'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString()
                }
            }
        );
    }

    // ==========================================
    // 3. 🚀 SEO REDIRECT MANAGER
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
            // Silent fail for SEO redirects
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

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files (images, fonts, etc.)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};