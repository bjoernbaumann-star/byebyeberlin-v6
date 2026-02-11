"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "./CartContext";

function cn(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

function formatEUR(amount: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
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
            aria-label="Warenkorb"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {/* Header with subtle animated leo pattern */}
            <div className="relative overflow-hidden border-b border-black/10">
              <motion.div
                className="absolute inset-0 opacity-60"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 12% 28%, rgba(0,0,0,.55) 0 18px, rgba(0,0,0,0) 19px), radial-gradient(circle at 14% 30%, rgba(184,132,60,.95) 0 12px, rgba(0,0,0,0) 13px), radial-gradient(circle at 36% 48%, rgba(0,0,0,.52) 0 20px, rgba(0,0,0,0) 21px), radial-gradient(circle at 38% 50%, rgba(214,167,74,.95) 0 13px, rgba(0,0,0,0) 14px), radial-gradient(circle at 68% 36%, rgba(0,0,0,.55) 0 18px, rgba(0,0,0,0) 19px), radial-gradient(circle at 70% 38%, rgba(176,116,48,.92) 0 12px, rgba(0,0,0,0) 13px), radial-gradient(circle at 82% 64%, rgba(0,0,0,.50) 0 22px, rgba(0,0,0,0) 23px), radial-gradient(circle at 84% 66%, rgba(232,190,92,.92) 0 14px, rgba(0,0,0,0) 15px)",
                  backgroundSize: "240px 160px",
                  backgroundRepeat: "repeat",
                  filter: "saturate(1.05) contrast(1.05)",
                }}
                animate={{ x: [0, -240] }}
                transition={{ duration: 120, ease: "linear", repeat: Infinity }}
              />
              <div className="relative flex items-center justify-between px-5 py-5">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.35em] text-neutral-700">
                    Bye Bye Berlin
                  </div>
                  <div className="mt-1 font-sangbleu text-xl font-bold">
                    Warenkorb
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

            <div className="px-5 py-6">
              {cart.lines.length === 0 ? (
                <div className="rounded-2xl border border-black/10 bg-white p-5 text-sm text-neutral-700">
                  Dein Warenkorb ist noch leer.
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.lines.map((l) => (
                    <div
                      key={l.product.id}
                      className="rounded-2xl border border-black/10 bg-white p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-medium">{l.product.title}</div>
                          <div className="mt-1 text-sm text-neutral-600">
                            {l.qty} ×{" "}
                            {formatEUR(
                              Number(l.product.priceRange.minVariantPrice.amount),
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
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
                  <span className="text-neutral-600">Zwischensumme</span>
                  <span className="font-medium">
                    {formatEUR(cart.subtotal.amount)}
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={cart.clear}
                    disabled={cart.lines.length === 0}
                    className="flex-1 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm disabled:opacity-50"
                  >
                    Leeren
                  </button>
                  <button
                    type="button"
                    disabled
                    className="flex-1 rounded-xl bg-neutral-950 px-4 py-3 text-sm text-white opacity-70"
                    title="Shopify Checkout kommt bald"
                  >
                    Coming soon
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

