import React from "react";

export default function ShopFooter() {
  return (
    <footer className="border-t border-black/10 bg-white">
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

