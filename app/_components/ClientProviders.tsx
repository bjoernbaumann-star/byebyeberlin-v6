"use client";

import React from "react";
import { CartProvider } from "./cart/CartContext";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

