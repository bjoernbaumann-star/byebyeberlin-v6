import CenteredVideoHero from "../_components/CenteredVideoHero";
import ShopFooter from "../_components/ShopFooter";
import ShopNav from "../_components/ShopNav";
import ProductGrid from "../_components/shopify/ProductGrid";
import { getProductsByCollectionSafe, getStorefrontProductsSafe } from "../../lib/shopify";

function isAccessoire(handle: string, title: string): boolean {
  const h = handle.toLowerCase();
  const t = title.toLowerCase();
  return (
    h.includes("scarf") ||
    h.includes("belt") ||
    h.includes("accessoire") ||
    t.includes("scarf") ||
    t.includes("belt") ||
    t.includes("accessoire")
  );
}

export default async function AccessoiresPage() {
  let products = await getProductsByCollectionSafe("accessoires", 50);
  if (products.length === 0) {
    const all = await getStorefrontProductsSafe(50);
    products = all.filter((p) => isAccessoire(p.handle, p.title));
  }

  return (
    <div className="min-h-dvh bg-white text-neutral-950">
      <ShopNav />
      <main className="pt-[76px]">
        <CenteredVideoHero primarySrc="/hero-video.mp4" fallbackSrc="/hero-video.mp4" />

        <section className="mx-auto max-w-6xl px-5 pb-16 pt-14">
          <div className="font-sangbleu text-[11px] uppercase tracking-[0.35em] text-neutral-600">
            BYE BYE BERLIN
          </div>
          <h1 className="mt-3 font-sangbleu text-5xl font-bold tracking-tight">
            ACCESSOIRES
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-700">
            Scarves, belts and more — the finishing touches.
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
