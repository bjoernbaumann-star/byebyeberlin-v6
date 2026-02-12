import { NextResponse } from "next/server";
import { CUSTOMER_TOKEN_COOKIE } from "../_constants";
import { customerAccessTokenCreate } from "../../../../lib/shopify";
import { isShopifyConfigErrorMessage, toErrorMessage } from "../../_utils/shopify-errors";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string; password?: string };
    const email = (body.email ?? "").trim().toLowerCase();
    const password = body.password ?? "";

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ error: "Please enter your password." }, { status: 400 });
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
    const message = toErrorMessage(err);
    const status = isShopifyConfigErrorMessage(message) ? 503 : 401;
    const userMessage = isShopifyConfigErrorMessage(message)
      ? "Shop is not configured yet. Please try again later."
      : message;
    return NextResponse.json({ error: userMessage }, { status });
  }
}

