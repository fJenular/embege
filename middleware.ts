import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const redirectToLogin = (request: NextRequest) => {
  return NextResponse.redirect(new URL("/login", request.url));
};

const redirectToRolePage = (request: NextRequest, role: string) => {
  const destination =
    role === "admin" ? "/admin" : role === "owner" ? "/owner" : "/kurir";
  return NextResponse.redirect(new URL(destination, request.url));
};

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const userRole = request.cookies.get("user_role")?.value;

  if (pathname === "/login") {
    if (userRole) {
      return redirectToRolePage(request, userRole);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") && userRole !== "admin") {
    return redirectToLogin(request);
  }

  if (pathname.startsWith("/owner") && userRole !== "owner") {
    return redirectToLogin(request);
  }

  if (pathname.startsWith("/kurir") && userRole !== "kurir") {
    return redirectToLogin(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/owner/:path*", "/kurir/:path*", "/login"],
};
