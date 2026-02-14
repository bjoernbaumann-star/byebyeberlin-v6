"use client";

import React from "react";
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

function ArchiveGridCell({
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
    <article className="archive-grid-cell">
      <div className="archive-cell-patina">
        <div className="archive-cell-image-wrap">
          {product.images?.[0]?.url ? (
            <img
              src={product.images[0].url}
              alt={product.images[0].altText ?? product.title}
              className="archive-cell-image"
              loading="lazy"
            />
          ) : (
            <div className="archive-cell-image archive-cell-image-placeholder">
              No image
            </div>
          )}
        </div>
      </div>

      <div className="archive-cell-info">
        <span className="archive-cell-title">{product.title.toUpperCase()}</span>
        <span className="archive-cell-price">{priceStr}</span>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={!product.firstVariantId}
        className="archive-cell-add"
        aria-label={justAdded ? "Added to bag" : "Add to bag"}
      >
        {justAdded ? "✓" : "+"}
      </button>
    </article>
  );
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
    <div className="archive-grid">
      {products.map((p) => (
        <ArchiveGridCell key={p.id} product={p} cart={cart} />
      ))}
    </div>
  );
}
