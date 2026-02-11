import { NextResponse } from "next/server";
import { customerCreate } from "../../../../lib/shopify";
import { isShopifyConfigErrorMessage, toErrorMessage } from "../../_utils/shopify-errors";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getShopifyLoginUrl(): string | null {
  const domain =
    process.env.SHOPIFY_STORE_DOMAIN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
    "";
  if (!domain) return null;
  const clean = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return `https://${clean}/account/login`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      email?: string;
      firstName?: string;
      lastName?: string;
    };

    const email = (body.email ?? "").trim().toLowerCase();
    const firstName = (body.firstName ?? "").trim();
    const lastName = (body.lastName ?? "").trim();

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Bitte gib eine gültige E‑Mail ein." }, { status: 400 });
    }

    await customerCreate({ email, firstName: firstName || undefined, lastName: lastName || undefined });

    const shopifyLoginUrl = getShopifyLoginUrl();
    return NextResponse.json(
      { ok: true, shopifyLoginUrl: shopifyLoginUrl ?? null, email },
      { status: 200 },
    );
  } catch (err) {
    const message = toErrorMessage(err);
    const status = isShopifyConfigErrorMessage(message) ? 503 : 400;
    const userMessage = isShopifyConfigErrorMessage(message)
      ? "Shop ist noch nicht konfiguriert. Bitte versuche es später erneut."
      : message;
    return NextResponse.json({ error: userMessage }, { status });
  }
}

