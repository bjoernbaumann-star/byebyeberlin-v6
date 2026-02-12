/**
 * Temporäres Debug-Skript: Shopify Storefront API testen
 * Führt npx tsx debug-shopify.ts aus
 */

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

// .env.local laden (ohne dotenv)
function loadEnv() {
  const paths = [".env.local", "app/.env.local"];
  for (const rel of paths) {
    const p = resolve(process.cwd(), rel);
    if (existsSync(p)) {
      console.log(`[DEBUG] Lade Env aus: ${rel}`);
      const content = readFileSync(p, "utf8");
      for (const line of content.split("\n")) {
        const match = line.match(/^([^#=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim().replace(/^["']|["']$/g, "");
          process.env[key] = value;
        }
      }
      return;
    }
  }
  console.warn("[DEBUG] Keine .env.local gefunden");
}

loadEnv();

const domain =
  process.env.SHOPIFY_STORE_DOMAIN ||
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
  "";
const token =
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
  "";

const PRODUCTS_QUERY = `
  query Products($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          onlineStoreUrl
          priceRange {
            minVariantPrice { amount currencyCode }
            maxVariantPrice { amount currencyCode }
          }
          images(first: 10) {
            nodes { url altText width height }
          }
        }
      }
    }
  }
`;

async function main() {
  console.log("\n=== Shopify Debug: Erste 5 Produkte abrufen ===\n");

  const hasDomain = !!domain;
  const hasToken = !!token;
  const domainMasked = domain ? `${domain.slice(0, 10)}...` : "(leer)";
  const tokenMasked = token ? `${token.slice(0, 8)}...` : "(leer)";

  console.log("Konfiguration:");
  console.log("  SHOPIFY_STORE_DOMAIN:", hasDomain ? domainMasked : "FEHLT");
  console.log("  SHOPIFY_STOREFRONT_ACCESS_TOKEN:", hasToken ? tokenMasked : "FEHLT");
  console.log();

  if (!domain || !token) {
    console.error(
      "FEHLER: Domain oder Token fehlen. Prüfe .env.local (NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN, NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN)"
    );
    process.exit(1);
  }

  const clean = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const endpoint = `https://${clean}/api/2025-01/graphql.json`;

  console.log("Endpoint:", endpoint);
  console.log("Request: products(first: 5)");
  console.log();

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query: PRODUCTS_QUERY, variables: { first: 5 } }),
    });

    const text = await res.text();
    let json: Record<string, unknown>;

    try {
      json = JSON.parse(text) as Record<string, unknown>;
    } catch {
      console.error("Antwort ist kein gültiges JSON:");
      console.error(text.slice(0, 500));
      process.exit(1);
    }

    // HTTP-Fehler
    if (!res.ok) {
      console.error("HTTP-Fehler:", res.status, res.statusText);
      console.error("Body:", JSON.stringify(json, null, 2));
      process.exit(1);
    }

    // GraphQL Errors
    const errors = json.errors as Array<{ message: string }> | undefined;
    if (errors?.length) {
      console.error("GraphQL-Fehler von Shopify:");
      errors.forEach((e) => console.error("  -", e.message));
      console.error("\nVollständige Antwort:", JSON.stringify(json, null, 2));
      process.exit(1);
    }

    const data = json.data as Record<string, unknown>;
    const products = data?.products as { edges: Array<{ node: unknown }> } | undefined;
    const edges = products?.edges ?? [];

    console.log("Ergebnis: products.edges.length =", edges.length);

    if (edges.length === 0) {
      console.log("\n>>> API gibt LEERES ARRAY zurück ([]). <<<");
      console.log(
        "Vermutliche Ursache: Shopify Admin → Sales Channels → Online Store."
      );
      console.log(
        "Stelle sicher, dass deine Produkte im 'Online Store' Channel veröffentlicht sind."
      );
      console.log("\nRohantwort (data):", JSON.stringify(data, null, 2));
      process.exit(0);
    }

    console.log("\nErste 5 Produkte (edges[].node):");
    edges.slice(0, 5).forEach((e, i) => {
      const n = e.node as Record<string, unknown>;
      console.log(`  [${i}] ${(n.title as string) ?? "(kein Titel)"} (handle: ${n.handle ?? "-"})`);
    });

    console.log("\nStruktur edges[0].node:");
    console.log(JSON.stringify(edges[0]?.node, null, 2));
    console.log("\n>>> Debug erfolgreich: Produkte werden korrekt geliefert. <<<");
  } catch (err) {
    console.error("\n>>> Unbehandelter Fehler: <<<");
    console.error(err);
    if (err instanceof Error) {
      console.error("Message:", err.message);
      console.error("Stack:", err.stack);
    }
    process.exit(1);
  }
}

main();
