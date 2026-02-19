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
  const images = product.images ?? [];

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
    <article className="group overflow-hidden !rounded-none !border-0 !shadow-none ring-0">
      <div className="relative">
        <Link href={`/produkt/${product.handle}`} className="block overflow-hidden !rounded-none">
          <div className="product-card-image relative aspect-[3/4] overflow-hidden !rounded-none !border-0 bg-transparent p-0">
            {images[0]?.url ? (
              <>
                <img
                  src={images[0]?.url}
                  alt={images[0]?.altText ?? product.title}
                  className="h-full w-full !rounded-none object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
                  style={{ border: "none", borderRadius: 0 }}
                  loading="lazy"
                />
                {images[1]?.url && (
                  <img
                    src={images[1]?.url}
                    alt={images[1]?.altText ?? product.title}
                    className="absolute inset-0 h-full w-full !rounded-none object-cover object-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ border: "none", borderRadius: 0 }}
                    loading="lazy"
                  />
                )}
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-none bg-neutral-100 text-sm text-neutral-500">
                No image
              </div>
            )}
          </div>
        </Link>
      </div>
      <Link href={`/produkt/${product.handle}`} className="mt-2 block">
        <p className="text-sm text-neutral-600">{priceStr}</p>
      </Link>
      <button
        type="button"
        onClick={handleAdd}
        disabled={!product.firstVariantId}
        className="mt-2 w-full border border-neutral-950 bg-white py-2.5 text-xs font-medium uppercase tracking-wider text-neutral-950 transition-colors hover:bg-neutral-950 hover:text-white disabled:opacity-50"
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
      <div className="mb-6">
        <p className="font-sangbleu text-sm font-medium text-neutral-600">
          {products.length} PRODUKTE
        </p>
      </div>

      <div className="grid grid-cols-2 gap-[10px] md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} cart={cart} />
        ))}
      </div>
    </div>
  );
}
