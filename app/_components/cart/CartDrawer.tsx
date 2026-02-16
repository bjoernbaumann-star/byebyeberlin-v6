"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "./CartContext";

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

function IconX(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
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
              "absolute right-0 top-0 h-full w-full max-w-md",
              "bg-white/95 text-neutral-950 backdrop-blur",
              "shadow-[0_40px_120px_-70px_rgba(0,0,0,.8)]",
            )}
            role="dialog"
            aria-label="Your Selection"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="border-b border-black/10">
              <div className="flex items-center justify-between px-5 py-5">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.35em] text-neutral-700">
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
                    "grid h-12 w-12 place-items-center rounded-full",
                    "bg-neutral-950 text-white",
                    "transition-opacity hover:opacity-80",
                  )}
                  aria-label="Close"
                >
                  <IconX className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-5 py-6">
              {cart.lines.length === 0 ? (
                <div className="rounded-2xl border border-black/10 bg-white p-5 text-sm text-neutral-700">
                  Your bag is empty.
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.lines.map((l) => (
                    <div
                      key={l.product.id}
                      className="flex gap-4 rounded-2xl border border-black/10 bg-white p-4"
                    >
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-black/10 bg-neutral-50">
                        {l.product.images?.[0]?.url ? (
                          <img
                            src={l.product.images[0].url}
                            alt={l.product.images[0].altText ?? l.product.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                            —
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium">{l.product.title}</div>
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
                            onClick={() => cart.setQty(l.product.id, l.qty - 1)}
                            className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs hover:bg-neutral-50"
                          >
                            −
                          </button>
                          <button
                            type="button"
                            onClick={() => cart.setQty(l.product.id, l.qty + 1)}
                            className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs hover:bg-neutral-50"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-5 rounded-2xl border border-black/10 bg-white p-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-medium">
                    {formatPrice(cart.subtotal.amount, cart.subtotal.currencyCode)}
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={cart.clear}
                    disabled={cart.lines.length === 0}
                    className="flex-1 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm disabled:opacity-50"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    disabled={
                      cart.lines.length === 0 ||
                      checkoutLoading ||
                      cart.lines.some((l) => !l.product.firstVariantId)
                    }
                    onClick={async () => {
                      const lines = cart.lines
                        .filter((l) => l.product.firstVariantId)
                        .map((l) => ({
                          merchandiseId: l.product.firstVariantId!,
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
                    className="flex-1 rounded-xl bg-neutral-950 px-4 py-3 text-sm text-white disabled:opacity-50"
                  >
                    {checkoutLoading ? "…" : "Checkout"}
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

