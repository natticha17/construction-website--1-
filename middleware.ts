import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  return NextResponse.next() //
  const pathname = request.nextUrl.pathname

  const customerToken = request.cookies.get("customer_token")?.value
  const adminToken = request.cookies.get("admin_token")?.value
  const isLoggedIn = !!(customerToken || adminToken)

  // Redirect from old login pages
  if (pathname === "/admin/login" || pathname === "/customer/login") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Handle protected routes
  if (pathname.startsWith("/customer") && pathname !== "/customer/register") {
    if (!customerToken) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  if (pathname.startsWith("/admin")) {
    if (!adminToken) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // If already logged in, don't show login page
  if (pathname === "/login" && isLoggedIn) {
    if (adminToken) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
    return NextResponse.redirect(new URL("/customer/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/customer/:path*", "/admin/:path*", "/login"],
}
