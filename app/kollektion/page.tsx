import ShopFooter from "../_components/ShopFooter";
import ShopNav from "../_components/ShopNav";
import ProductGrid from "../_components/shopify/ProductGrid";
import { getStorefrontProductsSafe } from "../../lib/shopify";

function isBagProduct(handle: string, title: string): boolean {
  const h = handle.toLowerCase();
  const t = (title ?? "").toLowerCase();
  return h.includes("bag") || t.includes("bag") || h.includes("tasche") || t.includes("tasche");
}

export default async function KollektionPage() {
  const products = await getStorefrontProductsSafe(50);

  return (
    <div className="min-h-dvh bg-white text-neutral-950">
      <ShopNav />
      <main className="pt-[76px]">
        <section className="mx-auto max-w-6xl px-5 py-16">
          <div className="font-sangbleu text-[11px] uppercase tracking-[0.35em] text-neutral-600">
            BYE BYE BERLIN
          </div>
          <h1 className="mt-3 font-sangbleu text-5xl font-bold tracking-tight">
            COLLECTION
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-700">
            The full edit — Clothes, Bags and Essentials.
          </p>

          <div className="mt-10">
            <ProductGrid
              products={products}
              showSizeSelection={(p) => !isBagProduct(p.handle, p.title ?? "")}
            />
          </div>
        </section>
      </main>
      <ShopFooter />
    </div>
  );
}

