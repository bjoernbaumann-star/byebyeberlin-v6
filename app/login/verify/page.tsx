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
              Invalid link. Please start the login again.
            </p>
            <Link href="/login" className="mt-6 inline-block text-sm font-medium underline">
              Go to login
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
          <h1 className="mt-3 font-sangbleu text-5xl font-bold tracking-tight">Enter code</h1>
          <p className="mt-4 text-sm leading-relaxed text-neutral-700">
            {email ? (
              <>
                Your account was created. You will receive a 6-digit code by email at{" "}
                <strong>{email}</strong>. Enter your email on the login page to receive and enter the code.
              </>
            ) : (
              <>
                You will receive a 6-digit code by email. Enter it on the login page.
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
            Go to login – Enter code
          </button>

          <div className="mt-7 text-sm text-neutral-700">
            Back?{" "}
            <Link href="/login" className="underline underline-offset-4 hover:opacity-80">
              Login
            </Link>{" "}
            ·{" "}
            <Link href="/register" className="underline underline-offset-4 hover:opacity-80">
              Register
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
              Loading …
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
