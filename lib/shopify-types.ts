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

export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  description?: string | null;
  priceRange: ShopifyPriceRange;
  images: ShopifyImage[];
  onlineStoreUrl?: string | null;

  /** GID für Variant (z.B. gid://shopify/ProductVariant/...) – für Checkout/Cart */
  firstVariantId?: string | null;

  // optional UI helpers (not from Shopify by default)
  category?: "bags" | "clothes" | "other";
};

