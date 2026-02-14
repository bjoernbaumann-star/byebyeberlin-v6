"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function ShopFooter() {
  const reducedMotion = useReducedMotion();
  return (
    <footer className="border-t border-black/10 bg-white">
      {/* Icons laufen von links nach rechts */}
      <div className="overflow-hidden border-b border-black/5 py-4">
        <motion.div
          aria-hidden="true"
          className="flex w-max items-center gap-4"
          animate={
            reducedMotion
              ? undefined
              : { x: ["-50%", "0%"] }
          }
          transition={{
            duration: 25,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          {Array.from({ length: 2 }).map((_, copyIdx) => (
            <div key={copyIdx} className="flex shrink-0 items-center gap-4">
              {Array.from({ length: 24 }, (_, i) => (
                <span key={i} className="h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400" />
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-5 py-10 text-sm text-neutral-600 sm:flex-row">
        <div>© {new Date().getFullYear()} Bye Bye Berlin</div>
        <div className="flex gap-5">
          <a className="hover:text-neutral-950" href="#">
            Impressum
          </a>
          <a className="hover:text-neutral-950" href="#">
            Datenschutz
          </a>
          <a className="hover:text-neutral-950" href="#">
            Kontakt
          </a>
        </div>
      </div>
    </footer>
  );
}
