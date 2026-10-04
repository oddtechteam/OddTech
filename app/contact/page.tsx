import type { Metadata } from "next";
import PageHeader from "@/components/site/PageHeader";
import QuoteForm from "@/components/oddtech/QuoteForm";
import Icon from "@/components/ui/Icon";
import { Container, IconBadge } from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import { oddtech } from "@/lib/oddtech";

export const metadata: Metadata = { title: "Get a Quote" };

const next = [
  { t: "We review your brief", d: "The team reads your requirements and comes back with questions." },
  { t: "Free consultation call", d: "A quick call to understand goals, users, and must-haves." },
  { t: "Proposal & quote", d: "A clear scope, timeline, and itemised quote. No surprises." },
];

export default function OddTechContact() {
  return (
    <main>
      <PageHeader
        eyebrow="Get a quote"
        title={
          <>
            Let&apos;s build <span className="text-aurora">something great.</span>
          </>
        }
        lead="Tell us about your project and the OddTech team will reply within one business day."
      />

      <section className="relative z-10 -mt-12 pb-20 md:-mt-16 md:pb-28">
        <Container className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <Reveal className="card p-7 md:p-10">
            <QuoteForm />
          </Reveal>

          <Reveal delay={0.08} className="flex flex-col gap-4">
            <a href={`mailto:${oddtech.email}`} className="card group flex items-center gap-4 p-6 transition-colors hover:border-brand/30">
              <IconBadge>
                <Icon name="mail" className="h-5 w-5" />
              </IconBadge>
              <span className="min-w-0">
                <span className="block text-xs font-semibold uppercase tracking-wider text-muted">Email</span>
                <span className="block truncate font-semibold text-ink group-hover:text-brand">{oddtech.email}</span>
              </span>
            </a>
            <a href={oddtech.phone.href} className="card group flex items-center gap-4 p-6 transition-colors hover:border-brand/30">
              <IconBadge tone="aqua">
                <Icon name="phone" className="h-5 w-5" />
              </IconBadge>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-wider text-muted">Call / WhatsApp</span>
                <span className="block font-semibold text-ink group-hover:text-brand">{oddtech.phone.label}</span>
              </span>
            </a>

            <div className="grain relative overflow-hidden rounded-2xl bg-night p-7 text-white">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand/40 blur-3xl" />
              <p className="relative text-xs font-semibold uppercase tracking-[0.18em] text-aqua">What happens next</p>
              <ol className="relative mt-5 flex flex-col gap-5">
                {next.map((n, i) => (
                  <li key={n.t} className="flex gap-4">
                    <span className="font-mono flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/20 text-xs text-aqua">
                      {i + 1}
                    </span>
                    <span>
                      <span className="block font-semibold">{n.t}</span>
                      <span className="block text-sm text-white/55">{n.d}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <p className="relative mt-6 flex items-center gap-2 border-t border-white/10 pt-5 text-sm text-white/60">
                <Icon name="clock" className="h-4 w-4 text-aqua" />
                Reply within one business day
              </p>
            </div>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}
