import ShopFooter from "../_components/ShopFooter";
import ShopNav from "../_components/ShopNav";

export default function StoryPage() {
  return (
    <div className="min-h-dvh bg-white text-neutral-950">
      <ShopNav />
      <main className="pt-[76px]">
        <section className="mx-auto max-w-4xl px-5 py-16">
          <div className="text-[11px] uppercase tracking-[0.35em] text-neutral-600">
            EDITORIAL
          </div>
          <h1 className="mt-4 font-sangbleu text-6xl font-bold tracking-tight">
            STORY
          </h1>
          <p className="mt-8 font-sangbleu text-2xl leading-relaxed text-neutral-900">
            BYE BYE BERLIN is a farewell to noise — and a hello to precision.
            A brand for clean lines, substantial materials and details you notice
            at second glance.
          </p>

          <div className="mt-12 space-y-10 text-lg leading-relaxed text-neutral-800">
            <p className="font-sangbleu">
              We believe in a luxury that doesn't need to be loud. Instead of logos:
              proportions. Instead of trends: silhouettes. Instead of hype: haptics.
            </p>
            <p className="font-sangbleu">
              Our pieces are built for everyday — but with the ambition of an
              atelier. Every edge sits right, every tone is controlled, every
              surface feels intentional.
            </p>
            <p className="font-sangbleu">
              Berlin stays in the energy: direct, clear, honest. But the
              expression is refined — quiet, precise, editorial.
            </p>
          </div>
        </section>
      </main>
      <ShopFooter />
    </div>
  );
}

