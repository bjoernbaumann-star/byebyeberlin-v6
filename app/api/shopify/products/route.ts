import { NextResponse } from "next/server";
import { getStorefrontProducts } from "../../../../lib/shopify";
import { isShopifyConfigErrorMessage } from "../../_utils/shopify-errors";

export async function GET() {
  try {
    const products = await getStorefrontProducts(24);
    return NextResponse.json({ products }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (isShopifyConfigErrorMessage(message)) {
      return NextResponse.json({ products: [] }, { status: 200 });
    }
    return NextResponse.json({ products: [], error: message }, { status: 500 });
  }
}

