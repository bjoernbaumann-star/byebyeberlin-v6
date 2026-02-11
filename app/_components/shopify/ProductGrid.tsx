"use client";

import React from "react";
import type { ShopifyProduct } from "../../../lib/shopify-types";
import { useCart } from "../cart/CartContext";
import ShopifyBuyButton from "./ShopifyBuyButton";

function formatEUR(amount: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ProductGrid({ products }: { products: ShopifyProduct[] }) {
  const cart = useCart();

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <article
          key={p.id}
          className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_30px_80px_-60px_rgba(0,0,0,.65)]"
        >
          {p.images?.[0]?.url && (
            <div className="mb-4 overflow-hidden rounded-2xl border border-black/10 bg-neutral-50">
              {/* Use <img> to avoid Next remotePatterns config for Shopify CDN */}
              <img
                src={p.images[0].url}
                alt={p.images[0].altText ?? p.title}
                className="h-56 w-full object-cover"
                loading="lazy"
              />
            </div>
          )}
          <div className="font-sangbleu text-xl font-bold">{p.title}</div>
          <div className="mt-2 text-sm text-neutral-600">{p.handle}</div>
          <div className="mt-6 flex items-center justify-between gap-3">
            <div className="text-sm text-neutral-800">
              {formatEUR(Number(p.priceRange.minVariantPrice.amount))}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => cart.add(p, 1)}
                className="rounded-full border border-black/10 bg-white px-4 py-2 font-sangbleu text-xs font-bold uppercase tracking-[0.25em] text-neutral-950 hover:bg-neutral-50"
              >
                Add
              </button>
              <ShopifyBuyButton product={p} />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

