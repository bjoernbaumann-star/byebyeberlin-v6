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

  return (
    <div className="flex w-full flex-col gap-0">
      {safeImages.length === 0 ? (
        <div className="flex aspect-[3/4] w-full items-center justify-center bg-neutral-100 text-neutral-400">
          Kein Bild
        </div>
      ) : (
        safeImages.map((img, i) =>
          img?.url ? (
            <div key={i} className="relative aspect-[3/4] w-full overflow-hidden">
              <img
                src={img.url}
                alt={img.altText ?? alt ?? "Produkt"}
                className="h-full w-full rounded-none border-0 object-cover object-center"
              />
            </div>
          ) : null,
        )
      )}
    </div>
  );
}

function isSizeOption(name: string | undefined): boolean {
  if (!name) return false;
  const n = name.trim().toLowerCase();
  return /^(size|gr[oö]s?se|gr[oö][sß]e)$/i.test(n);
}

function isColorOption(name: string | undefined): boolean {
  if (!name) return false;
  const n = name.trim().toLowerCase();
  return /^(color|farbe|colour)$/i.test(n);
}

function findVariantByOptions(
  variants: Array<{ id: string; selectedOptions?: Array<{ name: string; value: string }> }>,
  selections: Array<{ name: string; value: string }>,
): { id: string } | null {
  if (selections.length === 0) return null;
  return (
    variants.find((v) =>
      selections.every((sel) =>
        v.selectedOptions?.some((o) => o.name === sel.name && o.value === sel.value),
      ),
    ) ?? null
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
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);

  const sizeOption = product?.options?.find((o) => isSizeOption(o?.name));
  const colorOption = product?.options?.find((o) => isColorOption(o?.name));
  const sizeValues = sizeOption?.values?.filter(Boolean) ?? [];
  const colorValues = colorOption?.values?.filter(Boolean) ?? [];
  const variants = product?.variants ?? [];

  const selections = [
    ...(selectedSize && sizeOption ? [{ name: sizeOption.name, value: selectedSize }] : []),
    ...(selectedColor && colorOption ? [{ name: colorOption.name, value: selectedColor }] : []),
  ];
  const variantMatch = selections.length > 0 ? findVariantByOptions(variants, selections) : null;
  const variantId =
    variantMatch?.id ??
    (sizeValues.length > 0 || colorValues.length > 0 ? null : product?.firstVariantId ?? null);
  const canAdd = product != null && variantId != null && variantId !== "";

  React.useEffect(() => {
    if (sizeValues.length === 1 && !selectedSize) setSelectedSize(sizeValues[0]);
    if (colorValues.length === 1 && !selectedColor) setSelectedColor(colorValues[0]);
  }, [sizeValues, colorValues]);

  const handleClick = () => {
    if (!product || !variantId) return;
    cart.add(product, 1, variantId);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2000);
  };

  if (product == null) return null;

  return (
    <div className={className ?? ""}>
      {colorOption && colorValues.length > 0 && (
        <div className="font-sangbleu mb-4">
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-600">
            {colorOption.name}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {colorValues.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setSelectedColor(val)}
                className={`rounded-none border px-2 py-1 text-xs font-medium transition-colors ${
                  selectedColor === val
                    ? "border-neutral-950 bg-neutral-950 text-white"
                    : "border-neutral-300 bg-transparent text-neutral-950 hover:border-neutral-950"
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      )}
      {sizeOption && sizeValues.length > 0 && (
        <div className="font-sangbleu mb-4">
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-600">
            {sizeOption.name}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {sizeValues.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setSelectedSize(val)}
                className={`rounded-none border px-2 py-1 text-xs font-medium transition-colors ${
                  selectedSize === val
                    ? "border-neutral-950 bg-neutral-950 text-white"
                    : "border-neutral-300 bg-transparent text-neutral-950 hover:border-neutral-950"
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={handleClick}
        disabled={!canAdd}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group/btn relative flex w-full items-center justify-center rounded-none border border-black bg-transparent py-1 transition-[filter,background-color] duration-200 hover:bg-neutral-950 disabled:opacity-50"
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
    </div>
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
