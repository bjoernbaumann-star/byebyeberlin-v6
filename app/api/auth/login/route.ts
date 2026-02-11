import { NextResponse } from "next/server";
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
    const body = (await req.json()) as { email?: string };
    const email = (body.email ?? "").trim().toLowerCase();

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Bitte gib eine gültige E‑Mail ein." }, { status: 400 });
    }

    const shopifyLoginUrl = getShopifyLoginUrl();
    if (!shopifyLoginUrl) {
      return NextResponse.json(
        { error: "Shopify ist noch nicht konfiguriert. Bitte versuche es später erneut." },
        { status: 503 },
      );
    }

    const urlWithEmail = `${shopifyLoginUrl}?email=${encodeURIComponent(email)}`;
    return NextResponse.json({ ok: true, redirectTo: urlWithEmail }, { status: 200 });
  } catch (err) {
    const message = toErrorMessage(err);
    const status = isShopifyConfigErrorMessage(message) ? 503 : 401;
    const userMessage = isShopifyConfigErrorMessage(message)
      ? "Shop ist noch nicht konfiguriert. Bitte versuche es später erneut."
      : message;
    return NextResponse.json({ error: userMessage }, { status });
  }
}

