import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { CUSTOMER_TOKEN_COOKIE } from "../../auth/_constants";
import {
  customerAddressCreate,
  customerAddressDelete,
  customerDefaultAddressUpdate,
  getCustomerByAccessToken,
} from "../../../../lib/shopify";
import { isShopifyConfigErrorMessage, toErrorMessage } from "../../_utils/shopify-errors";

type Action =
  | { action: "add"; address: Record<string, unknown> }
  | { action: "delete"; addressId: string }
  | { action: "setDefault"; addressId: string };

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_TOKEN_COOKIE)?.value;
  if (!token) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  try {
    const body = (await req.json()) as Action;

    if (body.action === "add") {
      await customerAddressCreate(token, body.address as any);
    } else if (body.action === "delete") {
      await customerAddressDelete(token, body.addressId);
    } else if (body.action === "setDefault") {
      await customerDefaultAddressUpdate(token, body.addressId);
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const customer = await getCustomerByAccessToken(token, { ordersFirst: 10, addressesFirst: 20 });
    return NextResponse.json({ customer }, { status: 200 });
  } catch (err) {
    const message = toErrorMessage(err);
    const status = isShopifyConfigErrorMessage(message) ? 503 : 400;
    const userMessage = isShopifyConfigErrorMessage(message)
      ? "Shop is not configured yet."
      : message;
    return NextResponse.json({ error: userMessage }, { status });
  }
}

