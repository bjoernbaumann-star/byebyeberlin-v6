"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import type { MotionValue } from "framer-motion";

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

function HeaderIconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "grid place-items-center p-2",
        "transition-opacity hover:opacity-70",
        "focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2 focus:ring-offset-transparent",
      )}
    >
      {children}
    </button>
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
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/25 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Panel */}
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
              <nav className="space-y-10">
                {[
                  {
                    title: "Shop",
                    href: "/shop",
                    links: [
                      { label: "Clothes", href: "/clothes" },
                      { label: "Bags", href: "/bags" },
                      { label: "New In", href: "/new-in" },
                    ],
                  },
                  {
                    title: "Collections",
                    href: "/collections",
                    links: [
                      { label: "Travel", href: "/travel" },
                      { label: "Décor & Lifestyle", href: "/decor-lifestyle" },
                    ],
                  },
                  {
                    title: "Info",
                    href: "/info",
                    links: [{ label: "Story", href: "/story" }],
                  },
                ].map((section) => (
                  <div key={section.title}>
                    <Link
                      href={section.href}
                      onClick={onClose}
                      className={cn(
                        "block w-fit",
                        "text-[22px] leading-tight text-neutral-950",
                        "hover:opacity-80 transition-opacity",
                      )}
                    >
                      {section.title}
                    </Link>
                    <div className="mt-5 space-y-5 text-[22px] leading-tight">
                      {section.links.map((x) => (
                        <Link
                          key={x.label}
                          href={x.href}
                          onClick={onClose}
                          className={cn(
                            "block w-fit",
                            "text-neutral-950/90 hover:text-neutral-950",
                            "transition-colors",
                          )}
                        >
                          {x.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>

              <div className="mt-12 border-t border-black/10 pt-8">
                <Link
                  href="/services"
                  onClick={onClose}
                  className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
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

function HeroMarquee({
  text,
  reducedMotion,
  phase = 0,
  className,
  blendClassName,
  opacity,
}: {
  text: string;
  reducedMotion: boolean;
  phase?: number;
  className?: string;
  blendClassName?: string;
  opacity?: number | MotionValue<number>;
}) {
  return (
    <motion.div
      aria-hidden="true"
      className={cn(
        // Keep the headline at a fixed vertical position while scrolling.
        "pointer-events-none fixed inset-x-0 top-1/2 -translate-y-1/2 whitespace-nowrap",
        className,
      )}
      style={{
        transformOrigin: "center",
        whiteSpace: "nowrap",
          willChange: "transform",
        ...(opacity !== undefined ? { opacity } : {}),
        // subtle luxe glow for the moving headline
        filter:
          "drop-shadow(0 10px 40px rgba(0,0,0,.55)) drop-shadow(0 0 24px rgba(255,255,255,.10))",
      }}
    >
      <motion.div
        className="flex w-max items-center gap-[5vw] whitespace-nowrap pl-[5vw]"
        style={{ willChange: "transform", transform: "translate3d(0,0,0)" }}
        animate={
          reducedMotion
            ? undefined
            : {
                // left -> right
                x: [`${phase * -50 - 50}%`, `${phase * -50}%`],
              }
        }
        transition={
          reducedMotion
            ? undefined
            : {
                duration: 51,
                ease: "linear",
                repeat: Infinity,
                repeatDelay: 0,
                repeatType: "loop",
              }
        }
      >
        <div className="flex items-center gap-[5vw]">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={`a-${i}`}
              className={cn(
                "font-sangbleu text-[21vw] font-bold leading-none text-white whitespace-nowrap",
                blendClassName,
              )}
              style={{ letterSpacing: "-0.02em" }}
            >
              {text}
            </span>
          ))}
        </div>
        <div aria-hidden="true" className="flex items-center gap-[5vw]">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={`b-${i}`}
              className={cn(
                "font-sangbleu text-[21vw] font-bold leading-none text-white whitespace-nowrap",
                blendClassName,
              )}
              style={{ letterSpacing: "-0.02em" }}
            >
              {text}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
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
  const reducedMotion = useReducedMotion();
  const { scrollY } = useScroll();

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

  // requested: use existing isScrolled state (threshold ~80px)
  const [isScrolled, setIsScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest >= 80);
  });

  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [menuOpen, setMenuOpen] = useState(false);

  const cartItems = products
    .filter((p) => cart[p.id])
    .map((p) => ({ product: p, qty: cart[p.id] ?? 0 }));
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

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

  const marqueeText = "BYE BYE BERLIN";
  // Scroll fade: transparent when scrolling down, returns when scrolling back up.
  // Explicit cast avoids MotionValue<unknown> vs MotionValue<number> TS conflicts.
  const marqueeOpacity = useTransform(scrollY, [0, 520], [1, 0]) as MotionValue<number>;

  const headerTextColor = isScrolled ? "text-neutral-950" : "text-white";
  const headerBg = isScrolled
    ? "bg-white/95 backdrop-blur border-b border-black/10"
    : "bg-transparent";

  return (
    <div className="min-h-dvh bg-white text-neutral-950">
      {/* Fixed header: transparent over hero, turns white on scroll (500ms) */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[60]",
          "transition-[background-color,border-color,color] duration-500",
          headerBg,
          headerTextColor,
        )}
      >
        <div className="relative flex h-[76px] w-full items-center px-2 sm:px-4 lg:px-6">
          <div
            className={cn(
              "pointer-events-none absolute inset-x-0 flex justify-center",
            "font-sangbleu text-[18px] font-bold tracking-tight whitespace-nowrap leading-none",
            )}
          >
            BYE BYE BERLIN
          </div>

          <div className="absolute right-2 flex items-center gap-1 sm:right-4 lg:right-6">
            <HeaderIconButton label="Warenkorb" onClick={() => setCartOpen(true)}>
              <span className="relative">
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
            </HeaderIconButton>
            <HeaderIconButton label="User">
              <IconUser className="h-5 w-5" />
            </HeaderIconButton>
            <HeaderIconButton label="Suche">
              <IconSearch className="h-5 w-5" />
            </HeaderIconButton>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className={cn(
                "ml-1 inline-flex items-center gap-2 px-2 py-2",
                "text-xs font-medium uppercase tracking-[0.35em]",
                "transition-opacity hover:opacity-70",
                "focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2 focus:ring-offset-transparent",
              )}
              aria-label="Menu"
            >
              <IconMenu className="h-5 w-5" />
              <span className="hidden sm:inline">Menu</span>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero: fullscreen background video; marquee runs over it */}
        <section className="relative h-screen w-full overflow-hidden bg-neutral-950 text-white">
          <video
            className="absolute inset-0 h-full w-full object-cover object-[center_70%]"
            src="/hero-v2.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,.08),transparent_45%),radial-gradient(circle_at_80%_25%,rgba(255,255,255,.05),transparent_55%)]" />

          <HeroMarquee
            text={marqueeText}
            reducedMotion={!!reducedMotion}
            phase={0}
            className="z-10"
            opacity={marqueeOpacity}
          />

          {/* Bottom CTAs */}
          <div className="absolute inset-x-0 bottom-6 z-20 flex flex-col items-center px-5">
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
              <a
                href="#kollektion"
                className={cn(
                  "inline-flex h-12 min-w-44 items-center justify-center px-10",
                  "bg-white text-black hover:bg-white/90",
                  "font-sangbleu text-xs font-bold uppercase tracking-[0.28em]",
                  "ring-1 ring-white/40",
                )}
              >
                Clothes
              </a>
              <a
                href="#kollektion"
                className={cn(
                  "inline-flex h-12 min-w-44 items-center justify-center px-10",
                  "bg-white text-black hover:bg-white/90",
                  "font-sangbleu text-xs font-bold uppercase tracking-[0.28em]",
                  "ring-1 ring-white/40",
                )}
              >
                Bags
              </a>
            </div>
          </div>
        </section>

        {/* Content sections */}
        <section className="mx-auto max-w-6xl px-5 pb-6 pt-16">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <article
                key={p.id}
                className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_30px_80px_-60px_rgba(0,0,0,.65)]"
              >
                <div className="font-sangbleu text-xl font-bold">{p.name}</div>
                <div className="mt-2 text-sm text-neutral-600">{p.subtitle}</div>
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-neutral-800">{formatEUR(p.price)}</div>
                  <button
                    type="button"
                    onClick={() => addToCart(p.id)}
                    className="rounded-full bg-neutral-950 px-4 py-2 font-sangbleu text-xs font-bold uppercase tracking-[0.25em] text-white"
                  >
                    Add
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="kollektion"
          className="mx-auto max-w-6xl scroll-mt-24 px-5 pt-10"
        >
          <div className="rounded-[2rem] border border-black/10 bg-neutral-50 p-10">
            <div className="font-sangbleu text-3xl font-bold">Kollektion</div>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-700">
              Premium Essentials, klare Silhouetten, präzise Materialien.
            </p>
          </div>
        </section>

        <section id="story" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-black/10 bg-white p-10">
              <div className="text-[11px] uppercase tracking-[0.35em] text-neutral-600">
                Story
              </div>
              <div className="mt-3 font-sangbleu text-3xl font-bold">
                Berlin, aber refined.
              </div>
              <p className="mt-4 text-sm leading-relaxed text-neutral-700">
                Bye Bye Berlin ist ein Abschied von Lärm — und ein Hallo zu Präzision.
                Editorial, modern, luxuriös.
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

      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}

