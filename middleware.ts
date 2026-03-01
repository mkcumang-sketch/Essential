import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // 1. Guard khud tumhari cookie dhoondhega (Same Hardcoded Secret se)
  const token = await getToken({ 
    req, 
    secret: "EssentialRush_Ultra_Premium_Secret_2026" 
  });

  const isAuth = !!token; // Kya token mila? (True/False)
  const isAdminPage = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname.startsWith("/login");

  // 2. Agar logged in hai aur login page par hai, toh seedha Admin bhejo
  if (isLoginPage && isAuth) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // 3. Agar logged in NAHI hai aur Admin khol raha hai, toh bahar pheko
  if (isAdminPage && !isAuth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 4. Sab theek hai toh rasta saaf karo
  return NextResponse.next();
}

// Sirf in 2 jagaho par ye Guard khada rahega
export const config = {
  matcher: ["/admin/:path*", "/login"],
};