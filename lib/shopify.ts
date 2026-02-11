import type { ShopifyProduct } from "./shopify-types";

type StorefrontResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

function getShopifyConfig(): { endpoint: string; token: string } | null {
  const domain =
    process.env.SHOPIFY_STORE_DOMAIN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
    "";
  const token =
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    "";
  if (!domain || !token) return null;
  const clean = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return {
    endpoint: `https://${clean}/api/2025-01/graphql.json`,
    token,
  };
}

export async function shopifyFetch<TData>({
  query,
  variables,
  tags,
  cache,
}: {
  query: string;
  variables?: Record<string, unknown>;
  tags?: string[];
  cache?: RequestCache;
}): Promise<TData> {
  const config = getShopifyConfig();
  if (!config) {
    throw new Error(
      "SHOPIFY_CONFIG_MISSING: NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN (or server equivalents) are required.",
    );
  }
  const { endpoint, token } = config;

  const isNoStore = cache === "no-store";
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    cache: cache ?? "force-cache",
    // Next.js caching hints (safe defaults) — avoid caching user-specific requests.
    ...(isNoStore ? {} : { next: { revalidate: 60, tags } }),
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
    cache: "no-store",
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

// -----------------------------
// Customer Accounts (classic)
// NOTE: This uses Storefront "customerAccessToken*" APIs (classic customer accounts).
// If your shop is configured to ONLY allow "New Customer Accounts", Shopify may reject these calls.
// In that case, we’ll surface a clear error message in the UI and can migrate to the Customer Account API flow.

export type CustomerAccessToken = {
  accessToken: string;
  expiresAt: string;
};

export type CustomerOrder = {
  id: string;
  name: string;
  orderNumber: number;
  processedAt: string;
  financialStatus?: string | null;
  fulfillmentStatus?: string | null;
  currentTotalPrice?: { amount: string; currencyCode: string } | null;
};

export type CustomerAddress = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  company?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  province?: string | null;
  country?: string | null;
  zip?: string | null;
  phone?: string | null;
};

export type ShopifyCustomer = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  defaultAddress?: CustomerAddress | null;
  addresses: CustomerAddress[];
  orders: CustomerOrder[];
};

type CustomerUserError = { field?: string[] | null; message: string; code?: string | null };

function formatUserErrors(errors?: CustomerUserError[] | null) {
  const msgs = (errors ?? []).map((e) => e.message).filter(Boolean);
  return msgs.length ? msgs.join("; ") : null;
}

const CUSTOMER_ACCESS_TOKEN_CREATE = /* GraphQL */ `
  mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export async function customerAccessTokenCreate(input: {
  email: string;
  password: string;
}): Promise<CustomerAccessToken> {
  const data = await shopifyFetch<{
    customerAccessTokenCreate: {
      customerAccessToken: CustomerAccessToken | null;
      customerUserErrors: CustomerUserError[];
    };
  }>({
    query: CUSTOMER_ACCESS_TOKEN_CREATE,
    variables: { input },
    cache: "no-store",
  });

  const errs = formatUserErrors(data.customerAccessTokenCreate.customerUserErrors);
  if (errs) throw new Error(errs);
  const token = data.customerAccessTokenCreate.customerAccessToken;
  if (!token?.accessToken) throw new Error("Login failed: missing access token.");
  return token;
}

const CUSTOMER_CREATE = /* GraphQL */ `
  mutation CustomerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        firstName
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export async function customerCreate(input: {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}): Promise<{ id: string; firstName?: string | null }> {
  // Storefront API requires password; for New Customer Accounts we use a generated one
  const inputWithPassword = {
    ...input,
    password: input.password ?? crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().slice(0, 8),
  };
  const data = await shopifyFetch<{
    customerCreate: {
      customer: { id: string; firstName?: string | null } | null;
      customerUserErrors: CustomerUserError[];
    };
  }>({
    query: CUSTOMER_CREATE,
    variables: { input: inputWithPassword },
    cache: "no-store",
  });

  const errs = formatUserErrors(data.customerCreate.customerUserErrors);
  if (errs) throw new Error(errs);
  const c = data.customerCreate.customer;
  if (!c?.id) throw new Error("Registration failed: missing customer id.");
  return c;
}

const ADDRESS_FIELDS = /* GraphQL */ `
  fragment AddressFields on MailingAddress {
    id
    firstName
    lastName
    company
    address1
    address2
    city
    province
    country
    zip
    phone
  }
`;

