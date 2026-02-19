"use client";

import React from "react";
import type { ShopifyProduct } from "../../../lib/shopify-types";

const CART_STORAGE_KEY = "bbb_cart_v2";

export type CartLine = {
  product: ShopifyProduct;
  qty: number;
  /** Variant GID for checkout – falls back to product.firstVariantId */
  variantId?: string | null;
};

type CartState = {
  lines: CartLine[];
};

export type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: { amount: number; currencyCode: string };
  addTrigger: number;
  add: (product: ShopifyProduct, qty?: number, variantId?: string | null) => void;
  remove: (productId: string, variantId?: string | null) => void;
  setQty: (productId: string, qty: number, variantId?: string | null) => void;
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
  const amount = lines.reduce((sum, line) => {
    const price = moneyToNumber(line.product.priceRange.minVariantPrice.amount);
    return sum + price * line.qty;
  }, 0);
  const currencyCode = lines[0]?.product.priceRange.minVariantPrice.currencyCode ?? "EUR";
  return { amount, currencyCode };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<CartState>({ lines: [] });
  const [addTrigger, setAddTrigger] = React.useState(0);

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
    const subtotal = computeSubtotal(state.lines);

    return {
      lines: state.lines,
      count,
      subtotal,
      addTrigger,
      add: (product, qty = 1, variantId) => {
        const addQty = clampQty(qty);
        if (addQty <= 0) return;
        const vid = variantId ?? product.firstVariantId;
        if (!vid) return;
        setAddTrigger((t) => t + 1);
        setState((prev) => {
          const idx = prev.lines.findIndex(
            (l) => l.product.id === product.id && (l.variantId ?? l.product.firstVariantId) === vid,
          );
          if (idx === -1) {
            return { lines: [...prev.lines, { product, qty: addQty, variantId: vid }] };
          }
          const next = [...prev.lines];
          next[idx] = { ...next[idx], qty: clampQty(next[idx].qty + addQty) };
          return { lines: next };
        });
      },
      remove: (productId, variantId) => {
        setState((prev) => ({
          lines: prev.lines.filter((l) =>
            l.product.id !== productId ||
            (variantId != null && (l.variantId ?? l.product.firstVariantId) !== variantId),
          ),
        }));
      },
      setQty: (productId, qty, variantId) => {
        const nextQty = clampQty(qty);
        setState((prev) => {
          const match = (l: CartLine) =>
            l.product.id === productId &&
            (variantId == null || (l.variantId ?? l.product.firstVariantId) === variantId);
          if (nextQty <= 0) {
            return { lines: prev.lines.filter((l) => !match(l)) };
          }
          return {
            lines: prev.lines.map((l) => (match(l) ? { ...l, qty: nextQty } : l)),
          };
        });
      },
      clear: () => setState({ lines: [] }),
    };
  }, [state.lines, addTrigger]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

