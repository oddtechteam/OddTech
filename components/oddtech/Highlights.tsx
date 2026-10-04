import { Container } from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import { highlights } from "@/lib/oddtech";

// Stat strip shown just below the hero.
export default function Highlights() {
  return (
    <section className="relative z-10 bg-paper pt-16 md:pt-20">
      <Container>
        <Reveal>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line shadow-lift md:grid-cols-4">
            {highlights.map((h) => (
              <div key={h.label} className="bg-surface px-6 py-8 text-center">
                <dt className="sr-only">{h.label}</dt>
                <dd className="font-display text-aurora text-4xl font-extrabold md:text-5xl">{h.value}</dd>
                <dd className="mt-2 text-sm font-medium text-muted">{h.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
