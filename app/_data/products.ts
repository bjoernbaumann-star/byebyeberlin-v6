export type ProductCategory = "bags" | "clothes" | "other";

export type Product = {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  category: ProductCategory;
};

export const PRODUCTS: Product[] = [
  {
    id: "bbb-01",
    name: "Noir Signature Tee",
    subtitle: "Schweres Cotton · präziser Fit",
    price: 140,
    category: "clothes",
  },
  {
    id: "bbb-02",
    name: "Emerald Leather Belt",
    subtitle: "Italian leather · gold tone",
    price: 290,
    category: "clothes",
  },
  {
    id: "bbb-03",
    name: "Ivory Silk Scarf",
    subtitle: "Seiden-Twill · weicher Fall",
    price: 220,
    category: "clothes",
  },
  {
    id: "bbb-04",
    name: "Nightfall Sunglasses",
    subtitle: "Acetat · UV400 · minimaler Glanz",
    price: 310,
    category: "other",
  },
  {
    id: "bbb-05",
    name: "Emerald Mini Bag",
    subtitle: "Kompakt · goldener Verschluss",
    price: 640,
    category: "bags",
  },
  {
    id: "bbb-06",
    name: "Ivory Fragrance 50ml",
    subtitle: "Amber · Bergamotte · cleanes Finish",
    price: 180,
    category: "other",
  },
];

