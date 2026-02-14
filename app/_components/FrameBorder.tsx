"use client";

import React from "react";

function XIcon({ className }: { className?: string }) {
  return (
    <img
      src="/x.svg"
      alt=""
      className={`h-10 w-10 shrink-0 object-contain ${className ?? ""}`}
      style={{ filter: "brightness(0)" }}
    />
  );
}

function BIcon({ className }: { className?: string }) {
  return (
    <img
      src="/b.svg"
      alt=""
      className={`h-10 w-10 shrink-0 object-contain ${className ?? ""}`}
      style={{ filter: "brightness(0)" }}
    />
  );
}

const STRIP_SIZE = 48;
const HERO_HEIGHT = "100vh";

export default function FrameBorder() {
  const topBottomCount = 120;
  const leftRightCount = 80;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[90]"
      aria-hidden="true"
    >
      {/* Corner pieces – rounded for smooth L-shaped corners */}
      <div
        className="absolute overflow-hidden rounded-br-xl"
        style={{ left: 0, top: HERO_HEIGHT, width: STRIP_SIZE, height: STRIP_SIZE }}
      >
        <div className="flex h-full w-full items-center justify-center">
          <XIcon />
        </div>
      </div>
      <div
        className="absolute overflow-hidden rounded-bl-xl"
        style={{ right: 0, top: HERO_HEIGHT, width: STRIP_SIZE, height: STRIP_SIZE }}
      >
        <div className="flex h-full w-full items-center justify-center">
          <BIcon />
        </div>
      </div>
      <div
        className="absolute overflow-hidden rounded-tr-xl"
        style={{ left: 0, bottom: 0, width: STRIP_SIZE, height: STRIP_SIZE }}
      >
        <div className="flex h-full w-full items-center justify-center">
          <BIcon />
        </div>
      </div>
      <div
        className="absolute overflow-hidden rounded-tl-xl"
        style={{ right: 0, bottom: 0, width: STRIP_SIZE, height: STRIP_SIZE }}
      >
        <div className="flex h-full w-full items-center justify-center">
          <XIcon />
        </div>
      </div>

      {/* Top strip – inset to avoid corners */}
      <div
        className="absolute flex h-12 items-center justify-center gap-1 overflow-hidden"
        style={{ left: STRIP_SIZE, right: STRIP_SIZE, top: HERO_HEIGHT }}
      >
        {Array.from({ length: topBottomCount }, (_, i) =>
          i % 2 === 0 ? <XIcon key={i} /> : <BIcon key={i} />
        )}
      </div>

      {/* Bottom strip */}
      <div
        className="absolute flex h-12 items-center justify-center gap-1 overflow-hidden"
        style={{ left: STRIP_SIZE, right: STRIP_SIZE, bottom: 0 }}
      >
        {Array.from({ length: topBottomCount }, (_, i) =>
          i % 2 === 0 ? <XIcon key={i} /> : <BIcon key={i} />
        )}
      </div>

      {/* Left strip – inset to avoid corners */}
      <div
        className="absolute left-0 flex w-12 flex-col items-center justify-center gap-1 overflow-hidden"
        style={{
          top: `calc(${HERO_HEIGHT} + ${STRIP_SIZE}px)`,
          bottom: STRIP_SIZE,
        }}
      >
        {Array.from({ length: leftRightCount }, (_, i) =>
          i % 2 === 0 ? <BIcon key={i} /> : <XIcon key={i} />
        )}
      </div>

      {/* Right strip */}
      <div
        className="absolute right-0 flex w-12 flex-col items-center justify-center gap-1 overflow-hidden"
        style={{
          top: `calc(${HERO_HEIGHT} + ${STRIP_SIZE}px)`,
          bottom: STRIP_SIZE,
        }}
      >
        {Array.from({ length: leftRightCount }, (_, i) =>
          i % 2 === 0 ? <BIcon key={i} /> : <XIcon key={i} />
        )}
      </div>
    </div>
  );
}
