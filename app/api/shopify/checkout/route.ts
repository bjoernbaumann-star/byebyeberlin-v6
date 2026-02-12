import { NextResponse } from "next/server";
import { createCartWithLinesAndGetCheckoutUrl } from "../../../../lib/shopify";

export const dynamic = "force-dynamic";

type LineInput = { merchandiseId?: string; quantity?: number };

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>;

    let lines: Array<{ merchandiseId: string; quantity: number }>;
    const bodyLines = body.lines as LineInput[] | undefined;

    if (Array.isArray(bodyLines) && bodyLines.length > 0) {
      lines = bodyLines
        .filter((l) => l.merchandiseId?.startsWith("gid://shopify/ProductVariant/"))
        .map((l) => ({
          merchandiseId: l.merchandiseId!,
          quantity: Math.max(1, Math.min(99, Math.floor(l.quantity ?? 1))),
        }));
    } else if (typeof body.merchandiseId === "string") {
      lines = [
        {
          merchandiseId: body.merchandiseId as string,
          quantity: Math.max(1, Math.min(99, Math.floor((body.quantity as number) ?? 1))),
        },
      ];
    } else {
      return NextResponse.json({ error: "merchandiseId oder lines erforderlich." }, { status: 400 });
    }

    if (lines.length === 0) {
      return NextResponse.json({ error: "Keine gültigen Varianten." }, { status: 400 });
    }

    const checkoutUrl = await createCartWithLinesAndGetCheckoutUrl(lines);
    return NextResponse.json({ checkoutUrl }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unbekannter Fehler";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
