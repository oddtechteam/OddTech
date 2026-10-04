import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import Spotlight from "@/components/ui/Spotlight";
import { IconBadge, Section, SectionHeading } from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import { services } from "@/lib/oddtech";

export default function ServiceCards() {
  return (
    <Section className="bg-paper">
      <SectionHeading
        eyebrow="Services"
        title={
          <>
            Everything you need to <span className="text-aurora">build, launch & run.</span>
          </>
        }
        lead="Eleven core services, one accountable team, from the first wireframe to 24/7 support after launch."
        action={
          <Button href="/services" variant="secondary">
            All services
          </Button>
        }
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.key} delay={(i % 3) * 0.07}>
            <Spotlight className="card group h-full transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
              <Link href={`/services#${s.key}`} className="flex h-full flex-col p-8">
                <div className="flex items-start justify-between">
                  <IconBadge tone={i % 2 ? "aqua" : "brand"} size="lg">
                    <Icon name={s.icon} className="h-6 w-6" />
                  </IconBadge>
                  {s.isNew ? (
                    <span className="rounded-full bg-aqua px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-night">New</span>
                  ) : (
                    <span className="font-mono text-xs text-muted/60">{String(i + 1).padStart(2, "0")}</span>
                  )}
                </div>
                <h3 className="font-display mt-7 text-xl font-extrabold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.short}</p>
                <span className="mt-auto flex items-center gap-1.5 pt-6 text-sm font-semibold text-brand">
                  Learn more
                  <Icon name="arrowRight" className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.2} />
                </span>
              </Link>
            </Spotlight>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
