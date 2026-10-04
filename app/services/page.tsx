import type { Metadata } from "next";
import PageHeader from "@/components/site/PageHeader";
import CTABand from "@/components/site/CTABand";
import Engagement from "@/components/oddtech/Engagement";
import Process from "@/components/sections/Process";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Spotlight from "@/components/ui/Spotlight";
import { Container, IconBadge } from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import { devProcess, oddtech, services } from "@/lib/oddtech";

export const metadata: Metadata = { title: "Services" };

export default function OddTechServices() {
  return (
    <main>
      <PageHeader
        eyebrow="OddTech services"
        title={
          <>
            Build, launch, secure <span className="text-aurora">& scale.</span>
          </>
        }
        lead="Eleven services that cover the full life of a digital product, from UI/UX and development to SEO, marketing, cloud, security, and 24/7 support."
      >
        <div className="flex flex-wrap gap-2">
          {services.map((s) => (
            <a
              key={s.key}
              href={`#${s.key}`}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/85 backdrop-blur transition-colors hover:border-aqua hover:text-white"
            >
              {s.title}
              {s.isNew && <span className="ml-2 rounded-full bg-aqua px-1.5 py-0.5 text-[0.65rem] font-bold uppercase text-night">New</span>}
            </a>
          ))}
        </div>
      </PageHeader>

      <section className="relative z-10 -mt-12 pb-20 md:-mt-16 md:pb-28">
        <Container className="flex flex-col gap-6">
          {services.map((s, i) => (
            <Reveal key={s.key} id={s.key} className="scroll-mt-28">
              <Spotlight className="card group grid gap-8 overflow-hidden p-8 md:grid-cols-[1fr_1fr] md:gap-14 md:p-12">
                <div>
                  <div className="flex items-center gap-4">
                    <IconBadge size="lg" tone={i % 2 ? "aqua" : "brand"}>
                      <Icon name={s.icon} className="h-6 w-6" />
                    </IconBadge>
                    <span className="font-mono text-sm text-muted">{String(i + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}</span>
                    {s.isNew && <span className="rounded-full bg-aqua px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-night">New</span>}
                  </div>
                  <h2 className="font-display mt-7 text-3xl font-extrabold text-ink md:text-4xl">{s.title}</h2>
                  <p className="mt-2 font-semibold text-brand">{s.short}</p>
                  <p className="mt-4 leading-relaxed text-muted">{s.long}</p>
                  <div className="mt-8">
                    <Button href="/contact" variant="secondary" size="md">
                      Get a quote
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">What you get</p>
                  <ul className="mt-4 grid gap-3">
                    {s.deliverables.map((d) => (
                      <li
                        key={d}
                        className="flex items-center gap-3 rounded-xl border border-line bg-paper px-4 py-4 font-medium text-ink transition-colors group-hover:border-brand/20"
                      >
                        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-plum text-white">
                          <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.8} />
                        </span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </Spotlight>
            </Reveal>
          ))}
        </Container>
      </section>

      <Engagement />
      <Process
        steps={devProcess}
        eyebrow="Development process"
        title={
          <>
            How every project <span className="text-aurora">comes together.</span>
          </>
        }
        lead="Six clear stages with demos along the way."
      />
      <CTABand
        title={
          <>
            Not sure which service <span className="text-aurora">you need?</span>
          </>
        }
        lead="Tell us the problem you're solving and we'll recommend the right mix of design, development, and infrastructure."
        cta="Talk to OddTech"
        href="/contact"
        phone={oddtech.phone}
      />
    </main>
  );
}
