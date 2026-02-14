import CenteredVideoHero from "../_components/CenteredVideoHero";
import ShopFooter from "../_components/ShopFooter";
import ShopNav from "../_components/ShopNav";
import ProductGrid from "../_components/shopify/ProductGrid";
import { getProductsByCollectionSafe, getStorefrontProductsSafe } from "../../lib/shopify";

function isBag(handle: string, title: string): boolean {
  const h = handle.toLowerCase();
  const t = title.toLowerCase();
  return h.includes("bag") || t.includes("bag");
}

export default async function BagsPage() {
  let products = await getProductsByCollectionSafe("bags", 50);
  if (products.length === 0) {
    const all = await getStorefrontProductsSafe(50);
    products = all.filter((p) => isBag(p.handle, p.title));
  }

  return (
    <div className="min-h-dvh bg-white text-neutral-950">
      <ShopNav />
      <main className="pt-[76px]">
        <CenteredVideoHero primarySrc="/bags-hero.mp4" fallbackSrc="/hero-video.mp4" />

        <section className="mx-auto max-w-6xl px-5 pb-20 pt-14">
          <h1 className="text-2xl font-medium tracking-tight text-neutral-950">
            Bags
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Structured shapes, polished hardware, and refined materials.
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