const CUSTOMER_QUERY = /* GraphQL */ `
  ${ADDRESS_FIELDS}
  query Customer($token: String!, $ordersFirst: Int!, $addressesFirst: Int!) {
    customer(customerAccessToken: $token) {
      id
      firstName
      lastName
      email
      phone
      defaultAddress {
        ...AddressFields
      }
      addresses(first: $addressesFirst) {
        edges {
          node {
            ...AddressFields
          }
        }
      }
      orders(first: $ordersFirst, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            name
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            currentTotalPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export async function getCustomerByAccessToken(
  token: string,
  opts?: { ordersFirst?: number; addressesFirst?: number },
): Promise<ShopifyCustomer> {
  const data = await shopifyFetch<{
    customer: {
      id: string;
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
      phone?: string | null;
      defaultAddress?: CustomerAddress | null;
      addresses: { edges: Array<{ node: CustomerAddress }> };
      orders: { edges: Array<{ node: CustomerOrder }> };
    } | null;
  }>({
    query: CUSTOMER_QUERY,
    variables: {
      token,
      ordersFirst: opts?.ordersFirst ?? 10,
      addressesFirst: opts?.addressesFirst ?? 10,
    },
    cache: "no-store",
  });

  if (!data.customer) {
    throw new Error(
      "Not authenticated. If your shop uses only “New Customer Accounts”, classic customer tokens may be disabled.",
    );
  }

  return {
    id: data.customer.id,
    firstName: data.customer.firstName ?? null,
    lastName: data.customer.lastName ?? null,
    email: data.customer.email ?? null,
    phone: data.customer.phone ?? null,
    defaultAddress: data.customer.defaultAddress ?? null,
    addresses: data.customer.addresses.edges.map((e) => e.node),
    orders: data.customer.orders.edges.map((e) => e.node),
  };
}

const CUSTOMER_ADDRESS_CREATE = /* GraphQL */ `
  ${ADDRESS_FIELDS}
  mutation CustomerAddressCreate($token: String!, $address: MailingAddressInput!) {
    customerAddressCreate(customerAccessToken: $token, address: $address) {
      customerAddress {
        ...AddressFields
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export async function customerAddressCreate(
  token: string,
  address: Omit<CustomerAddress, "id">,
): Promise<CustomerAddress> {
  const data = await shopifyFetch<{
    customerAddressCreate: {
      customerAddress: CustomerAddress | null;
      customerUserErrors: CustomerUserError[];
    };
  }>({
    query: CUSTOMER_ADDRESS_CREATE,
    variables: { token, address },
    cache: "no-store",
  });

  const errs = formatUserErrors(data.customerAddressCreate.customerUserErrors);
  if (errs) throw new Error(errs);
  const a = data.customerAddressCreate.customerAddress;
  if (!a?.id) throw new Error("Failed to create address.");
  return a;
}

const CUSTOMER_ADDRESS_DELETE = /* GraphQL */ `
  mutation CustomerAddressDelete($token: String!, $addressId: ID!) {
    customerAddressDelete(customerAccessToken: $token, id: $addressId) {
      deletedCustomerAddressId
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export async function customerAddressDelete(token: string, addressId: string): Promise<void> {
  const data = await shopifyFetch<{
    customerAddressDelete: {
      deletedCustomerAddressId: string | null;
      customerUserErrors: CustomerUserError[];
    };
  }>({
    query: CUSTOMER_ADDRESS_DELETE,
    variables: { token, addressId },
    cache: "no-store",
  });

  const errs = formatUserErrors(data.customerAddressDelete.customerUserErrors);
  if (errs) throw new Error(errs);
  if (!data.customerAddressDelete.deletedCustomerAddressId) {
    throw new Error("Failed to delete address.");
  }
}

const CUSTOMER_DEFAULT_ADDRESS_UPDATE = /* GraphQL */ `
  mutation CustomerDefaultAddressUpdate($token: String!, $addressId: ID!) {
    customerDefaultAddressUpdate(customerAccessToken: $token, addressId: $addressId) {
      customer {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export async function customerDefaultAddressUpdate(
  token: string,
  addressId: string,
): Promise<void> {
  const data = await shopifyFetch<{
    customerDefaultAddressUpdate: {
      customer: { id: string } | null;
      customerUserErrors: CustomerUserError[];
    };
  }>({
    query: CUSTOMER_DEFAULT_ADDRESS_UPDATE,
    variables: { token, addressId },
    cache: "no-store",
  });

  const errs = formatUserErrors(data.customerDefaultAddressUpdate.customerUserErrors);
  if (errs) throw new Error(errs);
  if (!data.customerDefaultAddressUpdate.customer?.id) {
    throw new Error("Failed to update default address.");
  }
}

