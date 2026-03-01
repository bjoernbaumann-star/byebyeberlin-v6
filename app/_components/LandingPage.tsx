"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import type { ShopifyProduct } from "../../lib/shopify-types";
import ShopNav from "./ShopNav";
import ShopFooter from "./ShopFooter";
import ProductGrid from "./shopify/ProductGrid";

function cn(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

function XSlider({
  value,
  onChange,
  min,
  max,
  trackSrc,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  trackSrc: string;
}) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const updateFromEvent = React.useCallback(
    (e: MouseEvent | TouchEvent) => {
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect) return;
      const clientX = "touches" in e ? e.touches[0]?.clientX : e.clientX;
      if (clientX == null) return;
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const val = min + pct * (max - min);
      onChange(val);
    },
    [min, max, onChange],
  );

  React.useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent | TouchEvent) => {
      if ("touches" in e) e.preventDefault();
      updateFromEvent(e);
    };
    const onEnd = () => setIsDragging(false);
    window.addEventListener("mousemove", onMove as (e: MouseEvent) => void);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onMove as (e: TouchEvent) => void, { passive: false });
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("mousemove", onMove as (e: MouseEvent) => void);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onMove as (e: TouchEvent) => void);
      window.removeEventListener("touchend", onEnd);
    };
  }, [isDragging, updateFromEvent]);

  const pct = (value - min) / (max - min);

  return (
    <div
      ref={trackRef}
      className="relative flex h-14 w-full items-center"
      onMouseDown={(e) => {
        e.preventDefault();
        setIsDragging(true);
        updateFromEvent(e.nativeEvent);
      }}
      onTouchStart={(e) => {
        setIsDragging(true);
        updateFromEvent(e.nativeEvent);
      }}
    >
      <div className="absolute inset-x-0 flex h-14 items-center overflow-hidden">
        <img
          src={trackSrc}
          alt=""
          className="h-full w-full object-contain object-center"
        />
      </div>
      <div
        className="absolute top-1/2 flex -translate-y-1/2 -translate-x-1/2 cursor-grab items-center justify-center active:cursor-grabbing"
        style={{ left: `${pct * 100}%` }}
      >
        <img
          src="/x.svg"
          alt=""
          width={56}
          height={56}
          className="h-14 w-14 min-h-14 min-w-14 shrink-0 touch-none select-none animate-spin motion-reduce:animate-none"
        />
      </div>
    </div>
  );
}

function HeroMarquee({
  text,
  reducedMotion,
  phase,
  opacity,
}: {
  text: string;
  reducedMotion: boolean;
  phase: number;
  opacity: React.CSSProperties["opacity"];
}) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 overflow-hidden"
      style={{ opacity }}
    >
      <motion.div
        className="flex w-max shrink-0 items-center gap-[5vw]"
        style={{ willChange: "transform" }}
        animate={reducedMotion ? undefined : { x: ["0%", "-50%"] }}
        transition={
          reducedMotion
            ? undefined
            : {
                duration: 51,
                ease: "linear",
                repeat: Infinity,
                repeatDelay: 0,
                repeatType: "loop",
              }
        }
      >
        <div className="flex items-center gap-[5vw]">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={`a-${i}`}
              className="font-sangbleu text-[84vw] font-bold leading-none text-white whitespace-nowrap md:text-[21vw]"
              style={{ letterSpacing: "-0.02em" }}
            >
              {text}
            </span>
          ))}
        </div>
        <div aria-hidden="true" className="flex items-center gap-[5vw]">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={`b-${i}`}
              className="font-sangbleu text-[84vw] font-bold leading-none text-white whitespace-nowrap md:text-[21vw]"
              style={{ letterSpacing: "-0.02em" }}
            >
              {text}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

const BX_ICON_SIZE_PX = 140;
const BX_STRIP_HEIGHT_PX = 200;

