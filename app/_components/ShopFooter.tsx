"use client";

import React from "react";
import { LeoPattern } from "./LeoPattern";

export default function ShopFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-black/10 bg-white">
      {/* Leo-Muster als fließendes Band */}
      <div className="absolute inset-x-0 top-0 h-14 overflow-hidden border-b border-black/5 py-3">
        <LeoPattern duration={28} variant="subtle" />
      </div>

      {/* Footer-Links dezent darüber */}
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-5 py-10 pt-20 text-sm text-neutral-600 sm:flex-row">
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
