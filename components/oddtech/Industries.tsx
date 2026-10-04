import Icon from "@/components/ui/Icon";
import { Section, SectionHeading } from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import { industries } from "@/lib/oddtech";

export default function Industries() {
  return (
    <Section className="bg-paper">
      <SectionHeading
        align="center"
        eyebrow="Industries"
        title={
          <>
            Built for the way <span className="text-aurora">your industry works.</span>
          </>
        }
        lead="Different businesses, different problems. We shape every product around your customers and operations."
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {industries.map((ind, i) => (
          <Reveal key={ind.t} delay={(i % 4) * 0.06}>
            <div className="group relative h-full overflow-hidden rounded-2xl border border-line bg-surface p-6 transition-all duration-500 hover:-translate-y-1 hover:border-transparent hover:shadow-lift md:p-7">
              {/* Gradient wash that slides up on hover */}
              <div className="absolute inset-0 translate-y-full bg-gradient-to-br from-brand to-plum transition-transform duration-500 ease-out group-hover:translate-y-0" />
              <div className="relative">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand transition-colors duration-500 group-hover:bg-white/15 group-hover:text-white">
                  <Icon name={ind.icon} className="h-6 w-6" />
                </span>
                <h3 className="font-display mt-6 text-lg font-bold text-ink transition-colors duration-500 group-hover:text-white">{ind.t}</h3>
                <p className="mt-1.5 text-sm text-muted transition-colors duration-500 group-hover:text-white/75">{ind.d}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
