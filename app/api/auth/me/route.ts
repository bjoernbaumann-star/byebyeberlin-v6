import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { CUSTOMER_TOKEN_COOKIE } from "../_constants";
import { getCustomerByAccessToken } from "../../../../lib/shopify";

export async function GET() {
  const token = cookies().get(CUSTOMER_TOKEN_COOKIE)?.value;
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
    const message = err instanceof Error ? err.message : "Unknown error";
    // token invalid/expired → clear cookie
    const res = NextResponse.json({ loggedIn: false, error: message }, { status: 200 });
    res.cookies.delete(CUSTOMER_TOKEN_COOKIE);
    return res;
  }
}

