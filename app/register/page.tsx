"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ShopFooter from "../_components/ShopFooter";
import ShopNav from "../_components/ShopNav";

function cn(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(json.error || "Registration failed. Please try again.");
        return;
      }
      router.push("/account");
      router.refresh();
    } catch {
      setError("Connection failed. Please try again.");
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
            BYE BYE BERLIN
          </div>
          <h1 className="mt-3 font-sangbleu text-5xl font-bold tracking-tight">Register</h1>
          <p className="mt-4 text-sm leading-relaxed text-neutral-700">
            Create your account to checkout faster.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-[0.28em] text-neutral-700">
                  First name
                </label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  type="text"
                  autoComplete="given-name"
                  className={cn(
                    "h-12 w-full rounded-full px-5 text-sm",
                    "border border-black/10 bg-white",
                    "outline-none focus:ring-2 focus:ring-black/10",
                  )}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-[0.28em] text-neutral-700">
                  Last name
                </label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  type="text"
                  autoComplete="family-name"
                  className={cn(
                    "h-12 w-full rounded-full px-5 text-sm",
                    "border border-black/10 bg-white",
                    "outline-none focus:ring-2 focus:ring-black/10",
                  )}
                />
              </div>
            </div>

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
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                className={cn(
                  "h-12 w-full rounded-full px-5 text-sm",
                  "border border-black/10 bg-white",
                  "outline-none focus:ring-2 focus:ring-black/10",
                )}
              />
              <div className="text-xs text-neutral-500">At least 8 characters.</div>
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
              {loading ? "…" : "Create account"}
            </button>
          </form>

          <div className="mt-7 text-sm text-neutral-700">
            Already have an account?{" "}
            <Link href="/login" className="underline underline-offset-4 hover:opacity-80">
              Login
            </Link>
          </div>
        </div>
      </main>

      <ShopFooter />
    </div>
  );
}

