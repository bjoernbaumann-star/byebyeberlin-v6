import { NextResponse } from "next/server";
import { CUSTOMER_TOKEN_COOKIE } from "../_constants";
import { customerAccessTokenCreate } from "../../../../lib/shopify";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string; password?: string };
    const email = (body.email ?? "").trim().toLowerCase();
    const password = body.password ?? "";

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Bitte gib eine gültige E‑Mail ein." }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ error: "Bitte gib dein Passwort ein." }, { status: 400 });
    }

    const token = await customerAccessTokenCreate({ email, password });
    const expires = new Date(token.expiresAt);

    const res = NextResponse.json({ ok: true }, { status: 200 });
    res.cookies.set({
      name: CUSTOMER_TOKEN_COOKIE,
      value: token.accessToken,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires,
    });
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    // Surface Shopify auth errors clearly (especially when New Customer Accounts blocks classic tokens)
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

