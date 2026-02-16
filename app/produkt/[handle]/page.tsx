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
  try {
    const { handle } = await params;
    if (!handle) return { title: "Produkt nicht gefunden" };
    const product = await getProductByHandle(handle);
    if (!product) return { title: "Produkt nicht gefunden" };
    return {
      title: `${product.title ?? "Produkt"} | Bye Bye Berlin`,
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
    if (!handle) {
      notFound();
    }
    product = await getProductByHandle(handle);
  } catch {
    notFound();
  }

  if (!product) {
    notFound();
  }

  const images = product.images ?? [];
  const hasImages = images.length > 0 && images[0]?.url;
  const minPrice = product.priceRange?.minVariantPrice;
  const priceStr =
    minPrice != null
      ? formatPrice(Number(minPrice.amount), minPrice.currencyCode ?? "EUR")
      : null;

  const options = product.options ?? [];
  const colorOption = options.find(
    (o) => o?.name && /^(color|farbe|colour)$/i.test(o.name.trim())
  );
  const colorValues = colorOption?.values?.filter(Boolean) ?? [];
  const firstVariant = product.variants?.[0];
  const selectedColor =
    firstVariant?.selectedOptions?.find(
      (s) => s?.name && /^(color|farbe|colour)$/i.test(s.name.trim())
    )?.value ?? colorValues[0];

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
            <span className="text-neutral-950">{product.title ?? "Produkt"}</span>
          </nav>
        </div>

        {/* Product Layout – Prada-Style: Bild links, Infos rechts */}
        <section className="mx-auto max-w-6xl px-5 pb-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Bildgalerie */}
            <div className="aspect-[3/4] overflow-hidden rounded-none border-0 bg-transparent">
              {hasImages ? (
                <ProductDetailClient
                  images={images}
                  alt={images[0]?.altText ?? product.title ?? "Produkt"}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-neutral-400">
                  Kein Bild
                </div>
              )}
            </div>

            {/* Produktinfos */}
            <div className="flex flex-col">
              <h1 className="font-sangbleu text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
                {product.title ?? "Produkt"}
              </h1>
              {priceStr != null ? (
                <p className="mt-4 text-xl text-neutral-950">{priceStr}</p>
              ) : (
                <p className="mt-4 text-xl text-neutral-500">Preis auf Anfrage</p>
              )}

              {/* Farbe – nur wenn Option in Shopify vorhanden */}
              {colorValues.length > 0 && (
                <div className="mt-6">
                  <p className="text-xs font-medium uppercase tracking-wider text-neutral-600">
                    {colorOption?.name ?? "Farbe"}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="h-4 w-4 shrink-0 rounded-full border border-neutral-300 bg-neutral-200" />
                    <span className="text-sm text-neutral-600">
                      {selectedColor ?? colorValues.join(", ")}
                    </span>
                  </div>
                </div>
              )}

              {/* Zum Warenkorb */}
              <ProductDetailClient.AddToCart
                product={product}
                className="mt-8 w-full border border-neutral-950 bg-white py-4 text-sm font-medium uppercase tracking-wider text-neutral-950 transition-colors hover:bg-neutral-950 hover:text-white"
              />

              {/* Produktdetails – nur wenn descriptionHtml/description in Shopify vorhanden */}
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
            </div>
          </div>
        </section>
      </main>

      <ShopFooter />
    </div>
  );
}
