import React from "react";

export default function ShopFooter() {
  return (
    <footer className="border-t border-black/10 bg-white">
      <div className="font-sangbleu mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-5 py-6 text-[10px] text-neutral-600 sm:flex-row">
        <div>© {new Date().getFullYear()} BYE BYE BERLIN</div>
        <div className="flex gap-3">
          <a className="hover:text-neutral-950" href="#">
            IMPRESSUM
          </a>
          <a className="hover:text-neutral-950" href="#">
            DATENSCHUTZ
          </a>
          <a className="hover:text-neutral-950" href="#">
            KONTAKT
          </a>
        </div>
      </div>
    </footer>
  );
}
