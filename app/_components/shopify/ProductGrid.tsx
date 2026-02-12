"use client";

import React from "react";
import type { ShopifyProduct } from "../../../lib/shopify-types";
import type { CartContextValue } from "../cart/CartContext";
import { useCart } from "../cart/CartContext";

function AddToBagButton({
  product,
  cart,
}: {
  product: ShopifyProduct;
  cart: CartContextValue;
}) {
  const [justAdded, setJustAdded] = React.useState(false);

  const handleAdd = () => {
    cart.add(product, 1);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={!product.firstVariantId}
      className="rounded-full bg-neutral-950 px-4 py-2 font-sangbleu text-xs font-bold uppercase tracking-[0.25em] text-white hover:bg-neutral-800 disabled:opacity-50 transition-colors"
    >
      {justAdded ? "ADDED TO BAG" : "Add to Bag"}
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
          Shop is temporarily unavailable. Please try again later.
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
          <div className="polaroid-frame mb-4">
            {p.images?.[0]?.url ? (
              <img
                src={p.images[0].url}
                alt={p.images[0].altText ?? p.title}
                className="polaroid-image"
                loading="lazy"
              />
            ) : (
              <div className="polaroid-image flex items-center justify-center bg-neutral-200 text-sm text-neutral-500">
                No image
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
              <AddToBagButton product={p} cart={cart} />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

