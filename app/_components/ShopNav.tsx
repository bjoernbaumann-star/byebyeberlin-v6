"use client";

import Link from "next/link";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";

function cn(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

function IconBag(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7 9V7a5 5 0 0 1 10 0v2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M6.5 9h11l1.1 12.2a1.6 1.6 0 0 1-1.6 1.8H7a1.6 1.6 0 0 1-1.6-1.8L6.5 9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconUser(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M16.5 8.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M4.5 20.5a7.5 7.5 0 0 1 15 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconSearch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M16.3 16.3 21 21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
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

export default function ShopNav() {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Animated leopard pattern only when scrolled (prompt requirement)
  return (
    <header className="fixed inset-x-0 top-0 z-[60] h-[76px]">
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            key="leo-nav"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 12% 28%, rgba(0,0,0,.55) 0 18px, rgba(0,0,0,0) 19px), radial-gradient(circle at 14% 30%, rgba(184,132,60,.95) 0 12px, rgba(0,0,0,0) 13px), radial-gradient(circle at 36% 48%, rgba(0,0,0,.52) 0 20px, rgba(0,0,0,0) 21px), radial-gradient(circle at 38% 50%, rgba(214,167,74,.95) 0 13px, rgba(0,0,0,0) 14px), radial-gradient(circle at 68% 36%, rgba(0,0,0,.55) 0 18px, rgba(0,0,0,0) 19px), radial-gradient(circle at 70% 38%, rgba(176,116,48,.92) 0 12px, rgba(0,0,0,0) 13px), radial-gradient(circle at 82% 64%, rgba(0,0,0,.50) 0 22px, rgba(0,0,0,0) 23px), radial-gradient(circle at 84% 66%, rgba(232,190,92,.92) 0 14px, rgba(0,0,0,0) 15px), radial-gradient(circle at 52% 18%, rgba(0,0,0,.48) 0 16px, rgba(0,0,0,0) 17px), radial-gradient(circle at 54% 20%, rgba(212,175,55,.9) 0 11px, rgba(0,0,0,0) 12px)",
                backgroundSize: "240px 160px",
                backgroundRepeat: "repeat",
                filter: "saturate(1.1) contrast(1.05)",
              }}
              animate={{ x: [0, -240] }}
              transition={{ duration: 90, ease: "linear", repeat: Infinity }}
            />
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-[rgba(212,175,55,.35)]" />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={cn(
          "relative h-full w-full",
          isScrolled ? "text-white" : "bg-transparent text-white",
        )}
      >
        <div className="relative flex h-full w-full items-center px-2 sm:px-4 lg:px-6">
          <Link
            href="/"
            className="pointer-events-none absolute inset-x-0 flex justify-center font-sangbleu text-[18px] font-bold tracking-tight whitespace-nowrap leading-none text-[rgba(212,175,55,1)]"
            aria-label="Home"
          >
            BYE BYE BERLIN
          </Link>

          <div className="absolute right-2 flex items-center gap-1 sm:right-4 lg:right-6">
            <button className="p-2 hover:opacity-70" aria-label="Bag">
              <IconBag className="h-5 w-5" />
            </button>
            <button className="p-2 hover:opacity-70" aria-label="User">
              <IconUser className="h-5 w-5" />
            </button>
            <button className="p-2 hover:opacity-70" aria-label="Search">
              <IconSearch className="h-5 w-5" />
            </button>
            <button className="ml-1 inline-flex items-center gap-2 px-2 py-2 text-xs font-medium uppercase tracking-[0.35em] hover:opacity-70">
              <IconMenu className="h-5 w-5" />
              <span className="hidden sm:inline">Menu</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

