"use client";

import React from "react";
import Link from "next/link";

function cn(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}
import { sortSizeValues } from "../../../lib/shopify";
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
  isSizeLike?: (n: string) => boolean,
): string | null {
  const variants = product.variants ?? [];
  for (const v of variants) {
    const exact = v.selectedOptions?.find(
      (o) => o.name.toLowerCase() === optionName.toLowerCase() && o.value === value,
    );
    if (exact) return v.id;
    if (isSizeLike) {
      const bySize = v.selectedOptions?.find(
        (o) => isSizeLike(o.name) && o.value === value,
      );
      if (bySize) return v.id;
    }
  }
  return null;
}

function ProductCard({
  product,
  cart,
  showSizeSelection = true,
}: {
  product: ShopifyProduct;
  cart: CartContextValue;
  showSizeSelection?: boolean;
}) {
  const [justAdded, setJustAdded] = React.useState(false);
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const images = product.images ?? [];

  function isSizeOptionName(name: string | undefined): boolean {
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
    if (!isNaN(num) && num >= 26 && num <= 62) return true; // EU/DE Konfektionsgrößen
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

  const variants = product.variants ?? [];

  const sizeOption =
    product.options?.find((o) => isSizeOptionName(o?.name)) ??
    product.options?.find((o) => isTitleOptionWithRealValues(o)) ??
    product.options?.find((o) => {
      const vals = o?.values ?? [];
      return vals.length > 0 && vals.some((v) => looksLikeSizeValue(v));
    }) ??
    (() => {
      const names = new Set<string>();
      for (const v of variants) {
        for (const o of v.selectedOptions ?? []) {
          if (o.value === "Default Title") continue;
          if (isSizeOptionName(o.name) || looksLikeSizeValue(o.value)) names.add(o.name);
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
            isSizeOptionName(o.name) ||
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
            const hasSizeLikeName = isSizeOptionName(optName);
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
  const hasSizeOptions = showSizeSelection && sizeValues.length > 0;

  React.useEffect(() => {
    if (sizeValues.length >= 1 && effectiveSizeOption) {
      setSelectedSize(sizeValues[0] ?? null);
    }
  }, [sizeValues.length, sizeValues[0], effectiveSizeOption?.name]);
  const foundVariant =
    hasSizeOptions && selectedSize && effectiveSizeOption
      ? findVariantByOption(
          product,
          effectiveSizeOption.name,
          selectedSize,
          isSizeOptionName,
        )
      : null;
  const effectiveVariantId =
    foundVariant ??
    (hasSizeOptions && selectedSize && product.variants?.length === 1 ? product.variants[0].id : null) ??
    (!hasSizeOptions ? product.firstVariantId : null);

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
          <div className="product-card-image relative aspect-square overflow-hidden !rounded-none !border-0 bg-transparent p-0">
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
      <div className="mt-2 flex flex-nowrap items-center justify-between gap-x-2 md:flex-wrap md:gap-y-1">
        <Link href={`/produkt/${product.handle}`} className="block shrink-0">
          <p className="text-[12.6px] text-neutral-600">{priceStr}</p>
        </Link>
        {hasSizeOptions && sizeValues.length > 1 && (
          <div className="flex flex-wrap justify-end gap-1 shrink-0 scale-90 origin-right md:scale-100 md:origin-center md:justify-start">
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
                  "rounded-none border w-[22px] h-[18px] flex items-center justify-center font-medium transition-colors",
                  /^(XXS|XS|XL|XXL|2XL|3XL|4XL)$/i.test(val.trim()) ? "text-[8px]" : "text-[10px]",
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
      </div>
      <button
        type="button"
        onClick={handleAdd}
        disabled={!effectiveVariantId}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "group/btn relative mt-2 flex w-full items-center justify-center rounded-none border border-black py-1 transition-[filter,background-color] duration-200 disabled:opacity-50",
          justAdded ? "bg-neutral-950" : "bg-transparent md:hover:bg-neutral-950",
        )}
        aria-label={justAdded ? "In den Warenkorb gelegt" : "In den Warenkorb"}
      >
        <ButtonCta
          className="scale-[0.7] transition-[filter] duration-200 invert md:group-hover/btn:invert-0"
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

export default function ProductGrid({
  products,
  showCount = true,
  showSizeSelection = true,
}: {
  products: ShopifyProduct[];
  showCount?: boolean;
  /** true = alle Produkte mit Größen zeigen; false = nie; (product) => boolean = pro Produkt */
  showSizeSelection?: boolean | ((product: ShopifyProduct) => boolean);
}) {
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

  const getShowSize = (p: ShopifyProduct): boolean =>
    typeof showSizeSelection === "function" ? showSizeSelection(p) : showSizeSelection;

  return (
    <div className="mt-8">
      {showCount && (
        <div className="mb-6">
          <p className="font-sangbleu text-sm font-medium text-neutral-600">
            {products.length} PRODUKTE
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-x-[10px] gap-y-[40px] md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} cart={cart} showSizeSelection={getShowSize(p)} />
        ))}
      </div>
    </div>
  );
}
