"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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

// Menu drawer layout and typography values
const MENU_DRAWER = {
  maxWidth: 520,
  paddingX: 40,       // px-10 → 2.5rem
  paddingTop: 80,      // pt-20
  paddingBottom: 56,   // pb-14
  brand: {
    fontSize: 26,      // 20% larger than 22
    marginBottom: 40,  // mb-10
  },
  titleBlockPaddingTop: 24,  // padding above "BYE BYE BERLIN"
  closeButton: {
    top: 20,
    right: 20,
    size: 62,          // 10% bigger than 56
    iconSize: 48,      // 10% bigger than 44
  },
  nav: {
    fontSize: 22,
    lineHeight: 1.25,
    gap: 20,           // space between links
    marginTop: 0,
    marginBottom: 0,
    maxWidth: 425,     // constrain nav width
    link: {
      minHeight: 28,
      paddingY: 4,
      paddingX: 0,
    },
  },
  separator: {
    borderColor: "rgba(0,0,0,0.1)",
    borderWidth: 1,
  },
  utility: {
    marginTop: 12,     // mt-3
    paddingTop: 12,     // pt-3
    gap: 16,           // space-y-4
    fontSize: 14,
    letterSpacing: "0.2em",
    iconSize: 20,
  },
  services: {
    marginTop: 24,     // mt-6
    paddingTop: 24,     // pt-6
    fontSize: 14,
  },
} as const;

