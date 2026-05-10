import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;

  // If user has token and tries to access login
  if (pathname === "/login" && token) {
    try {
      // Decode JWT to get role (simple decode, not verification)
      const base64Url = token.split(".")[1];
      const decoded = JSON.parse(Buffer.from(base64Url, "base64").toString());
      const role = decoded.role;
      
      if (role === "admin") {
        return NextResponse.redirect(new URL("/admin/users", request.url));
      } else {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch {
      // If token is invalid, continue to login
    }
  }

  // If user tries to access admin routes without being admin
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    
    try {
      const base64Url = token.split(".")[1];
      const decoded = JSON.parse(Buffer.from(base64Url, "base64").toString());
      const role = decoded.role;
      
      if (role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/expenses", "/budget", "/savings", "/settings", "/recurring-expenses", "/affiliates"];
  const isProtected = protectedRoutes.some(route => pathname === route || pathname.startsWith(route + "/"));
  
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/admin/:path*",
    "/dashboard/:path*",
  ],
};
