import CenteredVideoHero from "../_components/CenteredVideoHero";
import ShopFooter from "../_components/ShopFooter";
import ShopNav from "../_components/ShopNav";
import ProductGrid from "../_components/shopify/ProductGrid";
import { getProductsByCollectionSafe, getStorefrontProductsSafe } from "../../lib/shopify";

function isClothes(handle: string, title: string): boolean {
  const h = handle.toLowerCase();
  const t = title.toLowerCase();
  return h.includes("tee") || h.includes("sleeve") || h.includes("shirt") || h.includes("scarf") || h.includes("belt") || t.includes("tee") || t.includes("shirt") || t.includes("scarf") || t.includes("belt");
}

export default async function ClothesPage() {
  let products = await getProductsByCollectionSafe("clothes", 50);
  if (products.length === 0) {
    const all = await getStorefrontProductsSafe(50);
    products = all.filter((p) => isClothes(p.handle, p.title));
  }

  return (
    <div className="min-h-dvh bg-white text-neutral-950">
      <ShopNav />
      <main className="pt-[76px]">
        <CenteredVideoHero
          primarySrc="/clothes-hero.mp4"
          fallbackSrc="/hero-video.mp4"
        />

        <section className="mx-auto max-w-6xl px-5 pb-16 pt-14">
          <div className="text-[11px] uppercase tracking-[0.35em] text-neutral-600">
            BYE BYE BERLIN
          </div>
          <h1 className="mt-3 font-sangbleu text-5xl font-bold tracking-tight">
            CLOTHES
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-700">
            Tailoring, essentials, and elevated silhouettes — curated for a quiet
            luxury finish.
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

