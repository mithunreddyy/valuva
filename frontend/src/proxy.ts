/**
 * Next.js 2025 Proxy Configuration
 * Production-ready API proxy for backend requests
 *
 * Note: This proxy is optional. The frontend makes direct API calls via axios.
 * If you need API proxying, implement it here. Otherwise, this satisfies Next.js requirements.
 */

import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy function for Next.js 2025
 * Exports proxy function as required by Next.js 16
 *
 * Since we're using direct API calls via axios, this proxy
 * simply passes through requests. Implement actual proxying
 * if needed for CORS or other requirements.
 */
export function proxy(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const pathname = request.nextUrl.pathname;

  // Auth pages - redirect authenticated users away
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/verify-email");

  // Protected pages - require authentication
  const isProtectedPage =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/checkout");

  // Redirect authenticated users away from auth pages
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users from protected pages
  if (isProtectedPage && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

/**
 * Matcher configuration for proxy
 * Only matches API routes if proxying is needed
 */
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
