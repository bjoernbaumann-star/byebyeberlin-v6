"use client";

import React from "react";
import { sortSizeValues } from "../../../lib/shopify";
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
  const n = (name ?? "").trim().toLowerCase();
  return (
    n === "size" ||
    /^gr[oö]s?se$/.test(n) ||
    /^gr[oö][sß]e$/.test(n) ||
    n === "taille" ||
    n.includes("size") ||
    n.includes("größe") ||
    n.includes("grösse") ||
    n.includes("grosse")
  );
}

function looksLikeSizeValue(val: string | undefined): boolean {
  if (!val || !val.trim()) return false;
  const v = val.trim().toLowerCase();
  if (v === "default title") return false;
  const letterSizes = ["xxs", "xs", "s", "m", "l", "xl", "xxl", "2xl", "3xl", "4xl"];
  if (letterSizes.includes(v)) return true;
  if (/^one\s*size$|^os$|^single\s*size$/i.test(v)) return true;
  const num = parseInt(v, 10);
  if (!isNaN(num) && num >= 26 && num <= 62) return true;
  const wordSizes = ["small", "medium", "large", "extra small", "extra large"];
  if (wordSizes.includes(v)) return true;
  return false;
}

function isTitleOptionWithRealValues(o: { name?: string; values?: string[] } | null): boolean {
  if (!o) return false;
  const name = (o.name ?? "").trim().toLowerCase();
  const vals = o.values?.filter(Boolean) ?? [];
  return name === "title" && vals.length > 0 && vals.some((v) => v?.trim() !== "Default Title");
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
  priceStr,
  className,
}: {
  product: ShopifyProduct | null | undefined;
  priceStr?: string | null;
  className?: string;
}) {
  const cart = useCart();
  const [justAdded, setJustAdded] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);

  const variants = product?.variants ?? [];
  const sizeOptionFromOptions =
    product?.options?.find((o) => isSizeOption(o?.name)) ??
    product?.options?.find((o) => isTitleOptionWithRealValues(o)) ??
    product?.options?.find((o) => {
      const vals = o?.values ?? [];
      return vals.length > 0 && vals.some((v) => looksLikeSizeValue(v));
    });
  const sizeOption =
    sizeOptionFromOptions ??
    (() => {
      const names = new Set<string>();
      for (const v of variants) {
        for (const o of v.selectedOptions ?? []) {
          if (o.value === "Default Title") continue;
          if (isSizeOption(o.name) || looksLikeSizeValue(o.value)) names.add(o.name);
        }
      }
      const name = names.values().next().value;
      return name ? { name, values: [] as string[] } : null;
    })();

  const sizeValuesRaw =
    sizeOption?.values?.filter(Boolean) ??
    (() => {
      const fromVariants = new Set<string>();
      const optName = sizeOption?.name?.toLowerCase();
      for (const v of variants) {
        const opt = v.selectedOptions?.find(
          (o) =>
            (optName && o.name?.toLowerCase() === optName) ||
            isSizeOption(o.name) ||
            looksLikeSizeValue(o.value),
        );
        if (opt?.value && opt.value !== "Default Title") fromVariants.add(opt.value);
      }
      return sortSizeValues(Array.from(fromVariants));
    })() ??
    [];

  const sizeOptionFromVariantsOnly =
    sizeValuesRaw.length > 0
      ? null
      : (() => {
          const optionValues = new Map<string, Set<string>>();
          for (const v of variants) {
            for (const o of v.selectedOptions ?? []) {
              if (o.name === "Title" && o.value === "Default Title") continue;
              const set = optionValues.get(o.name) ?? new Set();
              set.add(o.value);
              optionValues.set(o.name, set);
            }
          }
          for (const [optName, vals] of optionValues) {
            const arr = Array.from(vals).filter(Boolean);
            if (arr.length === 0) continue;
            const isTitleWithReal = optName.toLowerCase() === "title" && !arr.every((a) => a?.trim() === "Default Title");
            const hasSizeLikeValue = arr.some((a) => looksLikeSizeValue(a));
            const hasSizeLikeName = isSizeOption(optName);
            if (isTitleWithReal || hasSizeLikeValue || hasSizeLikeName) {
              return { name: optName, values: sortSizeValues(arr) };
            }
          }
          return null;
        })();

  const effectiveSizeOption = sizeOption ?? sizeOptionFromVariantsOnly;
  const sizeValues = sortSizeValues(
    sizeValuesRaw.length > 0 ? sizeValuesRaw : (sizeOptionFromVariantsOnly?.values ?? []),
  );

  const colorOption = product?.options?.find((o) => isColorOption(o?.name));
  const colorValues = colorOption?.values?.filter(Boolean) ?? [];

  const selections = [
    ...(selectedSize && effectiveSizeOption ? [{ name: effectiveSizeOption.name, value: selectedSize }] : []),
    ...(selectedColor && colorOption ? [{ name: colorOption.name, value: selectedColor }] : []),
  ];
  const hasSizeOptions = sizeValues.length > 0;
  const hasColorOptions = colorValues.length > 0;

  React.useEffect(() => {
    if (sizeValues.length >= 1 && effectiveSizeOption) {
      setSelectedSize(sizeValues[0] ?? null);
    }
  }, [sizeValues.length, sizeValues[0], effectiveSizeOption?.name]);
  React.useEffect(() => {
    if (colorValues.length >= 1 && colorOption) {
      setSelectedColor(colorValues[0] ?? null);
    }
  }, [colorValues.length, colorValues[0], colorOption?.name]);

  const allOptionsSelected =
    (!hasSizeOptions || selectedSize != null) && (!hasColorOptions || selectedColor != null);
  const variantMatch = selections.length > 0 ? findVariantByOptions(variants, selections) : null;
  const variantId =
    variantMatch?.id ??
    (hasSizeOptions || hasColorOptions ? null : product?.firstVariantId ?? null);
  const canAdd =
    product != null && variantId != null && variantId !== "" && allOptionsSelected;


  const handleClick = () => {
    if (!product || !variantId) return;
    cart.add(product, 1, variantId);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2000);
  };

  if (product == null) return null;

  return (
    <div className={className ?? ""}>
      {colorOption && colorValues.length > 1 && (
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
      {(effectiveSizeOption && sizeValues.length > 1) || priceStr ? (
        <div className="font-sangbleu mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          {priceStr != null && (
            <p
              className={`font-sangbleu text-xl ${priceStr === "Preis auf Anfrage" ? "text-neutral-500" : "text-neutral-950"}`}
            >
              {priceStr}
            </p>
          )}
          {effectiveSizeOption && sizeValues.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-600">
                {effectiveSizeOption.name}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {sizeValues.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setSelectedSize(val)}
                    className={`rounded-none border w-[32px] h-[28px] flex items-center justify-center font-medium transition-colors ${
                      /^(XXS|XS|XL|XXL|2XL|3XL|4XL)$/i.test(val.trim()) ? "text-[10px]" : "text-xs"
                    } ${
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
        </div>
      ) : null}
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
