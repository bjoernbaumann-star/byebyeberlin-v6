import { NextResponse } from "next/server";
import { CUSTOMER_TOKEN_COOKIE } from "../_constants";
import { customerAccessTokenCreate, customerCreate } from "../../../../lib/shopify";
import { isShopifyConfigErrorMessage, toErrorMessage } from "../../_utils/shopify-errors";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      email?: string;
      password?: string;
      firstName?: string;
      lastName?: string;
    };

    const email = (body.email ?? "").trim().toLowerCase();
    const password = body.password ?? "";
    const firstName = (body.firstName ?? "").trim();
    const lastName = (body.lastName ?? "").trim();

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Please choose a password with at least 8 characters." },
        { status: 400 },
      );
    }

    await customerCreate({ email, password, firstName: firstName || undefined, lastName: lastName || undefined });

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
    const status = isShopifyConfigErrorMessage(message) ? 503 : 400;
    const userMessage = isShopifyConfigErrorMessage(message)
      ? "Shop is not configured yet. Please try again later."
      : message;
    return NextResponse.json({ error: userMessage }, { status });
  }
}

