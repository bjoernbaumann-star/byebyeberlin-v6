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
  const [showSoon, setShowSoon] = React.useState(false);

  return (
    <div className={cn("inline-flex flex-col items-center", className)}>
      <button
        type="button"
        onClick={() => {
          if (product.onlineStoreUrl) {
            window.open(product.onlineStoreUrl, "_blank", "noopener,noreferrer");
            return;
          }
          setShowSoon(true);
          window.setTimeout(() => setShowSoon(false), 1600);
        }}
        className={cn(
          "inline-flex h-12 items-center justify-center px-8",
          "bg-neutral-950 text-white hover:bg-neutral-900",
          "font-sangbleu text-xs font-bold uppercase tracking-[0.28em]",
        )}
      >
        Buy
      </button>
      <div
        className={cn(
          "mt-2 text-xs tracking-wide text-neutral-600 transition-opacity",
          showSoon ? "opacity-100" : "opacity-0",
        )}
        aria-live="polite"
      >
        Coming soon
      </div>
    </div>
  );
}

