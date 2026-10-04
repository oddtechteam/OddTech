import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import SitePreview from "./SitePreview";
import { work, type WorkItem } from "@/lib/oddtech";

function Chips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((s) => (
        <span key={s} className="rounded-full border border-line bg-paper px-3 py-1 font-mono text-xs text-ink/75">
          {s}
        </span>
      ))}
    </div>
  );
}

function VisitLink({ w, className = "" }: { w: WorkItem; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-semibold text-brand ${className}`}>
      Visit website
      <Icon name="arrowUpRight" className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2.2} />
    </span>
  );
}

// Overview: the featured projects in a grid.
export default function WorkShowcase() {
  const featured = work.filter((w) => w.featured);
  return (
    <Section className="bg-surface">
      <SectionHeading
        eyebrow="Our work"
        title={
          <>
            Live sites we&apos;ve <span className="text-aurora">designed & shipped.</span>
          </>
        }
        lead="Real products for real businesses. Hover a preview to scroll through the site, or open it live."
        action={
          <Button href="/work" variant="secondary">
            View All
          </Button>
        }
      />
      <div className="grid gap-6 md:grid-cols-3">
        {featured.map((w, i) => (
          <Reveal key={w.client} delay={i * 0.08}>
            <a href={w.url} target="_blank" rel="noopener noreferrer" className="group flex h-full flex-col">
              <SitePreview src={w.image} url={w.url} title={w.client} className="aspect-[4/3.4]" />
              <div className="flex flex-1 flex-col px-1 pt-6">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">{w.industry}</span>
                <h3 className="font-display mt-2 text-2xl font-extrabold text-ink transition-colors group-hover:text-brand">{w.client}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{w.summary}</p>
                <div className="mt-4">
                  <Chips items={w.services} />
                </div>
                <VisitLink w={w} className="mt-auto pt-5" />
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

// Work page: every project as a large card; on desktop the cards pin and
// stack on top of one another as you scroll.
export function WorkStack() {
  return (
    <section className="bg-paper pb-24 md:pb-32">
      <Container>
        <div className="flex flex-col gap-8 md:gap-16">
          {work.map((w, i) => (
            <article
              key={w.client}
              className="md:sticky"
              style={{ top: `calc(6.5rem + ${i * 1.25}rem)`, zIndex: i + 1 }}
            >
              <Reveal>
                <a
                  href={w.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid overflow-hidden rounded-[2rem] border border-line bg-surface p-4 shadow-lift transition-shadow md:grid-cols-[1.15fr_0.85fr] md:gap-4 md:p-5"
                >
                  <SitePreview src={w.image} url={w.url} title={w.client} className="aspect-[16/10.5]" />
                  <div className="flex flex-col p-4 md:p-8">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                        {w.industry}
                      </span>
                      <span className="font-mono text-sm text-muted">
                        {String(i + 1).padStart(2, "0")} / {String(work.length).padStart(2, "0")}
                      </span>
                    </div>
                    <h2 className="font-display mt-6 text-3xl font-extrabold text-ink transition-colors group-hover:text-brand md:text-4xl">
                      {w.client}
                    </h2>
                    <p className="mt-3 leading-relaxed text-muted">{w.summary}</p>
                    <div className="mt-5">
                      <Chips items={w.services} />
                    </div>
                    {w.quote && (
                      <blockquote className="mt-6 border-l-2 border-brand pl-4 text-sm leading-relaxed text-ink/75">
                        &ldquo;{w.quote}&rdquo;
                      </blockquote>
                    )}
                    <div className="mt-auto flex items-center justify-between gap-4 pt-7">
                      <span className="font-mono text-xs text-muted">{w.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}</span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-deep to-brand px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform group-hover:-translate-y-0.5">
                        Visit website
                        <Icon name="arrowUpRight" className="h-4 w-4" strokeWidth={2.2} />
                      </span>
                    </div>
                  </div>
                </a>
              </Reveal>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
