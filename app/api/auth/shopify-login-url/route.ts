import { NextResponse } from "next/server";

function getShopDomain() {
  const domain =
    process.env.SHOPIFY_STORE_DOMAIN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
    "";
  if (!domain) return null;
  return domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export async function GET() {
  const domain = getShopDomain();
  if (!domain) {
    return NextResponse.json({ url: null }, { status: 200 });
  }

  // Hosted Shopify login page (sends email code / verification for New Customer Accounts).
  const url = `https://${domain}/account/login`;
  return NextResponse.json({ url }, { status: 200 });
}
