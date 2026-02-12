import ShopFooter from "../_components/ShopFooter";
import ShopNav from "../_components/ShopNav";

export default function StoryPage() {
  return (
    <div className="min-h-dvh bg-white text-neutral-950">
      <ShopNav />
      <main className="pt-[76px]">
        <section className="mx-auto max-w-4xl px-5 py-16">
          <div className="text-[11px] uppercase tracking-[0.35em] text-neutral-600">
            Editorial
          </div>
          <h1 className="mt-4 font-sangbleu text-6xl font-bold tracking-tight">
            Story
          </h1>
          <p className="mt-8 font-sangbleu text-2xl leading-relaxed text-neutral-900">
            Bye Bye Berlin is a farewell to noise — and a hello to precision.
            Eine Marke für klare Linien, schwere Materialien und Details, die man
            erst beim zweiten Blick erkennt.
          </p>

          <div className="mt-12 space-y-10 text-lg leading-relaxed text-neutral-800">
            <p className="font-sangbleu">
              Wir glauben an einen Luxus, der nicht laut sein muss. Statt Logos:
              Proportionen. Statt Trends: Silhouetten. Statt Hype: Haptik.
            </p>
            <p className="font-sangbleu">
              Unsere Pieces sind für den Alltag gebaut — aber mit dem Anspruch
              eines Ateliers. Jede Kante sitzt, jeder Ton ist kontrolliert, jede
              Oberfläche fühlt sich bewusst an.
            </p>
            <p className="font-sangbleu">
              Berlin bleibt in der Energie: direkt, klar, ehrlich. Aber der
              Ausdruck ist refined — ruhig, präzise, editorial.
            </p>
          </div>
        </section>
      </main>
      <ShopFooter />
    </div>
  );
}

