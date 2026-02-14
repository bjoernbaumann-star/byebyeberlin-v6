"use client";

import Link from "next/link";
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { ShopifyProduct } from "../../lib/shopify-types";
import ShopFooter from "./ShopFooter";
import ShopNav from "./ShopNav";
import ProductGrid from "./shopify/ProductGrid";

export default function LandingPage() {
  const reducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]) as any;

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

  const categories = [
    { label: "Clothes", href: "/clothes", description: "Tailoring & essentials" },
    { label: "Bags", href: "/bags", description: "Structured shapes" },
    { label: "Collection", href: "/kollektion", description: "Curated selection" },
  ];

  return (
    <div className="min-h-dvh bg-white text-neutral-950">
      <ShopNav transparentOnTop />

      <main>
        {/* Hero – full-width, minimal overlay */}
        <section className="relative min-h-screen w-full overflow-hidden bg-neutral-950">
          <video
            className="absolute inset-0 h-full w-full object-cover object-center"
            src="/bg_video_landingpage.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          <div className="absolute inset-0 bg-black/20" />
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center"
            style={{ opacity: heroOpacity }}
          >
            <h1 className="text-4xl font-medium tracking-tight text-white sm:text-5xl md:text-6xl">
              BYE BYE BERLIN
            </h1>
            <p className="mt-4 max-w-md text-sm font-normal tracking-wide text-white/90 sm:text-base">
              Bags and clothes made for everyday.
            </p>
            <Link
              href="#products"
              className="mt-10 inline-flex h-12 items-center justify-center px-8 text-xs font-medium uppercase tracking-[0.2em] text-white underline underline-offset-4 decoration-white/60 hover:decoration-white transition-all"
            >
              To the products
            </Link>
          </motion.div>
        </section>

        {/* Category tiles – FREITAG-style grid */}
        <section className="border-t border-black/10 bg-white">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <div className="grid grid-cols-1 gap-px bg-black/10 sm:grid-cols-3">
              {categories.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="group flex flex-col bg-white p-8 transition-colors hover:bg-neutral-50"
                >
                  <span className="text-2xl font-medium tracking-tight text-neutral-950 group-hover:underline">
                    {cat.label}
                  </span>
                  <span className="mt-1 text-xs uppercase tracking-widest text-neutral-500">
                    {cat.description}
                  </span>
                  <span className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-neutral-700 group-hover:text-neutral-950">
                    Discover →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Products – FRESHLY UPLOADED style */}
        <section id="products" className="border-t border-black/10 bg-white">
          <div className="mx-auto max-w-6xl px-5 pb-20 pt-16">
            <div className="mb-10">
              <h2 className="text-2xl font-medium tracking-tight text-neutral-950">
                Freshly uploaded
              </h2>
              <p className="mt-2 text-sm text-neutral-600">
                New items are added regularly. Check in so you don&apos;t miss your favorite.
              </p>
            </div>
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
              <div className="py-24 text-center">
                <p className="text-neutral-600">No products yet.</p>
                <Link
                  href="/clothes"
                  className="mt-4 inline-block text-sm font-medium uppercase tracking-widest text-neutral-950 underline underline-offset-4"
                >
                  See all products
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <ShopFooter />
    </div>
  );
}
