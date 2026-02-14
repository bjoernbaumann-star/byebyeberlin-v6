import React from "react";

export default function ShopFooter() {
  return (
    <footer className="border-t border-black/10 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-5 py-12 text-sm sm:flex-row">
        <div>© {new Date().getFullYear()} Bye Bye Berlin</div>
        <div className="flex gap-6">
          <a className="text-neutral-600 hover:text-neutral-950 transition-colors" href="#">
            Imprint
          </a>
          <a className="text-neutral-600 hover:text-neutral-950 transition-colors" href="#">
            Privacy
          </a>
          <a className="text-neutral-600 hover:text-neutral-950 transition-colors" href="#">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

