"use client";

import React from "react";
import Link from "next/link";
import type { ShopifyProduct } from "../../../lib/shopify-types";
import type { CartContextValue } from "../cart/CartContext";
import { useCart } from "../cart/CartContext";

function formatPrice(amount: number, currencyCode: string) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: currencyCode || "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function ProductCard({
  product,
  cart,
}: {
  product: ShopifyProduct;
  cart: CartContextValue;
}) {
  const [justAdded, setJustAdded] = React.useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    cart.add(product, 1);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  const priceStr = formatPrice(
    Number(product.priceRange.minVariantPrice.amount),
    product.priceRange.minVariantPrice.currencyCode
  );

  return (
    <article className="group border-0 ring-0">
      <Link href={`/produkt/${product.handle}`} className="block">
        <div className="aspect-[3/4] overflow-hidden rounded-none border-0 bg-transparent p-0">
          {product.images?.[0]?.url ? (
            <img
              src={product.images[0].url}
              alt={product.images[0].altText ?? product.title}
              className="h-full w-full rounded-none object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-none bg-neutral-100 text-sm text-neutral-500">
              No image
            </div>
          )}
        </div>
        <div className="mt-4 space-y-1">
          <h3 className="font-sangbleu text-sm font-medium text-neutral-950">
            {product.title}
          </h3>
          <p className="text-sm text-neutral-600">{priceStr}</p>
          {/* Color swatches – Platzhalter für spätere Varianten-Optionen */}
          <div className="mt-2 flex items-center gap-1.5">
            <span className="h-3 w-3 shrink-0 rounded-full border border-neutral-300 bg-neutral-200" />
          </div>
        </div>
      </Link>
      <button
        type="button"
        onClick={handleAdd}
        disabled={!product.firstVariantId}
        className="mt-3 w-full border border-neutral-950 bg-white py-2.5 text-xs font-medium uppercase tracking-wider text-neutral-950 transition-colors hover:bg-neutral-950 hover:text-white disabled:opacity-50"
        aria-label={justAdded ? "In den Warenkorb gelegt" : "In den Warenkorb"}
      >
        {justAdded ? "✓ Hinzugefügt" : "+ In den Warenkorb"}
      </button>
    </article>
  );
}

export default function ProductGrid({ products }: { products: ShopifyProduct[] }) {
  const cart = useCart();

  if (!products.length) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-12 text-center">
        <p className="text-neutral-600">Keine Produkte gefunden</p>
        <p className="mt-2 text-sm text-neutral-500">
          Der Shop ist vorübergehend nicht verfügbar.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="font-sangbleu text-sm font-medium text-neutral-600">
          {products.length} PRODUKTE
        </p>
        <div className="flex items-center gap-4 text-sm text-neutral-500">
          <button type="button" className="hover:text-neutral-950">
            Filtern nach
          </button>
          <span>|</span>
          <button type="button" className="hover:text-neutral-950">
            Sortieren nach: Empfehlungen
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} cart={cart} />
        ))}
      </div>
    </div>
  );
}
