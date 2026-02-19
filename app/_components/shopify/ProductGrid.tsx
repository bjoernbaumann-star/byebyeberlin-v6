"use client";

import React from "react";
import Link from "next/link";

function cn(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}
import type { ShopifyProduct } from "../../../lib/shopify-types";
import type { CartContextValue } from "../cart/CartContext";
import { useCart } from "../cart/CartContext";
import ButtonCta from "./ButtonCta";

function formatPrice(amount: number, currencyCode: string) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: currencyCode || "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function findVariantByOption(
  product: ShopifyProduct,
  optionName: string,
  value: string,
): string | null {
  const variants = product.variants ?? [];
  for (const v of variants) {
    const opt = v.selectedOptions?.find(
      (o) => o.name.toLowerCase() === optionName.toLowerCase() && o.value === value,
    );
    if (opt) return v.id;
  }
  return null;
}

function ProductCard({
  product,
  cart,
}: {
  product: ShopifyProduct;
  cart: CartContextValue;
}) {
  const [justAdded, setJustAdded] = React.useState(false);
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const images = product.images ?? [];

  const sizeOption = product.options?.find(
    (o) =>
      o.name.toLowerCase().includes("size") ||
      o.name.toLowerCase().includes("größe") ||
      o.name.toLowerCase().includes("grosse"),
  );
  const sizeValues = sizeOption?.values ?? [];
  const effectiveVariantId =
    selectedSize && sizeOption
      ? findVariantByOption(product, sizeOption.name, selectedSize)
      : product.firstVariantId;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    cart.add(product, 1, effectiveVariantId ?? undefined);
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
      {sizeValues.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {sizeValues.map((val) => (
            <button
              key={val}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedSize(val);
              }}
              className={cn(
                "rounded-none border px-2 py-1 text-xs font-medium transition-colors",
                selectedSize === val
                  ? "border-neutral-950 bg-neutral-950 text-white"
                  : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-500",
              )}
            >
              {val}
            </button>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={handleAdd}
        disabled={!effectiveVariantId}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group/btn relative mt-2 flex w-full items-center justify-center rounded-none border border-black bg-transparent py-1 transition-[filter,background-color] duration-200 hover:bg-neutral-950 disabled:opacity-50"
        aria-label={justAdded ? "In den Warenkorb gelegt" : "In den Warenkorb"}
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

      <div className="grid grid-cols-2 gap-x-[10px] gap-y-[40px] md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} cart={cart} />
        ))}
      </div>
    </div>
  );
}
