import { NextRequest, NextResponse } from "next/server";

const SITE_PASSWORD = process.env.SITE_PASSWORD;
const COOKIE_NAME = "site-auth";
const SALT = "byebyeberlin-2025";

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password + SALT);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(request: NextRequest) {
  if (!SITE_PASSWORD) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const body = await request.json().catch(() => ({}));
  const password = typeof body.password === "string" ? body.password : "";

  if (password !== SITE_PASSWORD) {
    return NextResponse.json({ ok: false, error: "Falsches Passwort" }, { status: 401 });
  }

  const token = await hashPassword(password);
  const from = request.nextUrl.searchParams.get("from") || "/";

  const res = NextResponse.json({ ok: true }, { status: 200 });
  res.cookies.set(COOKIE_NAME, token, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res;
}
