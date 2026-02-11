"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ShopFooter from "../_components/ShopFooter";
import ShopNav from "../_components/ShopNav";

type CustomerOrder = {
  id: string;
  name: string;
  orderNumber: number;
  processedAt: string;
  financialStatus?: string | null;
  fulfillmentStatus?: string | null;
  currentTotalPrice?: { amount: string; currencyCode: string } | null;
};

type CustomerAddress = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  company?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  province?: string | null;
  country?: string | null;
  zip?: string | null;
  phone?: string | null;
};

type ShopifyCustomer = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  defaultAddress?: CustomerAddress | null;
  addresses: CustomerAddress[];
  orders: CustomerOrder[];
};

function cn(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

function formatMoney(m: { amount: string; currencyCode: string } | null | undefined) {
  if (!m) return "";
  const n = Number(m.amount);
  try {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: m.currencyCode,
    }).format(n);
  } catch {
    return `${n.toFixed(2)} ${m.currencyCode}`;
  }
}

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [customer, setCustomer] = React.useState<ShopifyCustomer | null>(null);

  const [addrFirstName, setAddrFirstName] = React.useState("");
  const [addrLastName, setAddrLastName] = React.useState("");
  const [addrAddress1, setAddrAddress1] = React.useState("");
  const [addrCity, setAddrCity] = React.useState("");
  const [addrZip, setAddrZip] = React.useState("");
  const [addrCountry, setAddrCountry] = React.useState("Germany");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/account", { cache: "no-store" });
      const json = (await res.json()) as { customer?: ShopifyCustomer; error?: string };
      if (!res.ok) {
        router.push("/login");
        return;
      }
      setCustomer(json.customer ?? null);
    } catch {
      setError("Konnte Kontodaten nicht laden.");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  async function addressAction(payload: unknown) {
    setError(null);
    try {
      const res = await fetch("/api/account/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { customer?: ShopifyCustomer; error?: string };
      if (!res.ok) {
        setError(json.error || "Aktion fehlgeschlagen.");
        return;
      }
      setCustomer(json.customer ?? null);
    } catch {
      setError("Aktion fehlgeschlagen.");
    }
  }

  async function addAddress(e: React.FormEvent) {
    e.preventDefault();
    await addressAction({
      action: "add",
      address: {
        firstName: addrFirstName || undefined,
        lastName: addrLastName || undefined,
        address1: addrAddress1 || undefined,
        city: addrCity || undefined,
        zip: addrZip || undefined,
        country: addrCountry || undefined,
      },
    });
    setAddrAddress1("");
    setAddrCity("");
    setAddrZip("");
  }

  return (
    <div className="min-h-dvh bg-white text-neutral-950">
      <ShopNav />

      <main className="mx-auto max-w-6xl px-5 pt-[110px] pb-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.35em] text-neutral-600">
              Bye Bye Berlin
            </div>
            <h1 className="mt-3 font-sangbleu text-5xl font-bold tracking-tight">Mein Konto</h1>
            {customer?.firstName && (
              <p className="mt-2 text-sm text-neutral-700">Willkommen, {customer.firstName}.</p>
            )}
          </div>
          <button
            type="button"
            onClick={logout}
            className={cn(
              "inline-flex h-12 items-center justify-center px-8",
              "bg-neutral-950 text-white hover:bg-neutral-900",
              "font-sangbleu text-xs font-bold uppercase tracking-[0.28em]",
            )}
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-10 rounded-[2.5rem] border border-black/10 bg-neutral-50 p-10 text-sm text-neutral-600">
            Lädt …
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <section className="rounded-[2.5rem] border border-black/10 bg-neutral-50 p-10">
              <h2 className="font-sangbleu text-2xl font-bold tracking-tight">Letzte Bestellungen</h2>
              <div className="mt-6 space-y-4">
                {customer?.orders?.length ? (
                  customer.orders.map((o) => (
                    <div
                      key={o.id}
                      className="rounded-2xl border border-black/10 bg-white px-5 py-4"
                    >
                      <div className="flex items-baseline justify-between gap-4">
                        <div className="font-medium">{o.name}</div>
                        <div className="text-sm text-neutral-700">{formatMoney(o.currentTotalPrice)}</div>
                      </div>
                      <div className="mt-2 text-xs text-neutral-500">
                        {new Date(o.processedAt).toLocaleDateString("de-DE")} ·{" "}
                        {o.financialStatus ?? "—"} · {o.fulfillmentStatus ?? "—"}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-neutral-600">Noch keine Bestellungen.</div>
                )}
              </div>
            </section>

            <section className="rounded-[2.5rem] border border-black/10 bg-neutral-50 p-10">
              <h2 className="font-sangbleu text-2xl font-bold tracking-tight">Lieferadressen</h2>
              <div className="mt-6 space-y-4">
                {customer?.addresses?.length ? (
                  customer.addresses.map((a) => {
                    const isDefault = customer.defaultAddress?.id === a.id;
                    return (
                      <div
                        key={a.id}
                        className={cn(
                          "rounded-2xl border bg-white px-5 py-4",
                          isDefault ? "border-neutral-950" : "border-black/10",
                        )}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="text-sm text-neutral-800">
                            <div className="font-medium">
                              {[a.firstName, a.lastName].filter(Boolean).join(" ") || "Adresse"}
                              {isDefault ? " · Standard" : ""}
                            </div>
                            <div className="mt-1 text-neutral-600">
                              {[a.address1, a.city, a.zip, a.country].filter(Boolean).join(", ")}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {!isDefault && (
                              <button
                                type="button"
                                onClick={() => addressAction({ action: "setDefault", addressId: a.id })}
                                className="text-xs uppercase tracking-[0.28em] text-neutral-700 hover:opacity-70"
                              >
                                Standard
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => addressAction({ action: "delete", addressId: a.id })}
                              className="text-xs uppercase tracking-[0.28em] text-neutral-700 hover:opacity-70"
                            >
                              Löschen
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-sm text-neutral-600">Noch keine Adresse gespeichert.</div>
                )}
              </div>

              <div className="mt-10 border-t border-black/10 pt-8">
                <div className="text-xs font-medium uppercase tracking-[0.28em] text-neutral-700">
                  Neue Adresse
                </div>
                <form onSubmit={addAddress} className="mt-4 space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                      value={addrFirstName}
                      onChange={(e) => setAddrFirstName(e.target.value)}
                      placeholder="Vorname"
                      className="h-11 w-full rounded-full border border-black/10 bg-white px-5 text-sm outline-none focus:ring-2 focus:ring-black/10"
                    />
                    <input
                      value={addrLastName}
                      onChange={(e) => setAddrLastName(e.target.value)}
                      placeholder="Nachname"
                      className="h-11 w-full rounded-full border border-black/10 bg-white px-5 text-sm outline-none focus:ring-2 focus:ring-black/10"
                    />
                  </div>
                  <input
                    value={addrAddress1}
                    onChange={(e) => setAddrAddress1(e.target.value)}
                    placeholder="Adresse"
                    required
                    className="h-11 w-full rounded-full border border-black/10 bg-white px-5 text-sm outline-none focus:ring-2 focus:ring-black/10"
                  />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <input
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      placeholder="Stadt"
                      required
                      className="h-11 w-full rounded-full border border-black/10 bg-white px-5 text-sm outline-none focus:ring-2 focus:ring-black/10"
                    />
                    <input
                      value={addrZip}
                      onChange={(e) => setAddrZip(e.target.value)}
                      placeholder="PLZ"
                      className="h-11 w-full rounded-full border border-black/10 bg-white px-5 text-sm outline-none focus:ring-2 focus:ring-black/10"
                    />
                    <input
                      value={addrCountry}
                      onChange={(e) => setAddrCountry(e.target.value)}
                      placeholder="Land"
                      className="h-11 w-full rounded-full border border-black/10 bg-white px-5 text-sm outline-none focus:ring-2 focus:ring-black/10"
                    />
                  </div>
                  <button
                    type="submit"
                    className={cn(
                      "mt-2 inline-flex h-11 w-full items-center justify-center",
                      "bg-neutral-950 text-white hover:bg-neutral-900",
                      "font-sangbleu text-xs font-bold uppercase tracking-[0.28em]",
                    )}
                  >
                    Speichern
                  </button>
                </form>
              </div>
            </section>
          </div>
        )}
      </main>

      <ShopFooter />
    </div>
  );
}

