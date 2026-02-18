import CenteredVideoHero from "../_components/CenteredVideoHero";
import FuckNazisMarquee from "../_components/FuckNazisMarquee";
import ShopFooter from "../_components/ShopFooter";
import ShopNav from "../_components/ShopNav";

export default function BoundariesAndValuesPage() {
  return (
    <div className="min-h-dvh bg-white text-neutral-950">
      <ShopNav />
      <main className="pt-[76px]">
        <div className="relative">
          <CenteredVideoHero
            primarySrc="/header_video_B&V.mp4"
            fallbackSrc="/BG%20VIDEO.mp4"
            fullScreen
          />
          <FuckNazisMarquee />
        </div>
        <section className="mx-auto max-w-4xl py-16">
          <div className="px-4 text-left md:px-8">
            <div className="ml-[4px] font-sangbleu text-[11px] uppercase tracking-normal text-neutral-600">
              BYE BYE BERLIN
            </div>
            <h1 className="-ml-[3px] mt-4 font-sangbleu text-6xl font-bold leading-none tracking-tight">
              We love Berlin, but we hate Nazis and despise any racist or antisemitic statement, action, or opinion.
            </h1>
            <p className="mt-8 font-sangbleu text-2xl leading-relaxed text-neutral-900">
              Clear limits. Clear standards.
            </p>

            <div className="mt-12 space-y-10 text-lg leading-relaxed text-neutral-800">
              <p className="font-sangbleu">
                Content for this page.
              </p>
            </div>
          </div>
        </section>
      </main>
      <ShopFooter />
    </div>
  );
}
