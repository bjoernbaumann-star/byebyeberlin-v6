"use client";

import React from "react";

function cn(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

export default function ButtonCta({
  className,
  invisible,
  isHovered,
  label,
}: {
  className?: string;
  invisible?: boolean;
  isHovered?: boolean;
  label?: "add" | "checkout";
}) {
  const text = label === "checkout" ? "CHECK OUT" : "YES, I'LL TAKE IT";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-55 0 759.29 78.82"
      className={cn("block h-auto w-full", invisible && "invisible", className)}
      style={{ overflow: "visible" }}
      aria-hidden
    >
      <defs>
        <style>{`
          .btn-cls-1{fill:#ffffff;font-family:SangBleuSunrise-Bold,'SangBleu Sunrise';font-size:53.79px;font-weight:700;}
          .btn-cls-4{fill:#ffffff;}
          @keyframes star-spin{to{transform:rotate(360deg)}}
          .star-spin{transform-origin:39px 38px;animation:star-spin 3s linear infinite}
          .star-spin-right{transform-origin:607px 38px;animation:star-spin 3s linear infinite}
          @media(prefers-reduced-motion:reduce){.star-spin,.star-spin-right{animation:none}}
          @media(max-width:767px){.btn-cls-1{font-size:64.55px}}
        `}</style>
      </defs>
      <g id="Ebene_1-2">
        <g transform="translate(-55,0)">
          <g className="star-spin">
            <polygon
              className="btn-cls-4"
              points="76.06 48.79 78.12 33.71 70.74 36.31 50.89 33.57 74.49 2.05 60.21 8.55 42.73 30.58 26.86 11.93 22.09 3.32 13.19 15.86 19.35 18.37 31.03 30.83 0 26.56 11.5 35.84 35.29 39.96 19.83 59.45 14.88 63.54 24.17 74.75 26.79 65.74 43.21 43.83 64.74 66.8 69.74 62.33 53.36 43.08 69.36 45.85 76.06 48.79"
            />
          </g>
        </g>
        <g transform="translate(55,0)">
          <g className="star-spin-right">
            <polygon
              className="btn-cls-4"
              points="623.31 68.41 633.78 57.36 626.27 55.17 611.74 41.37 649.29 29.52 633.89 26.48 606.85 34.19 604.83 9.77 605.97 0 591.43 5.01 594.97 10.63 597.19 27.56 574.48 6.01 578.41 20.25 595.34 37.47 571.41 44.29 565 44.73 566.02 59.25 573.4 53.46 599.51 45.22 603.61 76.45 610.28 75.73 608.2 50.54 619.58 62.11 623.31 68.41"
            />
          </g>
        </g>
        <g style={{ opacity: 1 }}>
          <text className="btn-cls-1" x="324.65" y="57.15" textAnchor="middle">
            {text}
          </text>
        </g>
      </g>
    </svg>
  );
}
