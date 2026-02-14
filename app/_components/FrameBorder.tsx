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

export default function FrameBorder() {
  const topBottomCount = 120;
  const leftRightCount = 80;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[200]"
      aria-hidden="true"
    >
      {/* Top – transparent bg, black symbols, alternating X B */}
      <div className="absolute left-0 right-0 top-0 flex h-12 items-center justify-center gap-1 overflow-hidden">
        {Array.from({ length: topBottomCount }, (_, i) =>
          i % 2 === 0 ? <XIcon key={i} /> : <BIcon key={i} />
        )}
      </div>

      {/* Bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex h-12 items-center justify-center gap-1 overflow-hidden">
        {Array.from({ length: topBottomCount }, (_, i) =>
          i % 2 === 0 ? <XIcon key={i} /> : <BIcon key={i} />
        )}
      </div>

      {/* Left – B X B X B (starts with B) */}
      <div className="absolute left-0 top-12 bottom-12 flex w-12 flex-col items-center justify-center gap-1 overflow-hidden">
        {Array.from({ length: leftRightCount }, (_, i) =>
          i % 2 === 0 ? <BIcon key={i} /> : <XIcon key={i} />
        )}
      </div>

      {/* Right – B X B X B (starts with B) */}
      <div className="absolute right-0 top-12 bottom-12 flex w-12 flex-col items-center justify-center gap-1 overflow-hidden">
        {Array.from({ length: leftRightCount }, (_, i) =>
          i % 2 === 0 ? <BIcon key={i} /> : <XIcon key={i} />
        )}
      </div>
    </div>
  );
}
