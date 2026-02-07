"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

function cn(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

function IconMenu(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconX(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MenuDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div
            className="absolute inset-0 bg-black/25 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-label="Menu"
            className={cn(
              "absolute right-0 top-0 h-full w-full max-w-[520px]",
              "bg-white text-neutral-950",
              "shadow-[0_60px_140px_-80px_rgba(0,0,0,.75)]",
            )}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className={cn(
                "absolute right-6 top-6 grid h-12 w-12 place-items-center rounded-full",
                "bg-neutral-950 text-white",
                "transition-opacity hover:opacity-80",
                "focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2",
              )}
            >
              <IconX className="h-5 w-5" />
            </button>

            <div className="h-full overflow-y-auto px-10 pb-14 pt-20">
              <nav className="space-y-5 text-[22px] leading-tight">
                {[
                  { label: "Home", href: "/" },
                  { label: "Clothes", href: "/clothes" },
                  { label: "Bags", href: "/bags" },
                  { label: "New In", href: "/new-in" },
                  { label: "Story", href: "/story" },
                  { label: "Travel", href: "/travel" },
                  { label: "Jewellery & Watches", href: "/jewellery-watches" },
                  { label: "Décor & Lifestyle", href: "/decor-lifestyle" },
                ].map((x) => (
                  <a
                    key={x.label}
                    href={x.href}
                    onClick={onClose}
                    className={cn(
                      "block w-fit",
                      "text-neutral-950/90 hover:text-neutral-950",
                      "transition-colors",
                    )}
                  >
                    {x.label}
                  </a>
                ))}
              </nav>

              <div className="mt-12 border-t border-black/10 pt-8">
                <a
                  href="/services"
                  onClick={onClose}
                  className="text-sm text-neutral-600 hover:text-neutral-950"
                >
                  Bye Bye Berlin Services
                </a>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function SubpageShell({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children?: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-white text-neutral-950">
      <header className="fixed inset-x-0 top-0 z-[60] border-b border-black/10 bg-white/95 backdrop-blur">
        <div className="relative mx-auto flex h-[76px] max-w-6xl items-center justify-end px-5">
          <div className="pointer-events-none absolute inset-x-0 flex justify-center font-sangbleu text-[18px] font-bold tracking-tight">
            BYE BYE BERLIN
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className={cn(
              "ml-1 inline-flex items-center gap-2 px-2 py-2",
              "text-xs font-medium uppercase tracking-[0.35em]",
              "transition-opacity hover:opacity-70",
              "focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2",
            )}
            aria-label="Menu"
          >
            <IconMenu className="h-5 w-5" />
            <span className="hidden sm:inline">Menu</span>
          </button>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div aria-hidden="true" className="h-[76px]" />

      <main className="mx-auto max-w-6xl px-5 py-12">
        {eyebrow && (
          <div className="text-[11px] font-medium uppercase tracking-[0.35em] text-neutral-500">
            {eyebrow}
          </div>
        )}
        <h1 className="mt-3 font-sangbleu text-5xl font-bold tracking-tight sm:text-6xl">
          {title}
        </h1>
        <div className="mt-10">{children}</div>
      </main>

      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}

