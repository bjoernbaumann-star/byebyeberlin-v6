import type { ShopifyProduct } from "./shopify-types";

export const SHOPIFY_MOCK_PRODUCTS: ShopifyProduct[] = [
  {
    id: "gid://shopify/Product/1000000000001",
    title: "Noir Signature Tee",
    handle: "noir-signature-tee",
    category: "clothes",
    priceRange: {
      minVariantPrice: { amount: "140", currencyCode: "EUR" },
      maxVariantPrice: { amount: "140", currencyCode: "EUR" },
    },
    images: [
      {
        url: "/mock/noir-tee.jpg",
        altText: "Noir Signature Tee",
        width: 1200,
        height: 1500,
      },
    ],
  },
  {
    id: "gid://shopify/Product/1000000000002",
    title: "Emerald Leather Belt",
    handle: "emerald-leather-belt",
    category: "clothes",
    priceRange: {
      minVariantPrice: { amount: "290", currencyCode: "EUR" },
      maxVariantPrice: { amount: "290", currencyCode: "EUR" },
    },
    images: [
      {
        url: "/mock/emerald-belt.jpg",
        altText: "Emerald Leather Belt",
        width: 1200,
        height: 1500,
      },
    ],
  },
  {
    id: "gid://shopify/Product/1000000000003",
    title: "Ivory Silk Scarf",
    handle: "ivory-silk-scarf",
    category: "clothes",
    priceRange: {
      minVariantPrice: { amount: "220", currencyCode: "EUR" },
      maxVariantPrice: { amount: "220", currencyCode: "EUR" },
    },
    images: [
      {
        url: "/mock/ivory-scarf.jpg",
        altText: "Ivory Silk Scarf",
        width: 1200,
        height: 1500,
      },
    ],
  },
  {
    id: "gid://shopify/Product/1000000000004",
    title: "Nightfall Sunglasses",
    handle: "nightfall-sunglasses",
    category: "other",
    priceRange: {
      minVariantPrice: { amount: "310", currencyCode: "EUR" },
      maxVariantPrice: { amount: "310", currencyCode: "EUR" },
    },
    images: [
      {
        url: "/mock/nightfall-sunglasses.jpg",
        altText: "Nightfall Sunglasses",
        width: 1200,
        height: 1500,
      },
    ],
  },
  {
    id: "gid://shopify/Product/1000000000005",
    title: "Emerald Mini Bag",
    handle: "emerald-mini-bag",
    category: "bags",
    priceRange: {
      minVariantPrice: { amount: "640", currencyCode: "EUR" },
      maxVariantPrice: { amount: "640", currencyCode: "EUR" },
    },
    images: [
      {
        url: "/mock/emerald-mini-bag.jpg",
        altText: "Emerald Mini Bag",
        width: 1200,
        height: 1500,
      },
    ],
  },
  {
    id: "gid://shopify/Product/1000000000006",
    title: "Ivory Fragrance 50ml",
    handle: "ivory-fragrance-50ml",
    category: "other",
    priceRange: {
      minVariantPrice: { amount: "180", currencyCode: "EUR" },
      maxVariantPrice: { amount: "180", currencyCode: "EUR" },
    },
    images: [
      {
        url: "/mock/ivory-fragrance.jpg",
        altText: "Ivory Fragrance 50ml",
        width: 1200,
        height: 1500,
      },
    ],
  },
];

