import { NextResponse } from "next/server";
import { getStorefrontProductsSafe } from "../../../../lib/shopify";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const products = await getStorefrontProductsSafe(24);
  return NextResponse.json({ products }, { status: 200 });
}

