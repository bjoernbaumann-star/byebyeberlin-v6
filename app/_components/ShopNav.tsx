"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "./cart/CartContext";
import CartDrawer from "./cart/CartDrawer";

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

function IconBack(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 91.6 91.8" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M0,46L42.6,0l7.4,5-23.4,41,23.4,41-7.4,4.8L0,46ZM41.6,46L84.2,0l7.4,5-23.4,41,23.4,41-7.4,4.8-42.6-45.8Z" />
    </svg>
  );
}

function MenuDrawer({
  open,
  onClose,
  me,
}: {
  open: boolean;
  onClose: () => void;
  me: { loading: boolean; loggedIn: boolean; firstName: string | null };
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  React.useEffect(() => {
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
          className="fixed inset-0 z-[110]"
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
              <nav className="space-y-5 font-sangbleu-medium text-[22px] leading-tight">
                {[
                  { label: "BAGS", href: "/bags" },
                  { label: "CLOTHES", href: "/clothes" },
                  { label: "COLLECTION", href: "/kollektion" },
                  { label: "STORY", href: "/story" },
                ].map((x) => (
                  <Link
                    key={x.label}
                    href={x.href}
                    onClick={onClose}
                    className="block w-fit text-neutral-950/90 transition-colors hover:text-neutral-950"
                  >
                    {x.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-12 space-y-4 border-t border-black/10 pt-8">
                {me.loggedIn ? (
                  <>
                    <Link
                      href="/account"
                      onClick={onClose}
                      className="flex items-center gap-2 text-neutral-950 transition-colors hover:text-neutral-700"
                    >
                      <IconUser className="h-5 w-5" />
                      <span className="font-sangbleu-medium text-sm uppercase tracking-[0.2em]">
                        {me.firstName || "MY ACCOUNT"}
                      </span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        fetch("/api/auth/logout", { method: "POST" }).then(() => {
                          window.location.href = "/login";
                        });
                      }}
                      className="flex w-fit items-center gap-2 text-neutral-950 transition-colors hover:text-neutral-700"
                    >
                      <IconUser className="h-5 w-5" />
                      <span className="font-sangbleu-medium text-sm uppercase tracking-[0.2em]">
                        Logout
                      </span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="flex items-center gap-2 text-neutral-950 transition-colors hover:text-neutral-700"
                  >
                    <IconUser className="h-5 w-5" />
                    <span className="font-sangbleu-medium text-sm uppercase tracking-[0.2em]">
                      {me.loading ? "…" : "Login"}
                    </span>
                  </Link>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="flex w-fit items-center gap-2 text-neutral-950 transition-colors hover:text-neutral-700"
                  aria-label="Search"
                >
                  <IconSearch className="h-5 w-5" />
                  <span className="font-sangbleu-medium text-sm uppercase tracking-[0.2em]">
                    Search
                  </span>
                </button>
              </div>

              <div className="mt-6 border-t border-black/10 pt-6">
                <Link
                  href="/services"
                  onClick={onClose}
                  className="text-sm text-neutral-500 transition-colors hover:text-neutral-800"
                >
                  BYE BYE BERLIN SERVICES
                </Link>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ShopNav({ transparentOnTop = false }: { transparentOnTop?: boolean }) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [me, setMe] = React.useState<{
    loading: boolean;
    loggedIn: boolean;
    firstName: string | null;
  }>({ loading: true, loggedIn: false, firstName: null });
  const cart = useCart();

  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const json = (await res.json()) as { loggedIn?: boolean; firstName?: string | null };
        if (cancelled) return;
        setMe({
          loading: false,
          loggedIn: !!json.loggedIn,
          firstName: json.firstName ?? null,
        });
      } catch {
        if (cancelled) return;
        setMe({ loading: false, loggedIn: false, firstName: null });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const useTransparent = transparentOnTop && !isScrolled;
  const headerTextColor = useTransparent ? "text-white" : "text-neutral-950";
  const headerBg = useTransparent
    ? "bg-transparent"
    : "bg-white/90 backdrop-blur-md border-b border-black/5";

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[100]",
          "transition-all duration-300 ease-out",
          headerBg,
          headerTextColor,
        )}
      >
        <div className="relative flex h-[76px] w-full items-center px-2 sm:px-4 lg:px-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="absolute left-2 z-20 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-inherit hover:opacity-70 sm:left-4 lg:left-6"
            aria-label="Zurück"
          >
            <IconBack className="h-7 w-7 sm:h-8 sm:w-8" />
          </button>

          <Link
            href="/"
            className="absolute inset-x-0 z-10 flex justify-center font-sangbleu text-[18px] font-bold tracking-tight whitespace-nowrap leading-none transition-opacity hover:opacity-80"
            aria-label="Home"
          >
            BYE BYE BERLIN
          </Link>

          <div className="absolute right-2 z-20 flex items-center gap-1 sm:right-4 sm:gap-2 lg:right-6 lg:gap-4">
<button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative inline-flex items-center gap-1.5 p-2 hover:opacity-70"
              aria-label="Shopping bag"
            >
              <motion.span
                key={cart.addTrigger}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex items-center gap-2"
              >
                <IconBag className="h-6 w-6 shrink-0" />
                <span className="hidden sm:inline font-sangbleu text-[14.4px] font-bold uppercase tracking-[0.2em] leading-none">
                  BAG
                </span>
                {cart.count > 0 && (
                  <motion.span
                    key={cart.count}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className={cn(
                      "tabular-nums font-sangbleu text-[14.4px] font-bold leading-none",
                      useTransparent ? "text-white" : "text-neutral-950",
                    )}
                  >
                    ({cart.count})
                  </motion.span>
                )}
              </motion.span>
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="inline-flex items-center gap-2 px-2 py-2 hover:opacity-70"
            >
              <IconMenu className="h-6 w-6 shrink-0" />
              <span className="hidden sm:inline font-sangbleu text-[14.4px] font-bold uppercase tracking-[0.2em] leading-none">
                Menu
              </span>
            </button>
          </div>
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} me={me} />
    </>
  );
}

