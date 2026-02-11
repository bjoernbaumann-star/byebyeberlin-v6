"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ShopFooter from "../../_components/ShopFooter";
import ShopNav from "../../_components/ShopNav";

function cn(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

function LoginVerifyContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const shopifyLoginUrl = searchParams.get("next") ?? searchParams.get("url") ?? "";

  const redirectToShopify = () => {
    if (shopifyLoginUrl) {
      const url = email
        ? `${shopifyLoginUrl}${shopifyLoginUrl.includes("?") ? "&" : "?"}email=${encodeURIComponent(email)}`
        : shopifyLoginUrl;
      window.location.href = url;
    }
  };

  if (!shopifyLoginUrl) {
    return (
      <div className="min-h-dvh bg-white text-neutral-950">
        <ShopNav />
        <main className="mx-auto max-w-lg px-5 pt-[110px] pb-20">
          <div className="rounded-[2.5rem] border border-black/10 bg-neutral-50 p-10">
            <p className="text-sm text-neutral-700">
              Ungültiger Link. Bitte starte die Anmeldung erneut.
            </p>
            <Link href="/login" className="mt-6 inline-block text-sm font-medium underline">
              Zum Login
            </Link>
          </div>
        </main>
        <ShopFooter />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-white text-neutral-950">
      <ShopNav />

      <main className="mx-auto max-w-lg px-5 pt-[110px] pb-20">
        <div className="rounded-[2.5rem] border border-black/10 bg-neutral-50 p-10">
          <div className="text-[11px] uppercase tracking-[0.35em] text-neutral-600">
            Bye Bye Berlin
          </div>
          <h1 className="mt-3 font-sangbleu text-5xl font-bold tracking-tight">Code eingeben</h1>
          <p className="mt-4 text-sm leading-relaxed text-neutral-700">
            {email ? (
              <>
                Dein Konto wurde erstellt. Du erhältst einen 6-stelligen Code per E-Mail an{" "}
                <strong>{email}</strong>. Gib deine E-Mail auf der Login-Seite ein, um den Code zu
                erhalten und einzugeben.
              </>
            ) : (
              <>
                Du erhältst einen 6-stelligen Code per E-Mail. Gib ihn auf der Login-Seite ein.
              </>
            )}
          </p>

          <button
            type="button"
            onClick={redirectToShopify}
            className={cn(
              "mt-8 inline-flex h-12 w-full items-center justify-center",
              "bg-neutral-950 text-white hover:bg-neutral-900",
              "font-sangbleu text-xs font-bold uppercase tracking-[0.28em]",
            )}
          >
            Zum Login – Code eingeben
          </button>

          <div className="mt-7 text-sm text-neutral-700">
            Zurück?{" "}
            <Link href="/login" className="underline underline-offset-4 hover:opacity-80">
              Login
            </Link>{" "}
            ·{" "}
            <Link href="/register" className="underline underline-offset-4 hover:opacity-80">
              Registrieren
            </Link>
          </div>
        </div>
      </main>

      <ShopFooter />
    </div>
  );
}

export default function LoginVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-white">
          <ShopNav />
          <main className="mx-auto max-w-lg px-5 pt-[110px] pb-20">
            <div className="rounded-[2.5rem] border border-black/10 bg-neutral-50 p-10 text-sm text-neutral-600">
              Lädt …
            </div>
          </main>
          <ShopFooter />
        </div>
      }
    >
      <LoginVerifyContent />
    </Suspense>
  );
}
