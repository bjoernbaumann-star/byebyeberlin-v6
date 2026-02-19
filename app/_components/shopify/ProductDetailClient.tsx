"use client";

import React from "react";
import type { ShopifyImage } from "../../../lib/shopify-types";
import type { ShopifyProduct } from "../../../lib/shopify-types";
import { useCart } from "../cart/CartContext";
import ButtonCta from "./ButtonCta";

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
  const [isHovered, setIsHovered] = React.useState(false);
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group/btn relative flex w-full items-center justify-center rounded-none border border-black bg-transparent py-1 transition-[filter,background-color] duration-200 hover:bg-neutral-950 disabled:opacity-50 ${className ?? ""}`}
      aria-label={justAdded ? "In den Warenkorb gelegt" : "Zum Warenkorb hinzufügen"}
    >
      <ButtonCta
        className="scale-[0.7] transition-[filter] duration-200 invert group-hover/btn:invert-0"
        invisible={justAdded}
        isHovered={isHovered}
      />
      {justAdded && (
        <span className="absolute inset-0 flex items-center justify-center font-sangbleu text-[16px] font-bold leading-none text-white uppercase">
          nice, nice, nice
        </span>
      )}
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
