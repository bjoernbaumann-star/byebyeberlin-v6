"use client";

import Link from "next/link";
import React from "react";
import ShopFooter from "./ShopFooter";
import ShopNav from "./ShopNav";

function cn(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

export default function SubpageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-white text-neutral-950">
      <ShopNav />

      <main className="mx-auto max-w-6xl px-5 pt-[96px] pb-20">
        <div className="rounded-[2.5rem] border border-black/10 bg-neutral-50 p-10">
          <div className="text-[11px] uppercase tracking-[0.35em] text-neutral-600">
            Bye Bye Berlin
          </div>
          <h1 className="mt-3 font-sangbleu text-5xl font-bold tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-700">
              {subtitle}
            </p>
          )}

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/"
              className={cn(
                "inline-flex h-12 items-center justify-center px-8",
                "bg-neutral-950 text-white hover:bg-neutral-900",
                "font-sangbleu text-xs font-bold uppercase tracking-[0.28em]",
              )}
            >
              Back to home
            </Link>
            <Link
              href="/services"
              className={cn(
                "inline-flex h-12 items-center justify-center px-8",
                "bg-white text-neutral-950 hover:bg-neutral-100",
                "border border-black/10",
                "font-sangbleu text-xs font-bold uppercase tracking-[0.28em]",
              )}
            >
              Services
            </Link>
          </div>
        </div>

        {children && <div className="mt-10">{children}</div>}
      </main>

      <ShopFooter />
    </div>
  );
}

