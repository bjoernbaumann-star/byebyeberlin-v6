"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Product = {
  id: string;
  name: string;
  subtitle: string;
  price: number;
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

function Marquee({ text }: { text: string }) {
  return (
    <div className="relative h-[clamp(120px,18vw,220px)] overflow-hidden bg-black text-white">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
        <motion.div
          className="flex w-max items-center gap-10"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 18, ease: "linear", repeat: Infinity }}
        >
          <div className="flex items-center gap-10">
            <span className="font-sangbleu text-[12vw] font-bold leading-none tracking-[-0.02em]">
              {text}
            </span>
            <span className="font-sangbleu text-[12vw] font-bold leading-none tracking-[-0.02em]">
              {text}
            </span>
            <span className="font-sangbleu text-[12vw] font-bold leading-none tracking-[-0.02em]">
              {text}
            </span>
            <span className="font-sangbleu text-[12vw] font-bold leading-none tracking-[-0.02em]">
              {text}
            </span>
          </div>
          <div aria-hidden="true" className="flex items-center gap-10">
            <span className="font-sangbleu text-[12vw] font-bold leading-none tracking-[-0.02em]">
              {text}
            </span>
            <span className="font-sangbleu text-[12vw] font-bold leading-none tracking-[-0.02em]">
              {text}
            </span>
            <span className="font-sangbleu text-[12vw] font-bold leading-none tracking-[-0.02em]">
              {text}
            </span>
            <span className="font-sangbleu text-[12vw] font-bold leading-none tracking-[-0.02em]">
              {text}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
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
        "fixed inset-0 z-[70]",
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
                        {it.qty} × {formatEUR(it.product.price)}
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
              <span className="font-medium">{formatEUR(total)}</span>
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

export default function LandingPage() {
  const reduceMotion = useReducedMotion();

  const products = useMemo<Product[]>(
    () => [
      {
        id: "bbb-01",
        name: "Noir Signature Tee",
        subtitle: "Schweres Cotton · präziser Fit",
        price: 140,
      },
      {
        id: "bbb-02",
        name: "Emerald Leather Belt",
        subtitle: "Italian leather · gold tone",
        price: 290,
      },
      {
        id: "bbb-03",
        name: "Ivory Silk Scarf",
        subtitle: "Seiden-Twill · weicher Fall",
        price: 220,
      },
      {
        id: "bbb-04",
        name: "Nightfall Sunglasses",
        subtitle: "Acetat · UV400 · minimaler Glanz",
        price: 310,
      },
      {
        id: "bbb-05",
        name: "Emerald Mini Bag",
        subtitle: "Kompakt · goldener Verschluss",
        price: 640,
      },
      {
        id: "bbb-06",
        name: "Ivory Fragrance 50ml",
        subtitle: "Amber · Bergamotte · cleanes Finish",
        price: 180,
      },
    ],
    [],
  );

  const [isScrolled, setIsScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});

  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY >= 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cartItems = products
    .filter((p) => cart[p.id])
    .map((p) => ({ product: p, qty: cart[p.id] ?? 0 }));

  function addToCart(id: string) {
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
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

  const marqueeText = "BYE BYE BERLIN — ";

  return (
    <div className="min-h-dvh bg-white text-neutral-950">
      {/* Spacer to prevent main content being covered by fixed header */}
      <motion.div
        aria-hidden="true"
        animate={{ height: isScrolled ? 72 : "clamp(120px,18vw,220px)" }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      />

      <header className="fixed inset-x-0 top-0 z-50">
        <AnimatePresence initial={false} mode="wait">
          {!isScrolled && (
            <motion.div
              key="marquee"
              initial={reduceMotion ? false : { opacity: 1, y: 0 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -24 }}
              transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <Marquee text={marqueeText} />
            </motion.div>
          )}

          {isScrolled && (
            <motion.div
              key="nav"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={reduceMotion ? undefined : { opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
              className="border-b border-black/10 bg-white/95 backdrop-blur"
            >
              <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5">
                <div className="font-sangbleu text-lg font-bold tracking-tight">
                  BYE BYE BERLIN
                </div>
                <nav className="flex items-center gap-6 text-[11px] font-medium uppercase tracking-[0.35em] text-neutral-800">
                  <a className="hover:text-neutral-950" href="#kollektion">
                    Shop
                  </a>
                  <a className="hover:text-neutral-950" href="#story">
                    Story
                  </a>
                  <button
                    type="button"
                    onClick={() => setCartOpen(true)}
                    className="inline-flex items-center gap-2 hover:text-neutral-950"
                  >
                    <IconBag className="h-4 w-4" />
                    Warenkorb
                  </button>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-5 pt-10">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <article
                key={p.id}
                className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_30px_80px_-60px_rgba(0,0,0,.65)]"
              >
                <div className="font-sangbleu text-xl font-bold">{p.name}</div>
                <div className="mt-2 text-sm text-neutral-600">{p.subtitle}</div>
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-neutral-800">
                    {formatEUR(p.price)}
                  </div>
                  <button
                    type="button"
                    onClick={() => addToCart(p.id)}
                    className="rounded-full bg-neutral-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white"
                  >
                    Add
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="kollektion" className="mx-auto max-w-6xl px-5 pt-20">
          <div className="rounded-[2rem] border border-black/10 bg-neutral-50 p-10">
            <div className="font-sangbleu text-3xl font-bold">Kollektion</div>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-700">
              Premium Essentials, klare Silhouetten, präzise Materialien.
            </p>
          </div>
        </section>

        <section id="story" className="mx-auto max-w-6xl px-5 py-20">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-black/10 bg-white p-10">
              <div className="text-[11px] uppercase tracking-[0.35em] text-neutral-600">
                Story
              </div>
              <div className="mt-3 font-sangbleu text-3xl font-bold">
                Berlin, aber refined.
              </div>
              <p className="mt-4 text-sm leading-relaxed text-neutral-700">
                Bye Bye Berlin ist ein Abschied von Lärm — und ein Hallo zu
                Präzision. Editorial, modern, luxuriös.
              </p>
            </div>
            <div className="rounded-[2rem] border border-black/10 bg-white p-10">
              <div className="text-[11px] uppercase tracking-[0.35em] text-neutral-600">
                Service
              </div>
              <div className="mt-3 font-sangbleu text-3xl font-bold">
                24–48h Versand.
              </div>
              <p className="mt-4 text-sm leading-relaxed text-neutral-700">
                Gift-ready Packaging, 30 Tage Retouren, Premium Support.
              </p>
            </div>
          </div>
        </section>
      </main>

      <MiniCart
        open={cartOpen}
        items={cartItems}
        onClose={() => setCartOpen(false)}
        onRemoveOne={removeOne}
        onClear={clear}
      />
    </div>
  );
}