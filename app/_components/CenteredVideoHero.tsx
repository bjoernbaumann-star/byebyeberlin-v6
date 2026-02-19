"use client";

import React from "react";

function cn(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

export default function CenteredVideoHero({
  primarySrc,
  fallbackSrc = "/hero-video.mp4",
  overlayClassName = "bg-black/25",
  fullScreen = false,
}: {
  primarySrc: string;
  fallbackSrc?: string;
  overlayClassName?: string;
  fullScreen?: boolean;
}) {
  const [src, setSrc] = React.useState(primarySrc);

  if (fullScreen) {
    return (
      <section className="relative h-[70vh] w-full overflow-hidden bg-neutral-950">
        <video
          key={src}
          className="h-full w-full object-cover object-[center_25%]"
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={() => {
            if (src !== fallbackSrc) setSrc(fallbackSrc);
          }}
        />
        <div className={cn("pointer-events-none absolute inset-0", overlayClassName)} />
      </section>
    );
  }

  return (
    <section className="relative flex h-[70vh] w-full items-center justify-center overflow-hidden bg-neutral-950">
      <div
        className={cn(
          "relative overflow-hidden bg-black",
          "h-[624px] w-[624px]",
          "max-h-[min(624px,calc(100vh-220px))] max-w-[min(624px,calc(100vw-2.5rem))]",
          "shadow-[0_60px_140px_-90px_rgba(0,0,0,.95)]",
        )}
      >
        <video
          key={src}
          className="h-full w-full scale-[1.25] object-cover"
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={() => {
            if (src !== fallbackSrc) setSrc(fallbackSrc);
          }}
        />
        <div className={cn("pointer-events-none absolute inset-0", overlayClassName)} />
      </div>
    </section>
  );
}

