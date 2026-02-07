import SubpageShell from "../_components/SubpageShell";

export default function ServicesPage() {
  return (
    <SubpageShell title="Services" eyebrow="Support">
      <div className="grid gap-6 lg:grid-cols-2">
        {[
          {
            t: "Shipping",
            d: "24–48h delivery in DE (placeholder).",
          },
          {
            t: "Returns",
            d: "30 days returns, streamlined process (placeholder).",
          },
          {
            t: "Gift-ready packaging",
            d: "Premium wrapping, ready to gift (placeholder).",
          },
          {
            t: "Care",
            d: "Material & care guidance for longevity (placeholder).",
          },
        ].map((x) => (
          <div
            key={x.t}
            className="rounded-[2rem] border border-black/10 bg-white p-10"
          >
            <div className="font-sangbleu text-3xl font-bold">{x.t}</div>
            <p className="mt-4 text-sm leading-relaxed text-neutral-700">{x.d}</p>
          </div>
        ))}
      </div>
    </SubpageShell>
  );
}

