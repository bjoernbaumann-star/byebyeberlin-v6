import SubpageShell from "../_components/SubpageShell";

export default function NewInPage() {
  return (
    <SubpageShell title="New In" eyebrow="Highlights">
      <div className="rounded-[2rem] border border-black/10 bg-neutral-50 p-10">
        <div className="font-sangbleu text-3xl font-bold">Fresh arrivals.</div>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-700">
          Latest drops, restocks, and limited capsules. (Content placeholder.)
        </p>
      </div>
    </SubpageShell>
  );
}

