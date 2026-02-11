import CenteredVideoHero from "../_components/CenteredVideoHero";
import ShopFooter from "../_components/ShopFooter";
import ShopNav from "../_components/ShopNav";
import { SHOPIFY_MOCK_PRODUCTS } from "../../lib/shopify-mock";
import ProductGrid from "../_components/shopify/ProductGrid";

export default function BagsPage() {
  const products = SHOPIFY_MOCK_PRODUCTS.filter(
    (p) => p.category === "bags" || p.title.toLowerCase().includes("bag"),
  );

  return (
    <div className="min-h-dvh bg-white text-neutral-950">
      <ShopNav />
      <main className="pt-[76px]">
        <CenteredVideoHero primarySrc="/bags-hero.mp4" fallbackSrc="/hero-video.mp4" />

        <section className="mx-auto max-w-6xl px-5 pb-16 pt-14">
          <div className="text-[11px] uppercase tracking-[0.35em] text-neutral-600">
            Bye Bye Berlin
          </div>
          <h1 className="mt-3 font-sangbleu text-5xl font-bold tracking-tight">
            Bags
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-700">
            Structured shapes, polished hardware, and refined materials — made to
            travel well.
          </p>

          <div className="mt-10">
            <ProductGrid products={products} />
          </div>
        </section>
      </main>
      <ShopFooter />
    </div>
  );
}