function GapMarquee({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  return (
    <div
      className="relative mb-8 flex w-full justify-center overflow-hidden bg-transparent"
      style={{ height: BX_STRIP_HEIGHT_PX }}
    >
      <div className="w-full overflow-hidden">
        <motion.div
          aria-hidden="true"
          className="flex w-max shrink-0 items-center justify-center gap-10"
          style={{ willChange: "transform", minHeight: BX_STRIP_HEIGHT_PX }}
          animate={
            reducedMotion
              ? undefined
              : { x: ["0%", "-50%"] }
          }
          transition={{
            duration: 40,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          {[0, 1].map((repeat) => (
            <div key={repeat} className="flex items-center justify-center gap-10">
              {Array.from({ length: 14 }).map((_, i) => (
                <span
                  key={`${repeat}-${i}`}
                  className="flex shrink-0 items-center justify-center overflow-visible"
                  style={{
                    width: BX_ICON_SIZE_PX,
                    height: BX_ICON_SIZE_PX,
                    minWidth: BX_ICON_SIZE_PX,
                    minHeight: BX_ICON_SIZE_PX,
                  }}
                >
                  {i % 2 === 0 ? (
                    <motion.div
                      className="flex h-full w-full items-center justify-center"
                      animate={
                        reducedMotion
                          ? undefined
                          : {
                              rotate: (i / 2) % 2 === 0 ? [0, 360] : [0, -360],
                            }
                      }
                      transition={
                        reducedMotion
                          ? undefined
                          : {
                              duration: 8,
                              ease: "linear",
                              repeat: Infinity,
                              repeatType: "loop",
                            }
                      }
                    >
                      <img
                        src="/x.svg"
                        alt=""
                        width={BX_ICON_SIZE_PX}
                        height={BX_ICON_SIZE_PX}
                        className="max-h-full max-w-full object-contain object-center"
                      />
                    </motion.div>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <img
                        src="/b.svg"
                        alt=""
                        width={BX_ICON_SIZE_PX}
                        height={BX_ICON_SIZE_PX}
                        className="max-h-full max-w-full object-contain object-center"
                      />
                    </div>
                  )}
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [isChaos, setIsChaos] = React.useState(false);
  const [isLeoExpanded, setIsLeoExpanded] = React.useState(false);
  const [wiggleIntensity, setWiggleIntensity] = React.useState(0);
  const [leoCount, setLeoCount] = React.useState(1);
  const [tick, setTick] = React.useState(0);
  const [cursorPos, setCursorPos] = React.useState({ x: 0, y: 0 });
  const leoObjectRef = React.useRef<HTMLObjectElement>(null);
  const leoReverseObjectRef = React.useRef<HTMLObjectElement>(null);

  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      setWiggleIntensity(e.clientX / window.innerWidth);
      const yRatio = Math.max(0, Math.min(1, 1 - e.clientY / window.innerHeight));
      const doublings = Math.min(6, Math.floor(yRatio * 6));
      setLeoCount(Math.pow(2, doublings));
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  React.useEffect(() => {
    if (!isLeoExpanded) return;
    let raf = 0;
    const loop = () => {
      setTick(Date.now());
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [isLeoExpanded]);

  const reducedMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const marqueeOpacity = useTransform(scrollY, [0, 600], [1, 0]) as any;

  const pathname = usePathname();
  const [showDoNotPress, setShowDoNotPress] = React.useState(false);
  React.useEffect(() => {
    const check = () =>
      setShowDoNotPress(window.scrollY > 0.7 * window.innerHeight);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  const [products, setProducts] = React.useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(
          `/api/shopify/products?t=${Date.now()}`,
          {
            cache: "no-store",
            headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
          },
        );
        const json = (await res.json()) as { products?: ShopifyProduct[] };
        if (!cancelled && Array.isArray(json?.products)) {
          setProducts(json.products);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-dvh overflow-x-hidden bg-white text-neutral-950">
      {isChaos && (
        <div
          className="fixed inset-0 -z-50 flex items-center justify-center bg-black/10 pointer-events-none"
          aria-hidden="true"
        >
          <h1 className="text-[20vw] font-black text-red-600/30 uppercase tracking-tighter leading-none animate-pulse">
            CHAOOOOOS
          </h1>
        </div>
      )}

      {isLeoExpanded && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-transparent [perspective:1200px] [transform-style:preserve-3d] md:cursor-none"
          role="button"
          tabIndex={0}
          onClick={() => setIsLeoExpanded(false)}
          onKeyDown={(e) => e.key === "Escape" && setIsLeoExpanded(false)}
          aria-label="Close"
        >
          {(() => {
            const w = typeof window !== "undefined" ? window.innerWidth : 1200;
            const xRatio = Math.max(0, Math.min(1, 1 - cursorPos.x / w));
            const rotDeg = (tick * 0.15 * xRatio) % 360;
            return (
              <div
                className="pointer-events-none fixed z-[210] hidden md:block"
                style={{
                  left: cursorPos.x,
                  top: cursorPos.y,
                  transform: `translate(-50%, -50%) rotate(${rotDeg}deg)`,
                }}
              >
                <img
                  src="/x.svg"
                  alt=""
                  width={56}
                  height={56}
                  className="h-14 w-14 block"
                  aria-hidden
                />
              </div>
            );
          })()}
          <div
            className="absolute inset-0 overflow-visible animate-spin-y transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {Array.from({ length: leoCount }).map((_, i) => {
              const cols = Math.max(1, Math.ceil(Math.sqrt(leoCount)));
              const rows = Math.ceil(leoCount / cols);
              const col = i % cols;
              const row = Math.floor(i / cols);
              const left = cols > 1 ? (col / (cols - 1)) * 100 : 50;
              const top = rows > 1 ? (row / (rows - 1)) * 100 : 50;
              const jitterRange = wiggleIntensity * 5;
              const jitterX = Math.sin(tick * 0.8 + i * 2.1) * jitterRange;
              const jitterY = Math.cos(tick * 0.7 + i * 1.7) * jitterRange;
              return (
                <div
                  key={i}
                  className="absolute w-[180vw] h-auto flex items-center justify-center"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    transform: `translate(-50%, -50%) translate(${jitterX}px, ${jitterY}px)`,
                  }}
                >
                  <object
                    ref={i === 0 ? leoObjectRef : undefined}
                    data="/leo.svg"
                    type="image/svg+xml"
                    className="w-[180vw] h-auto object-contain block pointer-events-none"
                    aria-hidden
                  />
                </div>
              );
            })}
          </div>
          <div
            className="absolute inset-0 flex items-center justify-center animate-spin-y transition-all duration-300 pointer-events-none"
          >
            <object
              ref={leoReverseObjectRef}
              data="/leo-reverse.svg"
              type="image/svg+xml"
              className="w-[180vw] h-auto object-contain block pointer-events-none"
              aria-hidden
            />
          </div>
        </div>
      )}

      <ShopNav transparentOnTop />

      <main>
        <section className="relative h-[96vh] w-full overflow-hidden bg-neutral-950 text-white">
          <video
            className="absolute inset-0 h-full w-full object-cover object-[center_70%] scale-110"
            src="/BG%20VIDEO.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,.08),transparent_45%),radial-gradient(circle_at_80%_25%,rgba(255,255,255,.05),transparent_55%)]" />

          <HeroMarquee
            text="BYE BYE BERLIN"
            reducedMotion={!!reducedMotion}
            phase={0}
            opacity={marqueeOpacity}
          />

          <div className="absolute inset-x-0 bottom-6 z-[50] flex items-center justify-center gap-2 px-3 sm:gap-24 sm:px-4 md:gap-32 lg:gap-40">
            <img
              src="/x.svg"
              alt=""
              width={20}
              height={20}
              className="h-4 w-4 shrink-0 animate-spin brightness-0 invert sm:h-5 sm:w-5"
              aria-hidden
            />
            <Link
              href="/clothes"
              className="font-sangbleu text-white text-xs font-medium uppercase tracking-[0.15em] hover:font-bold hover:opacity-80 transition-opacity sm:tracking-[0.2em] sm:text-base shrink-0"
            >
              CLOTHES
            </Link>
            <img
              src="/x.svg"
              alt=""
              width={20}
              height={20}
              className="h-4 w-4 shrink-0 animate-spin brightness-0 invert sm:h-5 sm:w-5"
              aria-hidden
            />
            <Link
              href="/bags"
              className="font-sangbleu text-white text-xs font-medium uppercase tracking-[0.15em] hover:font-bold hover:opacity-80 transition-opacity sm:tracking-[0.2em] sm:text-base shrink-0"
            >
              BAGS
            </Link>
            <img
              src="/x.svg"
              alt=""
              width={20}
              height={20}
              className="h-4 w-4 shrink-0 animate-spin brightness-0 invert sm:h-5 sm:w-5"
              aria-hidden
            />
            <Link
              href="/accessoires"
              className="font-sangbleu text-white text-xs font-medium uppercase tracking-[0.15em] hover:font-bold hover:opacity-80 transition-opacity sm:tracking-[0.2em] sm:text-base shrink-0"
            >
              ACCESSOIRES
            </Link>
            <img
              src="/x.svg"
              alt=""
              width={20}
              height={20}
              className="h-4 w-4 shrink-0 animate-spin brightness-0 invert sm:h-5 sm:w-5"
              aria-hidden
            />
          </div>
        </section>

        <section className="relative z-[95] w-full overflow-hidden">
          <GapMarquee reducedMotion={!!reducedMotion} />
        </section>

        <section className="relative z-[95] mx-auto max-w-6xl px-5 pb-32 pt-8">
          <div className="flex flex-col items-center justify-center text-center">
            <motion.h2
              className="font-sangbleu text-3xl font-bold uppercase tracking-[0.2em] text-neutral-950 -mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            >
              THE SELECTION
            </motion.h2>
          </div>
          <div className="mt-10">
            {loading ? (
              <div className="flex justify-center py-24">
                <div
                  className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-500"
                  aria-hidden="true"
                />
              </div>
            ) : (
              <ProductGrid products={products} showCount={false} />
            )}
          </div>
        </section>
      </main>

      {pathname === "/" && showDoNotPress && (
        <>
          <button
            type="button"
            onClick={() => {
              setIsChaos((c) => !c);
              setIsLeoExpanded(true);
            }}
            className="group fixed bottom-4 right-4 z-[150] bg-black p-2 transition-colors"
            aria-label="Do not press"
          >
            <object
              data="/donotpress.svg"
              type="image/svg+xml"
              className="h-8 w-auto block pointer-events-none brightness-0 invert"
              aria-hidden
            />
          </button>

          {isLeoExpanded && (
            <div
              className="fixed bottom-20 right-4 left-4 z-[220] block md:hidden p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsLeoExpanded(false)}
                className="absolute right-2 top-2 p-1 hover:opacity-70"
                aria-label="Close"
              >
                <img
                  src="/x.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="h-5 w-5 brightness-0 invert"
                />
              </button>
              <div className="space-y-4">
                <div>
                  <XSlider
                    trackSrc="/regler-1.svg"
                    min={0}
                    max={100}
                    value={Math.round(wiggleIntensity * 100)}
                    onChange={(v) => setWiggleIntensity(v / 100)}
                  />
                </div>
                <div>
                  <XSlider
                    trackSrc="/regler-2.svg"
                    min={0}
                    max={6}
                    value={Math.min(6, Math.max(0, Math.log2(leoCount) || 0))}
                    onChange={(v) => setLeoCount(Math.min(64, Math.max(1, Math.round(Math.pow(2, v)))))}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <ShopFooter />
    </div>
  );
}
