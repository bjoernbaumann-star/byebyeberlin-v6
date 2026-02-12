import CenteredVideoHero from "../_components/CenteredVideoHero";
import ShopFooter from "../_components/ShopFooter";
import ShopNav from "../_components/ShopNav";
import ProductGrid from "../_components/shopify/ProductGrid";
import { getProductsByCollection, getStorefrontProducts } from "../../lib/shopify";

function isBag(handle: string, title: string): boolean {
  const h = handle.toLowerCase();
  const t = title.toLowerCase();
  return h.includes("bag") || t.includes("bag");
}

export default async function BagsPage() {
  let products = await getProductsByCollection("bags", 50);
  if (products.length === 0) {
    const all = await getStorefrontProducts(50);
    products = all.filter((p) => isBag(p.handle, p.title));
  }

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

