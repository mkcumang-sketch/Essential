import { NextResponse } from 'next/server';

// 🍯 ANTI-BOT HONEYPOT PROTECTION
// This middleware detects and blocks automated bots by checking for honeypot field submissions

export async function honeypotMiddleware(request: Request): Promise<NextResponse | null> {
    // Only check POST requests
    if (request.method !== 'POST') {
        return null;
    }

    const url = new URL(request.url);
    const pathname = url.pathname;

    // Only check auth routes
    if (!pathname.includes('/api/auth/') && !pathname.includes('/login') && !pathname.includes('/register')) {
        return null;
    }

    try {
        const body = await request.json();
        
        // 🚨 HONEYPOT CHECK: If 'website' field is filled, it's a bot
        // This field should be hidden from real users via CSS
        if (body.website && body.website.trim() !== '') {
            // Get client IP for logging
            const forwarded = request.headers.get('x-forwarded-for');
            const clientIp = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
            const userAgent = request.headers.get('user-agent') ?? 'unknown';
            
            // Log bot detection (but don't expose internal details)
            console.warn(`🤖 Bot detected via honeypot:`, {
                ip: clientIp,
                userAgent: userAgent.substring(0, 50),
                path: pathname,
                timestamp: new Date().toISOString()
            });

            // Return generic error to not tip off the bot
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Request could not be processed. Please try again.' 
                }, 
                { status: 400 }
            );
        }

        return null;
    } catch {
        // If body parsing fails, continue to next middleware
        return null;
    }
}

// 🍯 HONEYPOT FIELD COMPONENT
// Add this hidden field to your login/register forms
export const HONEYPOT_FIELD_NAME = 'website';

export function createHoneypotField(): string {
    return `
        <div style="position: absolute; left: -9999px; opacity: 0; height: 0; width: 0; overflow: hidden;" aria-hidden="true">
            <input 
                type="text" 
                name="${HONEYPOT_FIELD_NAME}" 
                tabIndex="-1" 
                autoComplete="off"
                value=""
            />
        </div>
    `;
}

// 🍯 HONEYPOT REACT COMPONENT
export function HoneypotField(): JSX.Element {
    return (
        <div 
            style={{ 
                position: 'absolute', 
                left: '-9999px', 
                opacity: 0, 
                height: 0, 
                width: 0, 
                overflow: 'hidden' 
            }} 
            aria-hidden="true"
        >
            <input 
                type="text" 
                name={HONEYPOT_FIELD_NAME}
                tabIndex={-1}
                autoComplete="off"
                defaultValue=""
            />
        </div>
    );
}
