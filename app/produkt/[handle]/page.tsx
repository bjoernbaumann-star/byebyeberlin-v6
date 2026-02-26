import Link from "next/link";
import type { Metadata } from "next";
import { getProductByHandle, getProductsByCollectionSafe, getStorefrontProductsSafe } from "../../../lib/shopify";
import ShopNav from "../../_components/ShopNav";
import ShopFooter from "../../_components/ShopFooter";
import ProductDetailClient, { ProductDetailAddToCart } from "../../_components/shopify/ProductDetailClient";
import ProductGrid from "../../_components/shopify/ProductGrid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  try {
    const { handle } = await params;
    if (!handle) return { title: "Produkt nicht gefunden" };
    const product = await getProductByHandle(handle);
    if (!product) return { title: "Produkt nicht gefunden" };
    return {
      title: `${product.title ?? "Produkt"} | BYE BYE BERLIN`,
      description: product.description?.replace(/<[^>]*>/g, "").slice(0, 160) ?? undefined,
    };
  } catch {
    return { title: "Produkt nicht gefunden" };
  }
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
  let product: Awaited<ReturnType<typeof getProductByHandle>> = null;

  try {
    const { handle } = await params;
    if (handle) {
      product = await getProductByHandle(handle);
    }
  } catch {
    product = null;
  }

  if (!product) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white text-neutral-950">
        <p className="font-sangbleu text-lg">Produkt nicht gefunden</p>
      </div>
    );
  }

  const images = product?.images ?? [];
  const hasImages = images.length > 0 && images[0]?.url;
  const minPrice = product?.priceRange?.minVariantPrice;
  let clothesProducts = await getProductsByCollectionSafe("clothes", 24);
  if (clothesProducts.length === 0) {
    const all = await getStorefrontProductsSafe(50);
    const isClothes = (h: string, t: string) => {
      const hl = h.toLowerCase();
      const tl = t.toLowerCase();
      return hl.includes("tee") || hl.includes("sleeve") || hl.includes("shirt") || hl.includes("scarf") || hl.includes("belt") || tl.includes("tee") || tl.includes("shirt") || tl.includes("scarf") || tl.includes("belt");
    };
    clothesProducts = all?.filter((p) => isClothes(p.handle, p.title)) ?? [];
  }
  const otherProducts = clothesProducts.filter((p) => p.id !== product?.id);
  const priceStr =
    minPrice != null
      ? formatPrice(Number(minPrice.amount), minPrice.currencyCode ?? "EUR")
      : null;

  return (
    <div className="min-h-dvh bg-white text-neutral-950">
      <ShopNav />

      <main className="pt-[76px]">
        {/* Breadcrumb – bündig mit Nav */}
        <div className="px-4 py-6 lg:pl-6 lg:pr-6">
          <nav className="font-sangbleu text-xs text-neutral-500">
            <Link href="/" className="hover:text-neutral-950">
              BYE BYE BERLIN
            </Link>
            <span className="mx-2">/</span>
            <Link href="/" className="hover:text-neutral-950">
              The Selection
            </Link>
            <span className="mx-2">/</span>
            <span className="text-neutral-950">{product?.title ?? "Produkt"}</span>
          </nav>
        </div>

        {/* 2-Spalten-Layout: Bilder links, Infos rechts (sticky) */}
        <section className="w-full px-4 pb-20 lg:pl-6 lg:pr-6">
          <div className="grid w-full grid-cols-1 gap-10 pl-0 lg:grid-cols-2">
            {/* Linke Spalte: alle Produktbilder untereinander */}
            <div>
              {hasImages ? (
                <ProductDetailClient
                  images={images}
                  alt={images[0]?.altText ?? product?.title ?? "Produkt"}
                />
              ) : (
                <div className="font-sangbleu flex aspect-[3/4] w-full items-center justify-center bg-neutral-100 text-neutral-400">
                  Kein Bild
                </div>
              )}
            </div>

            {/* Rechte Spalte: Produktinfos (sticky beim Scrollen) */}
            <div className="flex flex-col lg:sticky lg:top-24 lg:h-fit">
              <h1 className="font-sangbleu text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
                {product?.title ?? "Produkt"}
              </h1>
              {priceStr != null ? (
                <p className="font-sangbleu mt-4 text-xl text-neutral-950">{priceStr}</p>
              ) : (
                <p className="font-sangbleu mt-4 text-xl text-neutral-500">Preis auf Anfrage</p>
              )}

              <ProductDetailAddToCart
                product={product}
                className="mt-8"
              />

              {(product?.descriptionHtml ?? product?.description) && (
                <div className="font-sangbleu mt-12 border-t border-neutral-200 pt-8">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-950">
                    Produktdetails
                  </h2>
                  <div className="mt-4 text-sm leading-relaxed text-neutral-600 [&>p]:mb-2">
                    {(() => {
                      const content = product?.descriptionHtml ?? product?.description ?? "";
                      const isHtml = typeof content === "string" && /<[a-z][\s\S]*>/i.test(content);
                      return isHtml ? (
                        <div className="font-sangbleu" dangerouslySetInnerHTML={{ __html: content }} />
                      ) : (
                        <p>{content}</p>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ProductGrid unter den Produktbildern */}
          {otherProducts.length > 0 && (
            <div className="mt-16 border-t border-neutral-200 pt-12">
              <h2 className="font-sangbleu mb-6 text-sm font-bold uppercase tracking-wider text-neutral-950">
                other nice stuff
              </h2>
              <ProductGrid products={otherProducts} showCount={false} />
            </div>
          )}
        </section>
      </main>

      <ShopFooter />
    </div>
  );
}
