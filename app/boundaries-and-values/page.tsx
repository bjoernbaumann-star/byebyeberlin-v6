import CenteredVideoHero from "../_components/CenteredVideoHero";
import ShopFooter from "../_components/ShopFooter";
import ShopNav from "../_components/ShopNav";

export default function BoundariesAndValuesPage() {
  return (
    <div className="min-h-dvh bg-white text-neutral-950">
      <ShopNav />
      <main className="pt-[76px]">
        <CenteredVideoHero
          primarySrc="/header_video_B&V.mp4"
          fallbackSrc="/BG%20VIDEO.mp4"
          fullScreen
        />
        <section className="mx-auto max-w-4xl px-5 py-16">
          <div className="text-[11px] uppercase tracking-[0.35em] text-neutral-600">
            BYE BYE BERLIN
          </div>
          <h1 className="mt-4 font-sangbleu text-6xl font-bold tracking-tight">
            BOUNDARIES AND VALUES
          </h1>
          <p className="mt-8 font-sangbleu text-2xl leading-relaxed text-neutral-900">
            Clear limits. Clear standards.
          </p>

          <div className="mt-12 space-y-10 text-lg leading-relaxed text-neutral-800">
            <p className="font-sangbleu">
              Content for this page.
            </p>
          </div>
        </section>
      </main>
      <ShopFooter />
    </div>
  );
}
