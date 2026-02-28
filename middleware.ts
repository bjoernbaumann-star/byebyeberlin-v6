import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SITE_PASSWORD = process.env.SITE_PASSWORD;
const COOKIE_NAME = "site-auth";
const SALT = "byebyeberlin-2025";

async function getAuthToken(): Promise<string | null> {
  if (!SITE_PASSWORD) return null;
  try {
    const data = new TextEncoder().encode(SITE_PASSWORD + SALT);
    const buf = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  if (!SITE_PASSWORD) {
    return NextResponse.next();
  }

  const token = await getAuthToken();
  if (!token) return NextResponse.next();

  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  if (cookie === token) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  if (pathname === "/site-password" || pathname.startsWith("/api/site-auth")) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/site-password";
  url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
