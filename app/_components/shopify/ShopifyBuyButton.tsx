"use client";

import React from "react";
import type { ShopifyProduct } from "../../../lib/shopify-types";

function cn(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

export default function ShopifyBuyButton({
  product,
  className,
}: {
  product: ShopifyProduct;
  className?: string;
}) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleBuyNow = async () => {
    const variantId = product.firstVariantId;
    if (!variantId) {
      setError("Product not available");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/shopify/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchandiseId: variantId, quantity: 1 }),
      });
      const json = (await res.json()) as { checkoutUrl?: string; error?: string };
      if (!res.ok) {
        throw new Error(json.error ?? "Checkout failed");
      }
      if (json.checkoutUrl) {
        window.location.href = json.checkoutUrl;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
      setLoading(false);
    }
  };

  return (
    <div className={cn("inline-flex flex-col items-center", className)}>
      <button
        type="button"
        onClick={handleBuyNow}
        disabled={!product.firstVariantId || loading}
        className={cn(
          "inline-flex h-12 items-center justify-center px-8",
          "bg-neutral-950 text-white hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed",
          "font-sangbleu text-xs font-bold uppercase tracking-[0.28em]",
        )}
      >
        {loading ? "…" : "Buy"}
      </button>
      {error && (
        <div
          className="mt-2 text-xs text-red-600"
          aria-live="polite"
        >
          {error}
        </div>
      )}
    </div>
  );
}

