"use client";

import React from "react";
import type { ShopifyImage } from "../../../lib/shopify-types";
import type { ShopifyProduct } from "../../../lib/shopify-types";
import { useCart } from "../cart/CartContext";

function ProductImageGallery({
  images = [],
  alt = "Produkt",
}: {
  images?: ShopifyImage[] | null;
  alt?: string;
}) {
  const safeImages = Array.isArray(images) ? images : [];
  const [activeIndex, setActiveIndex] = React.useState(0);
  const clampedIndex =
    safeImages.length === 0 ? 0 : Math.min(Math.max(0, activeIndex), Math.max(0, safeImages.length - 1));
  const currentImage = safeImages[clampedIndex];

  return (
    <div className="relative h-full w-full">
      {currentImage?.url ? (
        <img
          src={currentImage.url}
          alt={currentImage.altText ?? alt ?? "Produkt"}
          className="h-full w-full rounded-none border-0 object-cover object-center"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-neutral-400">
          Kein Bild
        </div>
      )}
    </div>
  );
}

export function ProductDetailAddToCart({
  product,
  className,
}: {
  product: ShopifyProduct | null | undefined;
  className?: string;
}) {
  const cart = useCart();
  const [justAdded, setJustAdded] = React.useState(false);
  const canAdd = product != null && product.firstVariantId != null && product.firstVariantId !== "";

  const handleClick = () => {
    if (!product) return;
    cart.add(product, 1);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2000);
  };

  if (product == null) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!canAdd}
      className={className}
      aria-label={justAdded ? "In den Warenkorb gelegt" : "Zum Warenkorb hinzufügen"}
    >
      {justAdded ? "✓ Hinzugefügt" : "Zum Warenkorb hinzufügen"}
    </button>
  );
}

export default function ProductDetailClient({
  images = [],
  alt = "Produkt",
}: {
  images?: ShopifyImage[] | null;
  alt?: string;
}) {
  return <ProductImageGallery images={images} alt={alt} />;
}
