export type ShopifyImage = {
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

export type ShopifyMoney = {
  amount: string; // Shopify returns money values as strings
  currencyCode: string;
};

export type ShopifyPriceRange = {
  minVariantPrice: ShopifyMoney;
  maxVariantPrice: ShopifyMoney;
};

export type ShopifyProductOption = {
  name: string;
  values: string[];
};

export type ShopifyProductVariant = {
  id: string;
  selectedOptions?: Array<{ name: string; value: string }>;
};

export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  description?: string | null;
  /** Formatiert (HTML) – aus Shopify product.descriptionHtml */
  descriptionHtml?: string | null;
  priceRange: ShopifyPriceRange;
  images: ShopifyImage[];
  onlineStoreUrl?: string | null;

  /** GID für Variant (z.B. gid://shopify/ProductVariant/...) – für Checkout/Cart */
  firstVariantId?: string | null;

  /** Produkt-Optionen (z.B. Farbe, Größe) – aus Shopify product.options */
  options?: ShopifyProductOption[];

  /** Produkt-Varianten – aus Shopify product.variants */
  variants?: ShopifyProductVariant[];

  // optional UI helpers (not from Shopify by default)
  category?: "bags" | "clothes" | "other";
};

