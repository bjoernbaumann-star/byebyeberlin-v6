import SubpageShell from "../_components/SubpageShell";

export default function TravelPage() {
  return (
    <SubpageShell title="Travel" eyebrow="Edit">
      <div className="rounded-[2rem] border border-black/10 bg-neutral-50 p-10">
        <div className="font-sangbleu text-3xl font-bold">Travel essentials.</div>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-700">
          Weekender-ready pieces and refined accessories. (Content placeholder.)
        </p>
      </div>
    </SubpageShell>
  );
}

