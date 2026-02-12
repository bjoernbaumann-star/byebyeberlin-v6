"use client";

import React from "react";
import type { ShopifyProduct } from "../../../lib/shopify-types";
import type { CartContextValue } from "../cart/CartContext";
import { useCart } from "../cart/CartContext";
import ShopifyBuyButton from "./ShopifyBuyButton";

function AddToCartButton({
  product,
  cart,
}: {
  product: ShopifyProduct;
  cart: CartContextValue;
}) {
  const [loading, setLoading] = React.useState(false);
  const handleAddAndCheckout = async () => {
    if (!product.firstVariantId) return;
    const updatedLines = cart.lines.some((l) => l.product.id === product.id)
      ? cart.lines.map((l) =>
          l.product.id === product.id ? { ...l, qty: l.qty + 1 } : l,
        )
      : [...cart.lines, { product, qty: 1 }];
    const linesWithNew: Array<{ merchandiseId: string; quantity: number }> =
      updatedLines
        .filter((l) => l.product.firstVariantId)
        .map((l) => ({
          merchandiseId: l.product.firstVariantId!,
          quantity: l.qty,
        }));
    cart.add(product, 1);

    setLoading(true);
    try {
      const res = await fetch("/api/shopify/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines: linesWithNew }),
      });
      const json = (await res.json()) as { checkoutUrl?: string; error?: string };
      if (json.checkoutUrl) {
        cart.clear();
        window.location.href = json.checkoutUrl;
      } else {
        throw new Error(json.error ?? "Checkout fehlgeschlagen");
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleAddAndCheckout}
      disabled={!product.firstVariantId || loading}
      className="rounded-full border border-black/10 bg-white px-4 py-2 font-sangbleu text-xs font-bold uppercase tracking-[0.25em] text-neutral-950 hover:bg-neutral-50 disabled:opacity-50"
    >
      {loading ? "…" : "Add to Cart"}
    </button>
  );
}

function formatPrice(amount: number, currencyCode: string) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: currencyCode || "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ProductGrid({ products }: { products: ShopifyProduct[] }) {
  const cart = useCart();

  if (!products.length) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-12 text-center">
        <p className="text-neutral-600">No Products Found</p>
        <p className="mt-2 text-sm text-neutral-500">
          Shop ist vorübergehend nicht erreichbar. Bitte versuche es später erneut.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <article
          key={p.id}
          className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_30px_80px_-60px_rgba(0,0,0,.65)]"
        >
          <div className="mb-4 overflow-hidden rounded-2xl border border-black/10 bg-neutral-50">
            {p.images?.[0]?.url ? (
              <img
                src={p.images[0].url}
                alt={p.images[0].altText ?? p.title}
                className="h-56 w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-56 w-full items-center justify-center bg-neutral-100 text-sm text-neutral-400">
                Kein Bild
              </div>
            )}
          </div>
          <div className="font-sangbleu text-xl font-bold">{p.title}</div>
          <div className="mt-2 text-sm text-neutral-600">{p.handle}</div>
          <div className="mt-6 flex items-center justify-between gap-3">
            <div className="text-sm text-neutral-800">
              {formatPrice(Number(p.priceRange.minVariantPrice.amount), p.priceRange.minVariantPrice.currencyCode)}
            </div>
            <div className="flex items-center gap-2">
              <AddToCartButton product={p} cart={cart} />
              <ShopifyBuyButton product={p} />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

