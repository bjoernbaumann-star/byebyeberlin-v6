"use client";

import Link from "next/link";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PRODUCTS } from "../_data/products";

function cn(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

const CART_STORAGE_KEY = "bbb_cart_v1";

function IconBag(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7 9V7a5 5 0 0 1 10 0v2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M6.5 9h11l1.1 12.2a1.6 1.6 0 0 1-1.6 1.8H7a1.6 1.6 0 0 1-1.6-1.8L6.5 9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
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

function IconUser(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M16.5 8.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M4.5 20.5a7.5 7.5 0 0 1 15 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconSearch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M16.3 16.3 21 21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconMenu(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MenuDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div
            className="absolute inset-0 bg-black/25 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-label="Menu"
            className={cn(
              "absolute right-0 top-0 h-full w-full max-w-[520px]",
              "bg-white text-neutral-950",
              "shadow-[0_60px_140px_-80px_rgba(0,0,0,.75)]",
            )}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className={cn(
                "absolute right-6 top-6 grid h-12 w-12 place-items-center rounded-full",
                "bg-neutral-950 text-white",
                "transition-opacity hover:opacity-80",
                "focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2",
              )}
            >
              <IconX className="h-5 w-5" />
            </button>

            <div className="h-full overflow-y-auto px-10 pb-14 pt-20">
              <nav className="space-y-5 text-[22px] leading-tight">
                {[
                  { label: "Bags", href: "/bags" },
                  { label: "Clothes", href: "/clothes" },
                  { label: "Kollektion", href: "/kollektion" },
                  { label: "Story", href: "/story" },
                ].map((x) => (
                  <Link
                    key={x.label}
                    href={x.href}
                    onClick={onClose}
                    className="block w-fit text-neutral-950/90 transition-colors hover:text-neutral-950"
                  >
                    {x.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-12 border-t border-black/10 pt-8">
                <Link
                  href="/services"
                  onClick={onClose}
                  className="text-sm text-neutral-500 transition-colors hover:text-neutral-800"
                >
                  Bye Bye Berlin Services
                </Link>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MiniCart({
  open,
  items,
  onClose,
  onRemoveOne,
  onClear,
}: {
  open: boolean;
  items: Array<{ product: (typeof PRODUCTS)[number]; qty: number }>;
  onClose: () => void;
  onRemoveOne: (id: string) => void;
  onClear: () => void;
}) {
  const total = items.reduce((sum, it) => sum + it.product.price * it.qty, 0);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[80]",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/45 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "absolute right-0 top-0 h-full w-full max-w-md",
          "border-l border-black/10 bg-white/95 text-neutral-950 backdrop-blur",
          "shadow-[0_40px_120px_-70px_rgba(0,0,0,.8)]",
          "transition-transform",
          open ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-label="Warenkorb"
      >
        <div className="flex items-center justify-between p-5">
          <div>
            <div className="text-[11px] uppercase tracking-[0.35em] text-neutral-600">
              Bye Bye Berlin
            </div>
            <div className="mt-1 font-sangbleu text-xl font-bold">Warenkorb</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm hover:bg-neutral-50"
          >
            Schließen
          </button>
        </div>

        <div className="px-5 pb-6">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-black/10 bg-white p-5 text-sm text-neutral-700">
              Dein Warenkorb ist noch leer.
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((it) => (
                <div
                  key={it.product.id}
                  className="rounded-2xl border border-black/10 bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-medium">{it.product.name}</div>
                      <div className="mt-1 text-sm text-neutral-600">
                        {it.qty} ×{" "}
                        {new Intl.NumberFormat("de-DE", {
                          style: "currency",
                          currency: "EUR",
                          maximumFractionDigits: 0,
                        }).format(it.product.price)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveOne(it.product.id)}
                      className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs hover:bg-neutral-50"
                    >
                      − 1
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-5 rounded-2xl border border-black/10 bg-white p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Zwischensumme</span>
              <span className="font-medium">
                {new Intl.NumberFormat("de-DE", {
                  style: "currency",
                  currency: "EUR",
                  maximumFractionDigits: 0,
                }).format(total)}
              </span>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={onClear}
                disabled={items.length === 0}
                className="flex-1 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm disabled:opacity-50"
              >
                Leeren
              </button>
              <button
                type="button"
                disabled={items.length === 0}
                className="flex-1 rounded-xl bg-neutral-950 px-4 py-3 text-sm text-white disabled:opacity-50"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default function ShopNav() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [cart, setCart] = React.useState<Record<string, number>>({});

  // Persist cart so nav matches home across pages
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (raw) setCart(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY >= 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cartItems = PRODUCTS.filter((p) => cart[p.id]).map((p) => ({
    product: p,
    qty: cart[p.id] ?? 0,
  }));
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  function removeOne(id: string) {
    setCart((prev) => {
      const next = { ...prev };
      const qty = next[id] ?? 0;
      if (qty <= 1) delete next[id];
      else next[id] = qty - 1;
      return next;
    });
  }

  function clear() {
    setCart({});
  }

  const headerTextColor = isScrolled ? "text-neutral-950" : "text-white";
  const headerBg = isScrolled
    ? "bg-white/95 backdrop-blur border-b border-black/10"
    : "bg-transparent";

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[60]",
          "transition-[background-color,border-color,color] duration-500",
          headerBg,
          headerTextColor,
        )}
      >
        <div className="relative flex h-[76px] w-full items-center px-2 sm:px-4 lg:px-6">
          <Link
            href="/"
            className="pointer-events-none absolute inset-x-0 flex justify-center font-sangbleu text-[18px] font-bold tracking-tight whitespace-nowrap leading-none"
            aria-label="Home"
          >
            BYE BYE BERLIN
          </Link>

          <div className="absolute right-2 flex items-center gap-1 sm:right-4 lg:right-6">
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="p-2 hover:opacity-70"
              aria-label="Warenkorb"
            >
              <span className="relative block">
                <IconBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full",
                      isScrolled ? "bg-neutral-950" : "bg-white",
                    )}
                  />
                )}
              </span>
            </button>
            <button className="p-2 hover:opacity-70" aria-label="User">
              <IconUser className="h-5 w-5" />
            </button>
            <button className="p-2 hover:opacity-70" aria-label="Search">
              <IconSearch className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="ml-1 inline-flex items-center gap-2 px-2 py-2 text-xs font-medium uppercase tracking-[0.35em] hover:opacity-70"
            >
              <IconMenu className="h-5 w-5" />
              <span className="hidden sm:inline">Menu</span>
            </button>
          </div>
        </div>
      </header>

      <MiniCart
        open={cartOpen}
        items={cartItems}
        onClose={() => setCartOpen(false)}
        onRemoveOne={removeOne}
        onClear={clear}
      />

      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

