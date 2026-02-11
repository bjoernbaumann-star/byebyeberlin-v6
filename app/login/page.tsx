"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ShopFooter from "../_components/ShopFooter";
import ShopNav from "../_components/ShopNav";

function cn(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [shopifyLoginUrl, setShopifyLoginUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/shopify-login-url", { cache: "force-cache" });
        const json = (await res.json()) as { url?: string };
        if (cancelled) return;
        setShopifyLoginUrl(json.url ?? null);
      } catch {
        if (cancelled) return;
        setShopifyLoginUrl(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(
          json.error ||
            "Login fehlgeschlagen. Hinweis: Wenn dein Shop nur „New Customer Accounts“ erlaubt, kann der klassische Login blockiert sein.",
        );
        return;
      }
      router.push("/account");
      router.refresh();
    } catch {
      setError("Verbindung fehlgeschlagen. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-white text-neutral-950">
      <ShopNav />

      <main className="mx-auto max-w-lg px-5 pt-[110px] pb-20">
        <div className="rounded-[2.5rem] border border-black/10 bg-neutral-50 p-10">
          <div className="text-[11px] uppercase tracking-[0.35em] text-neutral-600">
            Bye Bye Berlin
          </div>
          <h1 className="mt-3 font-sangbleu text-5xl font-bold tracking-tight">Login</h1>
          <p className="mt-4 text-sm leading-relaxed text-neutral-700">
            Melde dich an, um Bestellungen & Lieferadressen zu verwalten.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-[0.28em] text-neutral-700">
                E‑Mail
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                required
                className={cn(
                  "h-12 w-full rounded-full px-5 text-sm",
                  "border border-black/10 bg-white",
                  "outline-none focus:ring-2 focus:ring-black/10",
                )}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-[0.28em] text-neutral-700">
                Passwort
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
                required
                className={cn(
                  "h-12 w-full rounded-full px-5 text-sm",
                  "border border-black/10 bg-white",
                  "outline-none focus:ring-2 focus:ring-black/10",
                )}
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "mt-2 inline-flex h-12 w-full items-center justify-center",
                "bg-neutral-950 text-white hover:bg-neutral-900",
                "font-sangbleu text-xs font-bold uppercase tracking-[0.28em]",
                "disabled:opacity-60 disabled:hover:bg-neutral-950",
              )}
            >
              {loading ? "…" : "Weiter"}
            </button>
          </form>

          <div className="mt-7 text-sm text-neutral-700">
            Noch kein Konto?{" "}
            <Link href="/register" className="underline underline-offset-4 hover:opacity-80">
              Registrieren
            </Link>
          </div>

          {shopifyLoginUrl && (
            <div className="mt-5 text-xs text-neutral-500">
              New Customer Accounts (6‑stelliger Code) testen:{" "}
              <a
                href={shopifyLoginUrl}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4 hover:opacity-80"
              >
                Shopify Login öffnen
              </a>
            </div>
          )}
        </div>
      </main>

      <ShopFooter />
    </div>
  );
}

