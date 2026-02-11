"use client";

import React from "react";
import type { ShopifyProduct } from "../../../lib/shopify-types";

const CART_STORAGE_KEY = "bbb_cart_v2";

export type CartLine = {
  product: ShopifyProduct;
  qty: number;
};

type CartState = {
  lines: CartLine[];
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: { amount: number; currencyCode: "EUR" };
  add: (product: ShopifyProduct, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
};

const CartContext = React.createContext<CartContextValue | null>(null);

function clampQty(qty: number) {
  return Math.max(0, Math.min(99, Math.floor(qty)));
}

function moneyToNumber(amount: string) {
  const n = Number(amount);
  return Number.isFinite(n) ? n : 0;
}

function computeSubtotal(lines: CartLine[]) {
  return lines.reduce((sum, line) => {
    const price = moneyToNumber(line.product.priceRange.minVariantPrice.amount);
    return sum + price * line.qty;
  }, 0);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<CartState>({ lines: [] });

  // hydrate from localStorage
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as CartState;
      if (parsed?.lines?.length) setState(parsed);
    } catch {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const value = React.useMemo<CartContextValue>(() => {
    const count = state.lines.reduce((sum, l) => sum + l.qty, 0);
    const subtotalAmount = computeSubtotal(state.lines);

    return {
      lines: state.lines,
      count,
      subtotal: { amount: subtotalAmount, currencyCode: "EUR" },
      add: (product, qty = 1) => {
        const addQty = clampQty(qty);
        if (addQty <= 0) return;
        setState((prev) => {
          const idx = prev.lines.findIndex((l) => l.product.id === product.id);
          if (idx === -1) {
            return { lines: [...prev.lines, { product, qty: addQty }] };
          }
          const next = [...prev.lines];
          next[idx] = { ...next[idx], qty: clampQty(next[idx].qty + addQty) };
          return { lines: next };
        });
      },
      remove: (productId) => {
        setState((prev) => ({ lines: prev.lines.filter((l) => l.product.id !== productId) }));
      },
      setQty: (productId, qty) => {
        const nextQty = clampQty(qty);
        setState((prev) => {
          if (nextQty <= 0) {
            return { lines: prev.lines.filter((l) => l.product.id !== productId) };
          }
          return {
            lines: prev.lines.map((l) =>
              l.product.id === productId ? { ...l, qty: nextQty } : l,
            ),
          };
        });
      },
      clear: () => setState({ lines: [] }),
    };
  }, [state.lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

