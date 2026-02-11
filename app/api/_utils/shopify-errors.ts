export function toErrorMessage(err: unknown) {
  return err instanceof Error ? err.message : "Unknown error";
}

export function isShopifyConfigErrorMessage(message: string) {
  return (
    message.includes("Missing environment variable") ||
    message.includes("Missing SHOPIFY_STORE_DOMAIN")
  );
}

