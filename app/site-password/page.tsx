"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

export default function SitePasswordPage() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/site-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        window.location.href = from;
        return;
      }
      setError(json.error || "Falsches Passwort");
    } catch {
      setError("Fehler bei der Verbindung");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-white">
      <div className="w-full max-w-sm px-6">
        <h1 className="font-sangbleu mb-6 text-center text-2xl font-bold text-neutral-950">
          Passwort erforderlich
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passwort eingeben"
            className="font-sangbleu w-full rounded-none border border-neutral-300 px-4 py-3 text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none"
            autoFocus
            disabled={loading}
          />
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="font-sangbleu w-full rounded-none border border-neutral-950 bg-neutral-950 py-3 text-sm font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "…" : "Anmelden"}
          </button>
        </form>
      </div>
    </div>
  );
}
