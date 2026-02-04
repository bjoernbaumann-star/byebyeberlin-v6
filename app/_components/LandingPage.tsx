"use client";

import React, { useMemo, useState } from "react";

type Product = {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  color: "emerald" | "noir" | "ivory";
  highlight?: string;
};

function formatEUR(amount: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function cn(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

const HERITAGE_STRIPE_BG =
  "bg-[linear-gradient(90deg,rgba(16,185,129,1)_0%,rgba(16,185,129,1)_42%,rgba(245,245,245,1)_42%,rgba(245,245,245,1)_46%,rgba(138,28,36,1)_46%,rgba(138,28,36,1)_54%,rgba(245,245,245,1)_54%,rgba(245,245,245,1)_58%,rgba(16,185,129,1)_58%,rgba(16,185,129,1)_100%)]";

function HeritageStripe({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("block h-1.5 w-full rounded-full", HERITAGE_STRIPE_BG, className)}
    />
  );
}

function BBBMonogram({
  className,
  tone,
}: {
  className?: string;
  tone: "light" | "dark";
}) {
  const patternId = React.useId();
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "absolute inset-0 h-full w-full",
        tone === "dark" ? "text-neutral-900/15" : "text-white/10",
        className,
      )}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id={patternId} width="18" height="14" patternUnits="userSpaceOnUse">
          <text
            x="0"
            y="10.5"
            fontSize="8"
            fontWeight="700"
            letterSpacing="1.5"
            style={{ fontFamily: "var(--font-playfair)" }}
            fill="currentColor"
          >
            BBB
          </text>
          <text
            x="9"
            y="14"
            fontSize="8"
            fontWeight="700"
            letterSpacing="1.5"
            style={{ fontFamily: "var(--font-playfair)" }}
            fill="currentColor"
            opacity="0.9"
          >
            BBB
          </text>
        </pattern>
      </defs>
      <rect x="0" y="0" width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

function IconBag(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
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

function IconSparkle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 2l1.4 5.1L18 8.5l-4.6 1.4L12 15l-1.4-5.1L6 8.5l4.6-1.4L12 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M19 13l.7 2.5L22 16l-2.3.5L19 19l-.7-2.5L16 16l2.3-.5L19 13Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
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

function HeaderIconButton({
  onClick,
  label,
  children,
}: {
  onClick?: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "grid place-items-center rounded-full p-2",
        "text-white/90 hover:text-white",
        "transition",
        "focus:outline-none focus:ring-2 focus:ring-[rgba(212,175,55,.45)] focus:ring-offset-2 focus:ring-offset-black",
      )}
    >
      {children}
    </button>
  );
}

