import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { CUSTOMER_TOKEN_COOKIE } from "../auth/_constants";
import { getCustomerByAccessToken } from "../../../lib/shopify";

export async function GET() {
  const token = cookies().get(CUSTOMER_TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  try {
    const customer = await getCustomerByAccessToken(token, { ordersFirst: 10, addressesFirst: 20 });
    return NextResponse.json({ customer }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const res = NextResponse.json({ error: message }, { status: 401 });
    res.cookies.delete(CUSTOMER_TOKEN_COOKIE);
    return res;
  }
}

