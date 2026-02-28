"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "./CartContext";
import ButtonCta from "../shopify/ButtonCta";

function cn(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

function formatPrice(amount: number, currencyCode: string) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: currencyCode || "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const cart = useCart();
  const [checkoutLoading, setCheckoutLoading] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.aside
            className={cn(
              "absolute right-0 top-0 flex h-full w-full max-w-md flex-col",
              "bg-white text-neutral-950",
              "shadow-[0_40px_120px_-70px_rgba(0,0,0,.8)]",
            )}
            role="dialog"
            aria-label="Your Selection"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="shrink-0 border-b border-black/10">
              <div className="flex items-center justify-between px-5 py-5">
                <div>
                  <div className="font-sangbleu text-[11px] uppercase tracking-[0.35em] text-neutral-700">
                    BYE BYE BERLIN
                  </div>
                  <div className="mt-1 font-sangbleu text-xl font-bold">
                    YOUR SELECTION
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className={cn(
                    "grid h-14 w-14 place-items-center text-neutral-950",
                    "transition-opacity hover:opacity-70",
                  )}
                  aria-label="Close"
                >
                  <span
                    className="inline-block animate-[spin_3s_linear_infinite]"
                    style={{ width: 44, height: 44 }}
                  >
                    <img
                      src="/x.svg"
                      alt=""
                      width={44}
                      height={44}
                      className="object-contain block"
                    />
                  </span>
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6">
              {cart.lines.length === 0 ? (
                <div className="rounded-2xl border border-black/10 bg-white p-5 text-sm text-neutral-700">
                  Your bag is empty.
                </div>
              ) : (
                <div className="space-y-0">
                  {cart.lines.map((l) => (
                    <div
                      key={`${l.product.id}-${l.variantId ?? l.product.firstVariantId}`}
                      className="flex gap-4 bg-white py-2"
                    >
                      <div className="h-[162px] w-[162px] shrink-0 overflow-hidden bg-white">
                        {l.product.images?.[0]?.url ? (
                          <img
                            src={l.product.images[0].url}
                            alt={l.product.images[0].altText ?? l.product.title}
                            className="h-full w-full rounded-none object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                            —
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold">{l.product.title}</div>
                        {(() => {
                          const vid = l.variantId ?? l.product.firstVariantId;
                          const variant = l.product.variants?.find((v) => v.id === vid);
                          const opts = variant?.selectedOptions?.filter(
                            (o) =>
                              o.name.toLowerCase().includes("size") ||
                              o.name.toLowerCase().includes("größe") ||
                              o.name.toLowerCase().includes("grosse") ||
                              o.name.toLowerCase().includes("color") ||
                              o.name.toLowerCase().includes("farbe") ||
                              o.name.toLowerCase().includes("colour"),
                          );
                          return opts?.length ? (
                            <div className="mt-0.5 text-xs text-neutral-500">
                              {opts.map((o) => o.value).join(" / ")}
                            </div>
                          ) : null;
                        })()}
                        <div className="mt-1 text-sm text-neutral-600">
                          {l.qty} ×{" "}
                          {formatPrice(
                            Number(l.product.priceRange.minVariantPrice.amount),
                            l.product.priceRange.minVariantPrice.currencyCode,
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => cart.setQty(l.product.id, l.qty - 1, l.variantId ?? l.product.firstVariantId)}
                            className="rounded-none border border-black/10 bg-white px-3 py-1 text-xs hover:bg-neutral-50"
                          >
                            −
                          </button>
                          <button
                            type="button"
                            onClick={() => cart.setQty(l.product.id, l.qty + 1, l.variantId ?? l.product.firstVariantId)}
                            className="rounded-none border border-black/10 bg-white px-3 py-1 text-xs hover:bg-neutral-50"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="shrink-0 border-t border-black/10 px-5 py-5">
              <div className="rounded-2xl border border-black/10 bg-white p-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-medium">
                    {formatPrice(cart.subtotal.amount, cart.subtotal.currencyCode)}
                  </span>
                </div>

                <div className="mt-4 flex flex-col items-stretch gap-1">
                  <button
                    type="button"
                    disabled={
                      cart.lines.length === 0 ||
                      checkoutLoading ||
                      cart.lines.some((l) => !(l.variantId ?? l.product.firstVariantId))
                    }
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={async () => {
                      const lines = cart.lines
                        .filter((l) => l.variantId ?? l.product.firstVariantId)
                        .map((l) => ({
                          merchandiseId: (l.variantId ?? l.product.firstVariantId)!,
                          quantity: l.qty,
                        }));
                      if (lines.length === 0) return;
                      setCheckoutLoading(true);
                      try {
                        const res = await fetch("/api/shopify/checkout", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ lines }),
                        });
                        const json = (await res.json()) as { checkoutUrl?: string; error?: string };
                        if (json.checkoutUrl) {
                          cart.clear();
                          window.location.href = json.checkoutUrl;
                        } else {
                          throw new Error(json.error ?? "Checkout failed");
                        }
                      } catch (err) {
                        console.error(err);
                        setCheckoutLoading(false);
                      }
                    }}
                    className="group/btn relative flex w-full items-center justify-center rounded-none border border-black bg-transparent py-1 transition-[filter,background-color] duration-200 hover:bg-neutral-950 disabled:opacity-50"
                  >
                    <ButtonCta
                      className="scale-[0.7] transition-[filter] duration-200 invert group-hover/btn:invert-0"
                      invisible={checkoutLoading}
                      isHovered={isHovered}
                      label="checkout"
                    />
                    {checkoutLoading && (
                      <span className="absolute inset-0 flex items-center justify-center font-sangbleu text-[16px] font-bold leading-none text-white">
                        …
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={cart.clear}
                    disabled={cart.lines.length === 0}
                    className="self-end text-[11px] uppercase text-neutral-500 underline-offset-2 hover:underline disabled:opacity-50"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