function ProductVisual({ color, label }: { color: Product["color"]; label: string }) {
  const palette =
    color === "emerald"
      ? "from-emerald-900 via-emerald-950 to-neutral-950"
      : color === "ivory"
        ? "from-neutral-100 via-neutral-50 to-neutral-200"
        : "from-neutral-950 via-neutral-900 to-neutral-950";

  const ink =
    color === "ivory"
      ? "text-neutral-900"
      : "text-neutral-50";

  return (
    <div
      className={cn(
        "relative aspect-[4/5] overflow-hidden rounded-2xl border",
        "border-black/10 dark:border-white/10",
        "shadow-[0_20px_60px_-35px_rgba(0,0,0,.65)]",
        "bg-gradient-to-b",
        palette,
      )}
    >
      <div className="absolute inset-x-5 top-5">
        <HeritageStripe className={cn("opacity-85", color === "ivory" && "opacity-70")} />
      </div>
      <div
        className={cn(
          "absolute inset-0 opacity-[0.16] mix-blend-overlay",
          "bg-[radial-gradient(circle_at_20%_10%,rgba(212,175,55,.65),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,.22),transparent_40%),radial-gradient(circle_at_50%_90%,rgba(0,0,0,.6),transparent_55%)]",
        )}
      />
      <div
        className={cn(
          "absolute inset-0 opacity-[0.18]",
          "bg-[repeating-linear-gradient(135deg,rgba(212,175,55,.22)_0,rgba(212,175,55,.22)_1px,transparent_1px,transparent_12px)]",
        )}
      />
      <BBBMonogram
        tone={color === "ivory" ? "dark" : "light"}
        className={cn(
          "opacity-[0.55]",
          color !== "ivory" && "mix-blend-overlay",
        )}
      />
      <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
        <div className={cn("tracking-[0.25em] uppercase text-xs", ink)}>
          Bye Bye Berlin
        </div>
        <div
          className={cn(
            "rounded-full border px-3 py-1 text-[11px] tracking-wide",
            color === "ivory"
              ? "border-neutral-900/20 bg-white/60 text-neutral-900"
              : "border-white/15 bg-black/25 text-white",
          )}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (p: Product) => void;
}) {
  return (
    <article
      className={cn(
        "group rounded-3xl border p-3 sm:p-4",
        "border-black/10 bg-white/70 backdrop-blur",
        "shadow-[0_30px_80px_-60px_rgba(0,0,0,.7)]",
        "dark:border-white/10 dark:bg-neutral-950/50",
      )}
    >
      <ProductVisual
        color={product.color}
        label={product.highlight ?? "Edition 01"}
      />
      <div className="px-1 pt-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-[var(--font-display)] text-lg tracking-tight">
              {product.name}
            </h3>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
              {product.subtitle}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-neutral-600 dark:text-neutral-300">
              {formatEUR(product.price)}
            </div>
            <div className="mt-1 text-[11px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              inkl. MwSt.
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onAdd(product)}
            className={cn(
              "relative inline-flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3",
              "text-sm tracking-wide",
              "bg-neutral-950 text-white",
              "shadow-[0_18px_45px_-25px_rgba(0,0,0,.85)]",
              "transition hover:translate-y-[-1px] hover:shadow-[0_25px_70px_-40px_rgba(0,0,0,.9)]",
              "focus:outline-none focus:ring-2 focus:ring-[rgba(212,175,55,.45)] focus:ring-offset-2 focus:ring-offset-white",
              "dark:focus:ring-offset-neutral-950",
            )}
          >
            <IconBag className="h-4 w-4 text-[rgba(212,175,55,1)]" />
            In den Warenkorb
            <span
              className={cn(
                "pointer-events-none absolute inset-0 rounded-2xl",
                "ring-1 ring-[rgba(212,175,55,.25)]",
              )}
            />
          </button>
          <button
            type="button"
            className={cn(
              "rounded-2xl border px-4 py-3 text-sm",
              "border-black/10 bg-white/70 text-neutral-900",
              "transition hover:bg-white",
              "dark:border-white/10 dark:bg-neutral-950/40 dark:text-white dark:hover:bg-neutral-950/60",
              "focus:outline-none focus:ring-2 focus:ring-[rgba(212,175,55,.35)] focus:ring-offset-2 focus:ring-offset-white",
              "dark:focus:ring-offset-neutral-950",
            )}
            aria-label={`Details zu ${product.name}`}
          >
            Details
          </button>
        </div>
      </div>
    </article>
  );
}

