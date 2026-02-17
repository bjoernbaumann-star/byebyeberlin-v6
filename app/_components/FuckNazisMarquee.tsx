"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function FuckNazisMarquee() {
  const reducedMotion = useReducedMotion();
  const text = "FUCK NAZIS";

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-[30%] z-10 overflow-hidden whitespace-nowrap"
      style={{ willChange: "transform" }}
    >
      <motion.div
        className="flex w-max items-center gap-[8vw] whitespace-nowrap"
        style={{ willChange: "transform" }}
        animate={
          reducedMotion ? undefined : { x: ["-50%", "0%"] }
        }
        transition={
          reducedMotion
            ? undefined
            : {
                duration: 35,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
              }
        }
      >
        <div className="flex items-center gap-[8vw]">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={`fn-a-${i}`}
              className="font-sangbleu text-[28vw] font-bold uppercase leading-none text-black whitespace-nowrap"
              style={{ letterSpacing: "0.12em" }}
            >
              {text}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-[8vw]" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={`fn-b-${i}`}
              className="font-sangbleu text-[28vw] font-bold uppercase leading-none text-black whitespace-nowrap"
              style={{ letterSpacing: "0.12em" }}
            >
              {text}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
