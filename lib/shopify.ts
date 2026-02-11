import type { ShopifyProduct } from "./shopify-types";

type StorefrontResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

function getRequiredEnv(name: string) {
  const v = process.env[name];
  if (!v) {
    throw new Error(`Missing environment variable ${name}`);
  }
  return v;
}

function getShopifyEndpoint() {
  // Prefer custom domain or myshopify domain without protocol, e.g. "byebyberlin.store" or "byebyberlin.myshopify.com"
  const domain =
    process.env.SHOPIFY_STORE_DOMAIN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
    "";
  if (!domain) {
    throw new Error(
      "Missing SHOPIFY_STORE_DOMAIN (e.g. byebyberlin.myshopify.com or your custom domain).",
    );
  }
  const clean = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
  // Shopify Storefront API endpoint (version can be adjusted later)
  return `https://${clean}/api/2025-01/graphql.json`;
}

export async function shopifyFetch<TData>({
  query,
  variables,
  tags,
}: {
  query: string;
  variables?: Record<string, unknown>;
  tags?: string[];
}): Promise<TData> {
  const endpoint = getShopifyEndpoint();
  const token = getRequiredEnv("SHOPIFY_STOREFRONT_ACCESS_TOKEN");

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    // Next.js caching hints (safe defaults)
    next: { revalidate: 60, tags },
  });

  if (!res.ok) {
    throw new Error(`Shopify request failed: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as StorefrontResponse<TData>;
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }
  if (!json.data) {
    throw new Error("Shopify response missing data");
  }
  return json.data;
}

type ProductsQueryData = {
  products: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        handle: string;
        onlineStoreUrl: string | null;
        priceRange: {
          minVariantPrice: { amount: string; currencyCode: string };
          maxVariantPrice: { amount: string; currencyCode: string };
        };
        images: {
          nodes: Array<{
            url: string;
            altText: string | null;
            width: number | null;
            height: number | null;
          }>;
        };
      };
    }>;
  };
};

const PRODUCTS_QUERY = /* GraphQL */ `
  query Products($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          onlineStoreUrl
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 10) {
            nodes {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
`;

export async function getStorefrontProducts(first = 24): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<ProductsQueryData>({
    query: PRODUCTS_QUERY,
    variables: { first },
    tags: ["shopify-products"],
  });

  return data.products.edges.map(({ node }) => ({
    id: node.id,
    title: node.title,
    handle: node.handle,
    onlineStoreUrl: node.onlineStoreUrl,
    priceRange: node.priceRange,
    images: node.images.nodes,
  }));
}

