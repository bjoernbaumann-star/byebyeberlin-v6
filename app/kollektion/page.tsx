import ShopFooter from "../_components/ShopFooter";
import ShopNav from "../_components/ShopNav";
import ProductGrid from "../_components/shopify/ProductGrid";
import { getStorefrontProductsSafe } from "../../lib/shopify";

export default async function KollektionPage() {
  const products = await getStorefrontProductsSafe(50);

  return (
    <div className="min-h-dvh bg-white text-neutral-950">
      <ShopNav />
      <main className="pt-[76px]">
        <section className="mx-auto max-w-6xl px-5 py-16">
          <div className="text-[11px] uppercase tracking-[0.35em] text-neutral-600">
            Bye Bye Berlin
          </div>
          <h1 className="mt-3 font-sangbleu text-5xl font-bold tracking-tight">
            Kollektion
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-700">
            Der gesamte Edit — Clothes, Bags und Essentials.
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

