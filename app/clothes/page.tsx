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

        <section className="mx-auto max-w-6xl px-5 pb-20 pt-14">
          <h1 className="text-2xl font-medium tracking-tight text-neutral-950">
            Clothes
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Tailoring, essentials, and elevated silhouettes.
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

