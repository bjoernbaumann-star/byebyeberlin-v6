"use client";

import React from "react";
import { CartProvider } from "./cart/CartContext";
import FrameBorder from "./FrameBorder";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <FrameBorder />
    </CartProvider>
  );
}

