import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getProductByHandle } from "../../../lib/shopify";
import ShopNav from "../../_components/ShopNav";
import ShopFooter from "../../_components/ShopFooter";
import ProductDetailClient from "../../_components/shopify/ProductDetailClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) return { title: "Produkt nicht gefunden" };
  return {
    title: `${product.title} | Bye Bye Berlin`,
    description: product.description?.replace(/<[^>]*>/g, "").slice(0, 160),
  };
}

function formatPrice(amount: number, currencyCode: string) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: currencyCode || "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  const priceStr = formatPrice(
    Number(product.priceRange.minVariantPrice.amount),
    product.priceRange.minVariantPrice.currencyCode
  );

  return (
    <div className="min-h-dvh bg-white text-neutral-950">
      <ShopNav />

      <main className="pt-[76px]">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-6xl px-5 py-6">
          <nav className="text-xs text-neutral-500">
            <Link href="/" className="hover:text-neutral-950">
              Bye Bye Berlin
            </Link>
            <span className="mx-2">/</span>
            <Link href="/" className="hover:text-neutral-950">
              The Selection
            </Link>
            <span className="mx-2">/</span>
            <span className="text-neutral-950">{product.title}</span>
          </nav>
        </div>

        {/* Product Layout – Prada-Style: Bild links, Infos rechts */}
        <section className="mx-auto max-w-6xl px-5 pb-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Bildgalerie */}
            <div className="aspect-[3/4] overflow-hidden rounded-none border-0 bg-transparent">
              {product.images?.[0]?.url ? (
                <ProductDetailClient
                  images={product.images}
                  alt={product.images[0].altText ?? product.title}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-neutral-400">
                  Kein Bild
                </div>
              )}
            </div>

            {/* Produktinfos */}
            <div className="flex flex-col">
              <h1 className="font-sangbleu text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
                {product.title}
              </h1>
              <p className="mt-4 text-xl text-neutral-950">{priceStr}</p>

              {/* Farbe – Platzhalter */}
              <div className="mt-6">
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-600">
                  Farbe
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="h-4 w-4 shrink-0 rounded-full border border-neutral-300 bg-neutral-200" />
                  <span className="text-sm text-neutral-600">—</span>
                </div>
              </div>

              {/* Zum Warenkorb */}
              <ProductDetailClient.AddToCart
                product={product}
                className="mt-8 w-full border border-neutral-950 bg-white py-4 text-sm font-medium uppercase tracking-wider text-neutral-950 transition-colors hover:bg-neutral-950 hover:text-white"
              />

              {/* Produktdetails */}
              {product.description && (
                <div className="mt-12 border-t border-neutral-200 pt-8">
                  <h2 className="font-sangbleu text-sm font-bold uppercase tracking-wider text-neutral-950">
                    Produktdetails
                  </h2>
                  <div
                    className="mt-4 text-sm leading-relaxed text-neutral-600 [&>p]:mb-2"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              )}

              {/* Versand */}
              <div className="mt-8 border-t border-neutral-200 pt-8">
                <h2 className="font-sangbleu text-sm font-bold uppercase tracking-wider text-neutral-950">
                  Versand und Rückgabe
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                  Kostenloser Versand. Rückgabe innerhalb von 14 Tagen möglich.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ShopFooter />
    </div>
  );
}
