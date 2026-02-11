import { NextResponse } from "next/server";
import { CUSTOMER_TOKEN_COOKIE } from "../_constants";

export async function POST() {
  const res = NextResponse.json({ ok: true }, { status: 200 });
  res.cookies.delete(CUSTOMER_TOKEN_COOKIE);
  return res;
}

