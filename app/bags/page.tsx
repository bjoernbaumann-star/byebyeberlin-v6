import SubpageShell from "../_components/SubpageShell";

export default function BagsPage() {
  return (
    <SubpageShell title="Bags" eyebrow="Shop">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[
          "Mini Bags",
          "Shoulder Bags",
          "Totes",
          "Leather Goods",
          "Evening",
          "Limited Editions",
        ].map((x) => (
          <div
            key={x}
            className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_30px_80px_-60px_rgba(0,0,0,.55)]"
          >
            <div className="font-sangbleu text-2xl font-bold">{x}</div>
            <p className="mt-2 text-sm text-neutral-600">
              Structured forms, refined hardware, quiet luxury.
            </p>
          </div>
        ))}
      </div>
    </SubpageShell>
  );
}

