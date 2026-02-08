import ShopFooter from "../_components/ShopFooter";
import ShopNav from "../_components/ShopNav";
import { PRODUCTS } from "../_data/products";

export default function KollektionPage() {
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

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((p) => (
              <article
                key={p.id}
                className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_30px_80px_-60px_rgba(0,0,0,.65)]"
              >
                <div className="font-sangbleu text-xl font-bold">{p.name}</div>
                <div className="mt-2 text-sm text-neutral-600">{p.subtitle}</div>
                <div className="mt-6 flex items-center justify-between text-sm">
                  <span className="text-neutral-500">{p.category}</span>
                  <span className="text-neutral-800">
                    {new Intl.NumberFormat("de-DE", {
                      style: "currency",
                      currency: "EUR",
                      maximumFractionDigits: 0,
                    }).format(p.price)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <ShopFooter />
    </div>
  );
}