function CartButton({
  count,
  onOpen,
}: {
  count: number;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "relative inline-flex items-center gap-2 overflow-hidden rounded-full px-4 py-2",
        "bg-neutral-950 text-white",
        "shadow-[0_20px_60px_-35px_rgba(0,0,0,.85)]",
        "ring-1 ring-[rgba(212,175,55,.22)]",
        "transition hover:translate-y-[-1px] hover:ring-[rgba(212,175,55,.35)]",
        "focus:outline-none focus:ring-2 focus:ring-[rgba(212,175,55,.45)] focus:ring-offset-2 focus:ring-offset-white",
        "dark:focus:ring-offset-neutral-950",
      )}
      aria-label="Warenkorb öffnen"
    >
      <span className="pointer-events-none absolute inset-0 opacity-70">
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,.20),transparent_48%)]" />
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(212,175,55,.22),transparent_45%)]" />
      </span>
      <span className="pointer-events-none absolute inset-x-4 -top-1">
        <HeritageStripe className="opacity-80" />
      </span>
      <IconBag className="h-4 w-4 text-[rgba(212,175,55,1)]" />
      <span className="text-sm tracking-wide">Warenkorb</span>
      <span
        className={cn(
          "ml-1 inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs",
          "bg-[rgba(212,175,55,.14)] text-white",
          "ring-1 ring-[rgba(212,175,55,.25)]",
        )}
        aria-label={`${count} Artikel`}
      >
        {count}
      </span>
    </button>
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
  items: Array<{ product: Product; qty: number }>;
  onClose: () => void;
  onRemoveOne: (id: string) => void;
  onClear: () => void;
}) {
  const total = items.reduce((sum, it) => sum + it.product.price * it.qty, 0);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "absolute right-0 top-0 h-full w-full max-w-md",
          "border-l border-white/10 bg-neutral-950 text-white",
          "shadow-[0_40px_120px_-70px_rgba(0,0,0,.95)]",
          "transition-transform",
          open ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-label="Warenkorb"
      >
        <div className="flex items-center justify-between p-5">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-white/60">
              Bye Bye Berlin
            </div>
            <div className="mt-1 font-[var(--font-display)] text-xl">
              Warenkorb
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "rounded-full border px-4 py-2 text-sm",
              "border-white/10 bg-white/5 hover:bg-white/10",
              "focus:outline-none focus:ring-2 focus:ring-[rgba(212,175,55,.45)]",
            )}
          >
            Schließen
          </button>
        </div>

        <div className="px-5 pb-5">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3">
                <IconSparkle className="h-5 w-5 text-[rgba(212,175,55,1)]" />
                <p className="text-sm text-white/80">
                  Dein Warenkorb ist noch leer. Wähle ein Stück aus der
                  Kollektion.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((it) => (
                <div
                  key={it.product.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-medium">{it.product.name}</div>
                      <div className="mt-1 text-sm text-white/70">
                        {it.qty} × {formatEUR(it.product.price)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveOne(it.product.id)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs",
                        "border-white/10 bg-white/5 hover:bg-white/10",
                        "focus:outline-none focus:ring-2 focus:ring-[rgba(212,175,55,.45)]",
                      )}
                    >
                      − 1
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">Zwischensumme</span>
              <span className="font-medium">{formatEUR(total)}</span>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={onClear}
                disabled={items.length === 0}
                className={cn(
                  "flex-1 rounded-2xl border px-4 py-3 text-sm",
                  "border-white/10 bg-white/5 hover:bg-white/10",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                )}
              >
                Leeren
              </button>
              <button
                type="button"
                disabled={items.length === 0}
                className={cn(
                  "flex-1 rounded-2xl px-4 py-3 text-sm text-neutral-950",
                  "bg-[rgba(212,175,55,1)] hover:bg-[rgba(212,175,55,.92)]",
                  "shadow-[0_18px_60px_-45px_rgba(212,175,55,.9)]",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                )}
              >
                Checkout
              </button>
            </div>
            <p className="mt-3 text-xs text-white/60">
              Demo-Checkout (nur UI). Versand & Zahlungsarten folgen.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}

function MenuDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[60]",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/55 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "absolute right-0 top-0 h-full w-full max-w-md",
          "border-l border-white/10 bg-neutral-950 text-white",
          "shadow-[0_40px_120px_-70px_rgba(0,0,0,.95)]",
          "transition-transform",
          open ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-label="Menü"
      >
        <div className="flex items-center justify-between p-5">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-white/60">
              Bye Bye Berlin
            </div>
            <div className="mt-1 font-[var(--font-display)] text-xl">Menu</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "rounded-full border px-4 py-2 text-sm",
              "border-white/10 bg-white/5 hover:bg-white/10",
              "focus:outline-none focus:ring-2 focus:ring-[rgba(212,175,55,.45)]",
            )}
          >
            Close
          </button>
        </div>

        <div className="px-5 pb-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="mb-3 text-[11px] uppercase tracking-[0.35em] text-white/60">
              Navigation
            </div>
            <div className="grid gap-2">
              {[
                { href: "#kollektion", label: "Kollektion" },
                { href: "#story", label: "Story" },
                { href: "#service", label: "Service" },
              ].map((x) => (
                <a
                  key={x.href}
                  href={x.href}
                  onClick={onClose}
                  className={cn(
                    "group flex items-center justify-between rounded-2xl px-4 py-3",
                    "bg-white/5 hover:bg-white/10",
                    "transition",
                  )}
                >
                  <span className="font-[var(--font-display)] text-lg">
                    {x.label}
                  </span>
                  <span className="text-white/40 group-hover:text-white/70">
                    →
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="mb-3 text-[11px] uppercase tracking-[0.35em] text-white/60">
              Capsule
            </div>
            <div className="flex items-center gap-3">
              <div className="w-36">
                <HeritageStripe className="opacity-85" />
              </div>
              <div className="text-sm text-white/80">Heritage capsule 2026</div>
            </div>
            <p className="mt-3 text-sm text-white/70">
              Clean luxury with a heritage twist — emerald, ivory, crimson.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default function LandingPage() {
  const products = useMemo<Product[]>(
    () => [
      {
        id: "bbb-01",
        name: "Noir Signature Tee",
        subtitle: "Schweres Cotton · präziser Fit · matte Details",
        price: 140,
        color: "noir",
        highlight: "Signature",
      },
      {
        id: "bbb-02",
        name: "Emerald Leather Belt",
        subtitle: "Italian leather · gold tone · dezente Prägung",
        price: 290,
        color: "emerald",
        highlight: "Craft",
      },
      {
        id: "bbb-03",
        name: "Ivory Silk Scarf",
        subtitle: "Seiden-Twill · weicher Fall · ikonische Kante",
        price: 220,
        color: "ivory",
        highlight: "Atelier",
      },
      {
        id: "bbb-04",
        name: "Nightfall Sunglasses",
        subtitle: "Acetat · UV400 · minimaler Glanz",
        price: 310,
        color: "noir",
        highlight: "Archive",
      },
      {
        id: "bbb-05",
        name: "Emerald Mini Bag",
        subtitle: "Kompakt · strukturierte Form · goldener Verschluss",
        price: 640,
        color: "emerald",
        highlight: "Limited",
      },
      {
        id: "bbb-06",
        name: "Ivory Fragrance 50ml",
        subtitle: "Amber · Bergamotte · cleanes Finish",
        price: 180,
        color: "ivory",
        highlight: "New",
      },
    ],
    [],
  );

  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartItems = products
    .filter((p) => cart[p.id])
    .map((p) => ({ product: p, qty: cart[p.id] ?? 0 }));

  function addToCart(p: Product) {
    setCart((prev) => ({ ...prev, [p.id]: (prev[p.id] ?? 0) + 1 }));
  }

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

  return (
    <div className="min-h-dvh bg-white text-neutral-950 dark:bg-neutral-950 dark:text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(212,175,55,.20),transparent_35%),radial-gradient(circle_at_90%_15%,rgba(16,185,129,.22),transparent_40%),radial-gradient(circle_at_70%_55%,rgba(138,28,36,.10),transparent_45%),radial-gradient(circle_at_50%_90%,rgba(0,0,0,.55),transparent_55%)] dark:opacity-100" />
        <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.08] bg-[repeating-linear-gradient(135deg,#000_0,#000_1px,transparent_1px,transparent_14px)]" />
        <div className="absolute inset-0 opacity-[0.10] dark:opacity-[0.12] bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,.20),transparent_40%),radial-gradient(circle_at_100%_0%,rgba(255,255,255,.14),transparent_35%)]" />
      </div>

      <header className="fixed inset-x-0 top-0 z-50">
        <div className="bg-gradient-to-b from-black/55 via-black/25 to-transparent">
          <div className="mx-auto flex max-w-6xl items-center justify-end gap-1 px-5 py-5 sm:gap-2">
            <HeaderIconButton
              label="Warenkorb öffnen"
              onClick={() => setCartOpen(true)}
            >
              <span className="relative">
                <IconBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[rgba(212,175,55,1)] ring-2 ring-black" />
                )}
              </span>
            </HeaderIconButton>
            <HeaderIconButton label="Account">
              <IconUser className="h-5 w-5" />
            </HeaderIconButton>
            <HeaderIconButton label="Suche">
              <IconSearch className="h-5 w-5" />
            </HeaderIconButton>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className={cn(
                "ml-1 inline-flex items-center gap-2 rounded-full px-3 py-2",
                "text-white/90 hover:text-white",
                "transition",
                "focus:outline-none focus:ring-2 focus:ring-[rgba(212,175,55,.45)] focus:ring-offset-2 focus:ring-offset-black",
              )}
              aria-label="Menü öffnen"
            >
              <IconMenu className="h-5 w-5" />
              <span className="text-xs uppercase tracking-[0.35em]">Menu</span>
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative min-h-dvh bg-black text-white">
          <div
            className={cn(
              "absolute inset-0",
              "bg-[radial-gradient(circle_at_30%_10%,rgba(255,255,255,.12),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(212,175,55,.22),transparent_45%),radial-gradient(circle_at_20%_85%,rgba(16,185,129,.18),transparent_55%)]",
            )}
          />
          <div
            className={cn(
              "absolute inset-0 opacity-[0.12]",
              "bg-[repeating-linear-gradient(135deg,rgba(255,255,255,.18)_0,rgba(255,255,255,.18)_1px,transparent_1px,transparent_18px)]",
            )}
          />
          <div
            className={cn(
              "absolute inset-0 bg-cover bg-center opacity-40",
              "bg-[url('/hero.jpg')]",
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/80" />

          <div className="relative mx-auto flex min-h-dvh max-w-6xl flex-col items-center justify-center px-5 pt-24 pb-16">
            <div className="mb-6 w-40 sm:w-56">
              <HeritageStripe className="opacity-95" />
            </div>

            <h1 className="text-center font-[var(--font-display)] uppercase tracking-tight">
              <span className="block text-[clamp(3.4rem,14vw,12rem)] leading-[0.82]">
                Bye Bye
              </span>
              <span className="block text-[clamp(3.8rem,16vw,13rem)] leading-[0.82]">
                Berlin
              </span>
            </h1>

            <div className="mt-8 text-center">
              <div className="text-sm tracking-[0.35em] uppercase text-white/70">
                Luxury essentials
              </div>
              <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="#kollektion"
                  className={cn(
                    "inline-flex h-12 items-center justify-center rounded-md px-7 text-xs font-medium uppercase tracking-[0.25em]",
                    "bg-white text-black hover:bg-white/90",
                    "ring-1 ring-white/40",
                  )}
                >
                  For her
                </a>
                <a
                  href="#kollektion"
                  className={cn(
                    "inline-flex h-12 items-center justify-center rounded-md px-7 text-xs font-medium uppercase tracking-[0.25em]",
                    "bg-white text-black hover:bg-white/90",
                    "ring-1 ring-white/40",
                  )}
                >
                  For him
                </a>
              </div>
            </div>

            <div className="mt-10 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-white/60">
              <span className="h-px w-10 bg-white/20" />
              <span>Scroll</span>
              <span className="h-px w-10 bg-white/20" />
            </div>
          </div>
        </section>

        <section id="kollektion" className="mx-auto max-w-6xl px-5 pt-16 sm:pt-24">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="text-[11px] uppercase tracking-[0.35em] text-neutral-600 dark:text-white/60">
                Ausgewählt
              </div>
              <h2 className="mt-3 font-[var(--font-display)] text-3xl tracking-tight sm:text-4xl">
                Featured Pieces
              </h2>
            </div>
            <p className="hidden max-w-md text-sm leading-relaxed text-neutral-600 dark:text-white/60 sm:block">
              Hochwertige Produktkarten mit Editorial-Feeling — clean, luxuriös, sofort
              shopbar.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={addToCart} />
            ))}
          </div>
        </section>

        <section id="story" className="mx-auto max-w-6xl px-5 pt-16 sm:pt-24">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-black/10 bg-white/70 p-7 backdrop-blur dark:border-white/10 dark:bg-neutral-950/40">
                <div className="text-[11px] uppercase tracking-[0.35em] text-neutral-600 dark:text-white/60">
                  Story
                </div>
                <h3 className="mt-3 font-[var(--font-display)] text-2xl tracking-tight">
                  Berlin, aber refined.
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-neutral-700 dark:text-white/70">
                  Bye Bye Berlin ist ein Abschied von Lärm — und ein Hallo zu
                  Präzision. Wir designen Pieces, die du jahrelang tragen willst:
                  klare Silhouetten, satte Materialien, goldene Nuancen.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl border border-black/10 bg-white/70 p-4 dark:border-white/10 dark:bg-neutral-950/50">
                    <div className="text-[11px] uppercase tracking-[0.3em] text-neutral-600 dark:text-white/60">
                      Material
                    </div>
                    <div className="mt-2">Heavy cotton</div>
                  </div>
                  <div className="rounded-2xl border border-black/10 bg-white/70 p-4 dark:border-white/10 dark:bg-neutral-950/50">
                    <div className="text-[11px] uppercase tracking-[0.3em] text-neutral-600 dark:text-white/60">
                      Finish
                    </div>
                    <div className="mt-2">Gold tone</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-black/10 bg-white/70 p-7 backdrop-blur dark:border-white/10 dark:bg-neutral-950/40">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.35em] text-neutral-600 dark:text-white/60">
                      Atelier Notes
                    </div>
                    <h3 className="mt-3 font-[var(--font-display)] text-2xl tracking-tight">
                      Minimal, aber mit Substanz.
                    </h3>
                  </div>
                  <div className="hidden rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-xs tracking-[0.3em] text-neutral-700 dark:border-white/10 dark:bg-neutral-950/50 dark:text-white/70 sm:block">
                    2026
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-neutral-700 dark:text-white/70">
                  Unser Design ist bewusst ruhig: monochrome Flächen, strukturierte
                  Details, eine luxuriöse Haptik. Der Look erinnert an ikonische
                  italienische Fashion-Häuser — ohne zu kopieren, ohne Logos, nur
                  Qualität.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    { k: "Schnitt", v: "präzise" },
                    { k: "Paletten", v: "emerald / noir / ivory" },
                    { k: "Details", v: "golden, matt" },
                  ].map((x) => (
                    <div
                      key={x.k}
                      className="rounded-2xl border border-black/10 bg-white/70 p-4 dark:border-white/10 dark:bg-neutral-950/50"
                    >
                      <div className="text-[11px] uppercase tracking-[0.3em] text-neutral-600 dark:text-white/60">
                        {x.k}
                      </div>
                      <div className="mt-2 text-sm">{x.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="service" className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
          <div className="rounded-[2.25rem] border border-black/10 bg-white/70 p-7 backdrop-blur dark:border-white/10 dark:bg-neutral-950/40 sm:p-10">
            <div className="grid items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="text-[11px] uppercase tracking-[0.35em] text-neutral-600 dark:text-white/60">
                  Private list
                </div>
                <h2 className="mt-3 font-[var(--font-display)] text-3xl tracking-tight sm:text-4xl">
                  Early access. Private drops.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-700 dark:text-white/70">
                  Erhalte Vorabzugang zu limitierten Pieces, Restocks und Capsule
                  Releases — in einer E-Mail pro Drop.
                </p>
              </div>
              <div className="lg:col-span-5">
                <form
                  className="flex flex-col gap-3 sm:flex-row"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="email"
                    placeholder="E-Mail"
                    className={cn(
                      "h-12 flex-1 rounded-2xl border px-4 text-sm",
                      "border-black/10 bg-white/80 text-neutral-950",
                      "focus:outline-none focus:ring-2 focus:ring-[rgba(212,175,55,.35)]",
                      "dark:border-white/10 dark:bg-neutral-950/50 dark:text-white",
                    )}
                  />
                  <button
                    type="submit"
                    className={cn(
                      "h-12 rounded-2xl px-5 text-sm tracking-wide",
                      "bg-neutral-950 text-white",
                      "ring-1 ring-[rgba(212,175,55,.22)]",
                      "transition hover:translate-y-[-1px]",
                    )}
                  >
                    Eintragen
                  </button>
                </form>
                <p className="mt-3 text-xs text-neutral-600 dark:text-white/60">
                  Kein Spam. Abmeldung jederzeit.
                </p>
              </div>
            </div>
          </div>

          <footer className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-black/5 pt-8 text-sm text-neutral-600 dark:border-white/10 dark:text-white/60 sm:flex-row">
            <div>© {new Date().getFullYear()} Bye Bye Berlin</div>
            <div className="flex gap-5">
              <a className="hover:text-neutral-950 dark:hover:text-white" href="#">
                Impressum
              </a>
              <a className="hover:text-neutral-950 dark:hover:text-white" href="#">
                Datenschutz
              </a>
              <a className="hover:text-neutral-950 dark:hover:text-white" href="#">
                Kontakt
              </a>
            </div>
          </footer>
        </section>
      </main>

      <MiniCart
        open={cartOpen}
        items={cartItems}
        onClose={() => setCartOpen(false)}
        onRemoveOne={removeOne}
        onClear={clear}
      />
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}

