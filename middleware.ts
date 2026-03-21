import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // function middleware (This runs AFTER the 'authorized' callback below)
  function middleware(req) {
    // If the 'authorized' callback returned true, the user is authenticated.
    // Now we perform authorization (check if they are an ADMIN).
    
    const token = req.nextauth.token;
    const adminEmail = process.env.ADMIN_EMAIL;

    // Check if user's email matches the ADMIN_EMAIL from env
    const isAdmin = token?.email === adminEmail;

    // 🌟 If user is not an admin, we hijack their request and redirect.
    if (!isAdmin) {
      // Option A: Redirect to a custom 403 Forbidden page (Cleaner)
      // return NextResponse.rewrite(new URL("/403", req.url));

      // Option B: Redirect back home (Simpler)
      return NextResponse.redirect(new URL("/", req.url));
    }

    // 🌟 If all checks pass, allow the request to continue.
    return NextResponse.next();
  },
  {
    callbacks: {
      // This function determines if the user is authenticated at all.
      // Returns true if token exists, false otherwise.
      authorized: ({ token }) => !!token,
    },
  }
);

// 🛡️ DEFINING THE PROTECTED ROUTES (matcher)
export const config = {
  // Add all paths that must require ADMIN access here.
  matcher: [
    "/godmode/:path*", // Protect dashboard and all subpages
    "/api/admin/:path*", // Protect admin APIs (like user stats)
    // List other sensitive API routes if needed:
    // "/api/products/create", 
    // "/api/products/delete",
  ],
};