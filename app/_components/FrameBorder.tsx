"use client";

import React from "react";

function XIcon({ className }: { className?: string }) {
  return (
    <img
      src="/x.svg"
      alt=""
      className={`h-4 w-4 shrink-0 object-contain ${className ?? ""}`}
      style={{ filter: "brightness(0)" }}
    />
  );
}

function BIcon({ className }: { className?: string }) {
  return (
    <img
      src="/b.svg"
      alt=""
      className={`h-4 w-4 shrink-0 object-contain ${className ?? ""}`}
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
      {/* Top – white bg, black symbols, alternating X B */}
      <div className="absolute left-0 right-0 top-0 flex h-6 items-center justify-center gap-0.5 overflow-hidden bg-white">
        {Array.from({ length: topBottomCount }, (_, i) =>
          i % 2 === 0 ? <XIcon key={i} /> : <BIcon key={i} />
        )}
      </div>

      {/* Bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex h-6 items-center justify-center gap-0.5 overflow-hidden bg-white">
        {Array.from({ length: topBottomCount }, (_, i) =>
          i % 2 === 0 ? <XIcon key={i} /> : <BIcon key={i} />
        )}
      </div>

      {/* Left */}
      <div className="absolute left-0 top-6 bottom-6 flex w-6 flex-col items-center justify-center gap-0.5 overflow-hidden bg-white">
        {Array.from({ length: leftRightCount }, (_, i) =>
          i % 2 === 0 ? <XIcon key={i} /> : <BIcon key={i} />
        )}
      </div>

      {/* Right */}
      <div className="absolute right-0 top-6 bottom-6 flex w-6 flex-col items-center justify-center gap-0.5 overflow-hidden bg-white">
        {Array.from({ length: leftRightCount }, (_, i) =>
          i % 2 === 0 ? <XIcon key={i} /> : <BIcon key={i} />
        )}
      </div>
    </div>
  );
}
