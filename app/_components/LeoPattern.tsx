"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

/** Fließendes B*B*B* Muster – Liquid-Look für Footer, Cart, etc. */
export function LeoPattern({
  className = "",
  duration = 25,
  variant = "default",
}: {
  className?: string;
  duration?: number;
  variant?: "default" | "subtle" | "accent";
}) {
  const reducedMotion = useReducedMotion();

  const textColor = variant === "subtle" ? "text-neutral-300" : variant === "accent" ? "text-neutral-600" : "text-neutral-400";
  const starColor = variant === "subtle" ? "text-neutral-200" : variant === "accent" ? "text-neutral-500" : "text-neutral-500";

  return (
    <div className={["overflow-hidden", className].filter(Boolean).join(" ")}>
      <motion.div
        aria-hidden="true"
        className="flex w-max items-center gap-2 whitespace-nowrap"
        animate={
          reducedMotion
            ? undefined
            : {
                x: ["-50%", "0%"],
              }
        }
        transition={{
          duration,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        {Array.from({ length: 2 }).map((_, i) => (
          <span
            key={i}
            className={`flex items-center gap-2 font-sangbleu text-lg font-bold tracking-[0.2em] ${textColor}`}
          >
            {Array.from({ length: 20 }).map((_, j) => (
              <React.Fragment key={j}>
                <span>B</span>
                <span className={starColor}>*</span>
              </React.Fragment>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