function MenuDrawer({
  open,
  onClose,
  me,
  cartCount,
  onOpenCart,
}: {
  open: boolean;
  onClose: () => void;
  me: { loading: boolean; loggedIn: boolean; firstName: string | null };
  cartCount: number;
  onOpenCart: () => void;
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
              "absolute right-0 top-0 flex h-full w-full flex-col bg-white text-neutral-950",
              "shadow-[0_60px_140px_-80px_rgba(0,0,0,.75)]",
            )}
            style={{ maxWidth: MENU_DRAWER.maxWidth }}
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
                "absolute grid place-items-center text-neutral-950",
                "transition-opacity hover:opacity-70",
                "focus:outline-none",
              )}
              style={{
                top: MENU_DRAWER.closeButton.top,
                right: MENU_DRAWER.closeButton.right,
                width: MENU_DRAWER.closeButton.size,
                height: MENU_DRAWER.closeButton.size,
              }}
            >
              <span
                className="inline-block animate-[spin_3s_linear_infinite]"
                style={{ width: MENU_DRAWER.closeButton.iconSize, height: MENU_DRAWER.closeButton.iconSize }}
              >
                <img
                  src="/x.svg"
                  alt=""
                  width={MENU_DRAWER.closeButton.iconSize}
                  height={MENU_DRAWER.closeButton.iconSize}
                  className="object-contain block"
                />
              </span>
            </button>

            <div
              className="shrink-0"
              style={{
                paddingTop: MENU_DRAWER.titleBlockPaddingTop,
                paddingLeft: MENU_DRAWER.paddingX,
                paddingRight: MENU_DRAWER.paddingX,
                paddingBottom: 0,
              }}
            >
              <Link
                href="/"
                onClick={onClose}
                className="block w-fit font-sangbleu font-bold tracking-tight text-neutral-950"
                style={{ fontSize: MENU_DRAWER.brand.fontSize, marginBottom: MENU_DRAWER.brand.marginBottom }}
                aria-label="Home"
              >
                BYE BYE BERLIN
              </Link>
            </div>

            <div
              className="min-h-0 flex-1 overflow-y-auto"
              style={{
                paddingLeft: MENU_DRAWER.paddingX,
                paddingRight: MENU_DRAWER.paddingX,
                paddingTop: 0,
                paddingBottom: MENU_DRAWER.paddingBottom,
              }}
            >
              <nav
                className="font-sangbleu-medium"
                style={{
                  fontSize: MENU_DRAWER.nav.fontSize,
                  lineHeight: MENU_DRAWER.nav.lineHeight,
                  display: "flex",
                  flexDirection: "column",
                  gap: MENU_DRAWER.nav.gap,
                  marginTop: MENU_DRAWER.nav.marginTop,
                  marginBottom: MENU_DRAWER.nav.marginBottom,
                  maxWidth: MENU_DRAWER.nav.maxWidth,
                }}
                aria-label="Main navigation"
              >
                {[
                  { label: "COLLECTION", href: "/kollektion" },
                  { label: "BAGS", href: "/bags" },
                  {
                    label: "CLOTHES",
                    href: "/clothes",
                    children: [
                      { label: "for here & him", href: "/clothes?filter=for-here-him" },
                      { label: "for him & here", href: "/clothes?filter=for-him-here" },
                    ],
                  },
                  { label: "ACCESSOIRES", href: "/accessoires" },
                  { label: "STORY", href: "/story", separatorBefore: true },
                  { label: "BOUNDARIES AND VALUES", href: "/boundaries-and-values" },
                ].map((x) => (
                  <div key={x.label}>
                    {"separatorBefore" in x && x.separatorBefore && (
                      <div
                        className="mb-3 w-full shrink-0"
                        style={{
                          height: 1,
                          backgroundColor: MENU_DRAWER.separator.borderColor,
                        }}
                      />
                    )}
                    <Link
                      href={x.href}
                      onClick={onClose}
                      className="block w-fit text-neutral-950/90 transition-colors hover:font-bold hover:text-neutral-950"
                      style={{
                        minHeight: MENU_DRAWER.nav.link.minHeight,
                        paddingTop: MENU_DRAWER.nav.link.paddingY,
                        paddingBottom: MENU_DRAWER.nav.link.paddingY,
                        paddingLeft: MENU_DRAWER.nav.link.paddingX,
                        paddingRight: MENU_DRAWER.nav.link.paddingX,
                      }}
                    >
                      {x.label}
                    </Link>
                    {"children" in x && x.children && (
                      <div
                        className="flex flex-col pl-4"
                        style={{
                          gap: 2,
                          marginTop: 4,
                          paddingBottom: 4,
                        }}
                      >
                        {x.children.map((c) => (
                          <Link
                            key={c.label}
                            href={c.href}
                            onClick={onClose}
                            className="block w-fit italic text-neutral-950/70 text-[0.72em] transition-colors hover:font-bold hover:text-neutral-950"
                            style={{
                              minHeight: MENU_DRAWER.nav.link.minHeight,
                              paddingTop: 2,
                              paddingBottom: 2,
                            }}
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              <div
                className="flex flex-col"
                style={{
                  marginTop: MENU_DRAWER.utility.marginTop,
                  paddingTop: MENU_DRAWER.utility.paddingTop,
                  gap: MENU_DRAWER.utility.gap,
                  borderTop: `${MENU_DRAWER.separator.borderWidth}px solid ${MENU_DRAWER.separator.borderColor}`,
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCart();
                  }}
                  className="flex w-fit items-center gap-2 text-neutral-950 transition-colors hover:font-bold hover:text-neutral-700"
                  aria-label={cartCount > 0 ? `Bag (${cartCount} items)` : "Bag"}
                >
                  <IconBag style={{ width: MENU_DRAWER.utility.iconSize, height: MENU_DRAWER.utility.iconSize }} />
                  <span
                    className="font-sangbleu-medium uppercase"
                    style={{ fontSize: MENU_DRAWER.utility.fontSize, letterSpacing: MENU_DRAWER.utility.letterSpacing }}
                  >
                    BAG{cartCount > 0 ? ` (${cartCount})` : ""}
                  </span>
                </button>
                {me.loggedIn ? (
                  <>
                    <Link
                      href="/account"
                      onClick={onClose}
                      className="flex items-center gap-2 text-neutral-950 transition-colors hover:font-bold hover:text-neutral-700"
                    >
                      <IconUser style={{ width: MENU_DRAWER.utility.iconSize, height: MENU_DRAWER.utility.iconSize }} />
                      <span
                        className="font-sangbleu-medium uppercase"
                        style={{ fontSize: MENU_DRAWER.utility.fontSize, letterSpacing: MENU_DRAWER.utility.letterSpacing }}
                      >
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
                      className="flex w-fit items-center gap-2 text-neutral-950 transition-colors hover:font-bold hover:text-neutral-700"
                    >
                      <IconUser style={{ width: MENU_DRAWER.utility.iconSize, height: MENU_DRAWER.utility.iconSize }} />
                      <span
                        className="font-sangbleu-medium uppercase"
                        style={{ fontSize: MENU_DRAWER.utility.fontSize, letterSpacing: MENU_DRAWER.utility.letterSpacing }}
                      >
                        LOGOUT
                      </span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="flex items-center gap-2 text-neutral-950 transition-colors hover:font-bold hover:text-neutral-700"
                  >
                    <IconUser style={{ width: MENU_DRAWER.utility.iconSize, height: MENU_DRAWER.utility.iconSize }} />
                    <span
                      className="font-sangbleu-medium uppercase"
                      style={{ fontSize: MENU_DRAWER.utility.fontSize, letterSpacing: MENU_DRAWER.utility.letterSpacing }}
                    >
                      {me.loading ? "…" : "LOGIN"}
                    </span>
                  </Link>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="flex w-fit items-center gap-2 text-neutral-950 transition-colors hover:font-bold hover:text-neutral-700"
                  aria-label="Search"
                >
                  <IconSearch style={{ width: MENU_DRAWER.utility.iconSize, height: MENU_DRAWER.utility.iconSize }} />
                  <span
                    className="font-sangbleu-medium uppercase"
                    style={{ fontSize: MENU_DRAWER.utility.fontSize, letterSpacing: MENU_DRAWER.utility.letterSpacing }}
                  >
                    SEARCH
                  </span>
                </button>
              </div>

              <div
                style={{
                  marginTop: MENU_DRAWER.services.marginTop,
                  paddingTop: MENU_DRAWER.services.paddingTop,
                  borderTop: `${MENU_DRAWER.separator.borderWidth}px solid ${MENU_DRAWER.separator.borderColor}`,
                }}
              >
                <Link
                  href="/services"
                  onClick={onClose}
                  className="font-sangbleu text-neutral-500 transition-colors hover:font-bold hover:text-neutral-800"
                  style={{ fontSize: MENU_DRAWER.services.fontSize }}
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
  const pathname = usePathname();
  const isHome = pathname === "/";
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
          {!isHome && (
            <button
              type="button"
              onClick={() => router.back()}
              className="absolute left-2 z-20 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-inherit hover:opacity-70 sm:left-4 sm:h-10 sm:w-10 lg:left-6"
              aria-label="Zurück"
            >
              <IconBack className="h-[1.25rem] w-[1.25rem] sm:h-[1.4rem] sm:w-[1.4rem]" />
            </button>
          )}

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
                className="relative flex items-center gap-2"
              >
                <span className="relative inline-flex shrink-0">
                  <IconBag className="h-[25.2px] w-[25.2px]" />
                  {cart.count > 0 && (
                    <span
                      className={cn(
                        "absolute inset-0 flex items-center justify-center pt-[7px] font-sangbleu text-[10px] font-bold tabular-nums sm:hidden",
                        useTransparent ? "text-white" : "text-neutral-950",
                      )}
                    >
                      {cart.count}
                    </span>
                  )}
                </span>
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
                      "hidden sm:inline tabular-nums font-sangbleu text-[11.5px] font-bold leading-none not-italic",
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

      <MenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        me={me}
        cartCount={cart.count}
        onOpenCart={() => setCartOpen(true)}
      />
    </>
  );
}

