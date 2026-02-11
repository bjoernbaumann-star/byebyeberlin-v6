"use client";

import Link from "next/link";
import React from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { ShopifyProduct } from "../../lib/shopify-types";
import ShopFooter from "./ShopFooter";
import ShopNav from "./ShopNav";
import ProductGrid from "./shopify/ProductGrid";

function cn(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

function HeroMarquee({
  text,
  reducedMotion,
  phase = 0,
  opacity,
}: {
  text: string;
  reducedMotion: boolean;
  phase?: number;
  opacity?: any;
}) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-1/2 -translate-y-1/2 whitespace-nowrap z-10"
      style={{
        opacity,
        whiteSpace: "nowrap",
        willChange: "transform",
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
              className="font-sangbleu text-[21vw] font-bold leading-none text-white whitespace-nowrap"
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
              className="font-sangbleu text-[21vw] font-bold leading-none text-white whitespace-nowrap"
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

export default function LandingPage() {
  const reducedMotion = useReducedMotion();
  const { scrollY } = useScroll();

  // Fade out on scroll down, returns when scrolling up.
  const marqueeOpacity = useTransform(scrollY, [0, 520], [1, 0]) as any;

  const [products, setProducts] = React.useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(
          `/api/shopify/products?t=${Date.now()}`,
          {
            cache: "no-store",
            headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
          },
        );
        const json = (await res.json()) as { products?: ShopifyProduct[] };
        if (!cancelled && Array.isArray(json?.products)) {
          setProducts(json.products);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-dvh bg-white text-neutral-950">
      <ShopNav transparentOnTop />

      <main>
        <section className="relative min-h-screen w-full overflow-hidden bg-neutral-950 text-white">
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
            text="BYE BYE BERLIN"
            reducedMotion={!!reducedMotion}
            phase={0}
            opacity={marqueeOpacity}
          />

          <div className="absolute inset-x-0 bottom-6 z-20 flex flex-col items-center px-5">
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
              <Link
                href="/clothes"
                className={cn(
                  "inline-flex h-12 min-w-44 items-center justify-center px-10",
                  "bg-white text-black hover:bg-white/90",
                  "font-sangbleu text-xs font-bold uppercase tracking-[0.28em]",
                  "ring-1 ring-white/40",
                )}
              >
                Clothes
              </Link>
              <Link
                href="/bags"
                className={cn(
                  "inline-flex h-12 min-w-44 items-center justify-center px-10",
                  "bg-white text-black hover:bg-white/90",
                  "font-sangbleu text-xs font-bold uppercase tracking-[0.28em]",
                  "ring-1 ring-white/40",
                )}
              >
                Bags
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-16 pt-16">
          <div className="text-[11px] uppercase tracking-[0.35em] text-neutral-600">
            Featured
          </div>
          <h2 className="mt-3 font-sangbleu text-4xl font-bold tracking-tight">
            Shop the edit
          </h2>
          <div className="mt-10">
            {loading ? (
              <div className="flex justify-center py-24">
                <div
                  className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-500"
                  aria-hidden="true"
                />
              </div>
            ) : products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <p className="py-24 text-center text-sm text-neutral-500">
                Produkte werden geladen oder sind aktuell nicht verfügbar.
              </p>
            )}
          </div>
        </section>
      </main>

      <ShopFooter />
    </div>
  );
}

