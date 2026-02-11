import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { CUSTOMER_TOKEN_COOKIE } from "../auth/_constants";
import { getCustomerByAccessToken } from "../../../lib/shopify";
import { isShopifyConfigErrorMessage, toErrorMessage } from "../_utils/shopify-errors";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  try {
    const customer = await getCustomerByAccessToken(token, { ordersFirst: 10, addressesFirst: 20 });
    return NextResponse.json({ customer }, { status: 200 });
  } catch (err) {
    const message = toErrorMessage(err);
    const isConfig = isShopifyConfigErrorMessage(message);
    const userMessage = isConfig ? "Shop ist noch nicht konfiguriert." : message;
    const res = NextResponse.json({ error: userMessage }, { status: isConfig ? 503 : 401 });
    if (!isConfig) res.cookies.delete(CUSTOMER_TOKEN_COOKIE);
    return res;
  }
}

