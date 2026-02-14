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
        <section className="mx-auto max-w-6xl px-5 pb-20 pt-14">
          <h1 className="text-2xl font-medium tracking-tight text-neutral-950">
            Collection
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            The full edit — Clothes, Bags and Essentials.
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

