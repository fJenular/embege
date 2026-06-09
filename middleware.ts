import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SECRET_KEY = process.env.SESSION_SECRET || "default_super_secret_session_key_for_catering_app_2026";

// Decode base64 - compatible with edge runtime
function base64Decode(str: string): string {
  try {
    return decodeURIComponent(
      Array.from(atob(str))
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch (e) {
    console.error("Base64 decode failed:", e);
    return "";
  }
}

// Convert text to buffer - compatible with edge runtime
function textToBuffer(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

// Import a raw key for HMAC signing and verification
async function getSigningKey(): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    "raw",
    textToBuffer(SECRET_KEY),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

interface SessionPayload {
  id: string;
  email: string;
  role: string;
  exp: number;
}

// Verify session token
async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [payloadBase64, signatureHex] = parts;
    
    // Decode payload using base64Decode
    const decodedDataStr = base64Decode(payloadBase64);
    if (!decodedDataStr) return null;

    const key = await getSigningKey();
    
    // Parse hex signature to Uint8Array
    const sigBytes = new Uint8Array(
      signatureHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
    );

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      textToBuffer(decodedDataStr)
    );

    if (!isValid) return null;

    const payload = JSON.parse(decodedDataStr) as SessionPayload;

    // Check expiration
    if (Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch (err) {
    console.error("Session verification failed:", err);
    return null;
  }
}

const redirectToLogin = (request: NextRequest) => {
  return NextResponse.redirect(new URL("/login", request.url));
};

const redirectToAdminLogin = (request: NextRequest) => {
  return NextResponse.redirect(new URL("/admin/login", request.url));
};

const redirectToRolePage = (request: NextRequest, role: string) => {
  const destination =
    role === "admin" ? "/admin" : role === "owner" ? "/owner" : "/kurir";
  return NextResponse.redirect(new URL(destination, request.url));
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const sessionToken = request.cookies.get("session_token")?.value;
  const userRole = request.cookies.get("user_role")?.value;

  // Verify session token
  const session = await verifySession(sessionToken);

  // If session is invalid or expired, user is not authenticated
  const isAuthenticated = session !== null;

  // Handle /admin/login path - should allow access even without login
  if (pathname === "/admin/login") {
    if (isAuthenticated && session?.role === "admin") {
      return redirectToRolePage(request, "admin");
    }
    return NextResponse.next();
  }

  // Handle /login path
  if (pathname === "/login") {
    if (isAuthenticated && session?.role !== "admin") {
      return redirectToRolePage(request, session!.role);
    }
    return NextResponse.next();
  }

  // Handle /daftar path - allow access without login
  if (pathname === "/daftar") {
    if (isAuthenticated && session?.role !== "admin") {
      return redirectToRolePage(request, session!.role);
    }
    return NextResponse.next();
  }

  // Handle / and /pesan paths - allow access without login but can access if logged in
  if (pathname === "/" || pathname.startsWith("/pesan") || pathname.startsWith("/pesanan")) {
    // Allow public access to these pages
    return NextResponse.next();
  }

  // Protect /admin paths - require admin role
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      return redirectToAdminLogin(request);
    }
    if (session!.role !== "admin") {
      return redirectToAdminLogin(request);
    }
    return NextResponse.next();
  }

  // Protect /owner paths - require owner role and authentication
  if (pathname.startsWith("/owner")) {
    if (!isAuthenticated) {
      return redirectToLogin(request);
    }
    if (session!.role !== "owner") {
      return redirectToLogin(request);
    }
    return NextResponse.next();
  }

  // Protect /kurir paths - require kurir role and authentication
  if (pathname.startsWith("/kurir")) {
    if (!isAuthenticated) {
      return redirectToLogin(request);
    }
    if (session!.role !== "kurir") {
      return redirectToLogin(request);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/owner/:path*",
    "/kurir/:path*",
    "/login",
    "/daftar",
    "/pesan/:path*",
    "/pesanan/:path*",
  ],
};
