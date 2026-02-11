import { NextResponse } from "next/server";
import { getStorefrontProducts } from "../../../../lib/shopify";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const products = await getStorefrontProducts(24);
    console.log("API Hit - Products found:", products.length);
    return NextResponse.json({ products }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ products: [], error: message }, { status: 500 });
  }
}

