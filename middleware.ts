import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// 🛡️ INITIALIZE REDIS FIREWALL (Safe fallback if keys are missing during local dev)
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// Create a new ratelimiter that allows 10 requests per 10 seconds
const ratelimit = (redisUrl && redisToken) 
    ? new Ratelimit({
        redis: new Redis({ url: redisUrl, token: redisToken }),
        limiter: Ratelimit.slidingWindow(10, '10 s'),
        analytics: true,
      })
    : null;

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const userAgent = req.headers.get('user-agent') || '';
    
    // IP Address extraction for rate limiting
    const ip = req.ip || req.headers.get('x-forwarded-for') || '127.0.0.1';

    // 🌟 LAYER 1: HEADLESS BOT BLACKLIST 🌟
    const botList = ['headless', 'puppeteer', 'selenium', 'python-requests', 'node-fetch', 'axios', 'curl', 'scrapy'];
    const isBot = botList.some(bot => userAgent.toLowerCase().includes(bot));

    if (isBot && !path.startsWith('/_next')) {
        console.log(`[SENTINEL] Blocked malicious scraper from IP: ${ip}`);
        return new NextResponse('Access Denied: Malicious Bot Detected', { status: 403 });
    }

    // 🌟 LAYER 2: UPSTASH RATE LIMITER (DDoS Protection) 🌟
    // Apply rate limiting only to API routes and Godmode to save Redis bandwidth
    if (ratelimit && (path.startsWith('/api') || path.startsWith('/godmode'))) {
        const { success, pending, limit, reset, remaining } = await ratelimit.limit(ip);
        
        if (!success) {
            console.warn(`[FIREWALL] Rate limit exceeded for IP: ${ip}`);
            return new NextResponse('Too Many Requests. Please slow down.', {
                status: 429,
                headers: {
                    'X-RateLimit-Limit': limit.toString(),
                    'X-RateLimit-Remaining': remaining.toString(),
                    'X-RateLimit-Reset': reset.toString(),
                    'Retry-After': reset.toString(),
                },
            });
        }
    }

    // 🌟 LAYER 3: GODMODE ADMIN AUTHENTICATION 🌟
    if (path.startsWith('/godmode') || path.startsWith('/api/admin')) {
        const sessionToken = req.cookies.get('next-auth.session-token') || req.cookies.get('__Secure-next-auth.session-token');
        
        if (!sessionToken) {
            console.log(`[FIREWALL] Blocked unauthorized Admin panel access from IP: ${ip}`);
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    // 🌟 LAYER 4: INJECT SECURE HEADERS 🌟
    const response = NextResponse.next();
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    return response;
}

// Ensure the firewall only runs on critical paths to keep the website lightning fast
export const config = {
    matcher: [
        '/godmode/:path*', 
        '/api/:path*'
    ],
};