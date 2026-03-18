import { NextRequest, NextResponse } from 'next/server'; // 🚨 FIXED: Added imports

export function middleware(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get('ref');
  
  if (ref) {
    const response = NextResponse.next();
    response.cookies.set('affiliate_id', ref, { 
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/', 
    });
    return response;
  }
  
  return NextResponse.next();
}