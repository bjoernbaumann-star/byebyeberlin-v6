"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Product = {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  color: "emerald" | "noir" | "ivory";
  highlight?: string;
};

// Hilfsfunktionen
function formatEUR(amount: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function cn(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

// Komponenten (Icons, Stripe etc. - wie im Original)
const HERITAGE_STRIPE_BG = "bg-[linear-gradient(90deg,rgba(16,185,129,1)_0%,rgba(16,185,129,1)_42%,rgba(245,245,245,1)_42%,rgba(245,245,245,1)_46%,rgba(138,28,36,1)_46%,rgba(138,28,36,1)_54%,rgba(245,245,245,1)_54%,rgba(245,245,245,1)_58%,rgba(16,185,129,1)_58%,rgba(16,185,129,1)_100%)]";
function HeritageStripe({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("block h-1.5 w-full rounded-full", HERITAGE_STRIPE_BG, className)} />;
}

// ... (Hier kommen deine Icons: IconBag, IconUser, etc.)

export default function LandingPage() {
  const products = useMemo<Product[]>(() => [
    { id: "bbb-01", name: "Noir Signature Tee", subtitle: "Schweres Cotton · präziser Fit", price: 140, color: "noir", highlight: "Signature" },
    { id: "bbb-02", name: "Emerald Leather Belt", subtitle: "Italian leather · gold tone", price: 290, color: "emerald", highlight: "Craft" },
    { id: "bbb-03", name: "Ivory Silk Scarf", subtitle: "Seiden-Twill · weicher Fall", price: 220, color: "ivory", highlight: "Atelier" },
    