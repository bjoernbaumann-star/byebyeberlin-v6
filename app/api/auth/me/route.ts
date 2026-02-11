import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { CUSTOMER_TOKEN_COOKIE } from "../_constants";
import { getCustomerByAccessToken } from "../../../../lib/shopify";
import { isShopifyConfigErrorMessage, toErrorMessage } from "../../_utils/shopify-errors";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ loggedIn: false }, { status: 200 });
  }

  try {
    const customer = await getCustomerByAccessToken(token, { ordersFirst: 1, addressesFirst: 1 });
    return NextResponse.json(
      {
        loggedIn: true,
        firstName: customer.firstName ?? null,
      },
      { status: 200 },
    );
  } catch (err) {
    const message = toErrorMessage(err);
    const isConfig = isShopifyConfigErrorMessage(message);
    // token invalid/expired → clear cookie (but never clear on config issues)
    const res = NextResponse.json(
      { loggedIn: false, ...(isConfig ? { configError: true } : { error: message }) },
      { status: 200 },
    );
    if (!isConfig) res.cookies.delete(CUSTOMER_TOKEN_COOKIE);
    return res;
  }
}

