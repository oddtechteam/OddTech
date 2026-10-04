import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { IconBadge, Section, SectionHeading } from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import { engagement } from "@/lib/oddtech";

export default function Engagement() {
  return (
    <Section className="bg-surface">
      <SectionHeading
        align="center"
        eyebrow="Ways to work with us"
        title={
          <>
            Flexible engagement, <span className="text-aurora">clear commitments.</span>
          </>
        }
        lead="Pick the model that fits your project today, and switch as your needs change."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {engagement.map((m, i) => (
          <Reveal key={m.t} delay={i * 0.08}>
            <div
              className={`group relative flex h-full flex-col rounded-[2rem] p-8 transition-transform duration-500 hover:-translate-y-1 md:p-10 ${
                m.featured ? "ring-aurora grain overflow-hidden bg-night text-white shadow-lift" : "border border-line bg-paper"
              }`}
            >
              {m.featured && (
                <span className="absolute right-6 top-6 rounded-full bg-aqua px-3 py-1 text-xs font-bold text-night">Most flexible</span>
              )}
              <IconBadge tone={m.featured ? "dark" : "brand"} size="lg">
                <Icon name={m.icon} className="h-6 w-6" />
              </IconBadge>
              <h3 className="font-display mt-7 text-2xl font-extrabold">{m.t}</h3>
              <p className={`mt-2 ${m.featured ? "text-white/65" : "text-muted"}`}>{m.d}</p>
              <p className={`mt-6 text-xs font-semibold uppercase tracking-wider ${m.featured ? "text-aqua" : "text-brand"}`}>Best for</p>
              <p className={`mt-1 font-medium ${m.featured ? "text-white" : "text-ink"}`}>{m.best}</p>
              <ul className={`mt-6 flex flex-col gap-3 border-t pt-6 ${m.featured ? "border-white/10" : "border-line"}`}>
                {m.points.map((pt) => (
                  <li key={pt} className={`flex items-center gap-2.5 text-sm ${m.featured ? "text-white/85" : "text-ink/80"}`}>
                    <Icon name="check" className={`h-4 w-4 ${m.featured ? "text-aqua" : "text-brand"}`} strokeWidth={2.4} />
                    {pt}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <Button href="/contact" variant={m.featured ? "primary" : "secondary"} size="md">
                  Get a quote
                </Button>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
