"use client";

import React from "react";
import type { ShopifyImage } from "../../../lib/shopify-types";
import type { ShopifyProduct } from "../../../lib/shopify-types";
import { useCart } from "../cart/CartContext";

function ProductImageGallery({
  images,
  alt,
}: {
  images: ShopifyImage[];
  alt: string;
}) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const currentImage = images[activeIndex];

  return (
    <div className="relative h-full w-full">
      {currentImage?.url && (
        <img
          src={currentImage.url}
          alt={currentImage.altText ?? alt}
          className="h-full w-full rounded-none border-0 object-cover object-center"
        />
      )}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                i === activeIndex ? "bg-neutral-950" : "bg-white/60 hover:bg-white/80"
              }`}
              aria-label={`Bild ${i + 1} anzeigen`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AddToCartButton({
  product,
  className,
}: {
  product: ShopifyProduct;
  className?: string;
}) {
  const cart = useCart();
  const [justAdded, setJustAdded] = React.useState(false);

  const handleClick = () => {
    cart.add(product, 1);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!product.firstVariantId}
      className={className}
      aria-label={justAdded ? "In den Warenkorb gelegt" : "Zum Warenkorb hinzufügen"}
    >
      {justAdded ? "✓ Hinzugefügt" : "Zum Warenkorb hinzufügen"}
    </button>
  );
}

export default function ProductDetailClient({
  images,
  alt,
}: {
  images: ShopifyImage[];
  alt: string;
}) {
  return <ProductImageGallery images={images} alt={alt} />;
}

ProductDetailClient.AddToCart = AddToCartButton;
