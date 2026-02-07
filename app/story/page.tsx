import SubpageShell from "../_components/SubpageShell";

export default function StoryPage() {
  return (
    <SubpageShell title="Story" eyebrow="About">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-black/10 bg-white p-10">
          <div className="font-sangbleu text-3xl font-bold">Berlin, refined.</div>
          <p className="mt-4 text-sm leading-relaxed text-neutral-700">
            Bye Bye Berlin is an ode to precision: quiet silhouettes, rich
            materials, and subtle details. (Content placeholder.)
          </p>
        </div>
        <div className="rounded-[2rem] border border-black/10 bg-white p-10">
          <div className="font-sangbleu text-3xl font-bold">Atelier notes.</div>
          <p className="mt-4 text-sm leading-relaxed text-neutral-700">
            Designed for longevity — crafted to feel effortless. (Content
            placeholder.)
          </p>
        </div>
      </div>
    </SubpageShell>
  );
}

