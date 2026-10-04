import type { Metadata } from "next";
import PageHeader from "@/components/site/PageHeader";
import CTABand from "@/components/site/CTABand";
import { WorkStack } from "@/components/oddtech/WorkShowcase";
import Marquee from "@/components/ui/Marquee";
import { oddtech, work } from "@/lib/oddtech";

export const metadata: Metadata = { title: "Our Work" };

export default function OddTechWork() {
  return (
    <main>
      <PageHeader
        eyebrow="Our work"
        title={
          <>
            Live sites, <span className="text-aurora">designed & shipped.</span>
          </>
        }
        lead="Websites our team has designed, built, and launched for businesses across fashion, hospitality, education, manufacturing, and public life. Hover a preview to scroll through it, or open it live."
      >
        <div className="flex flex-wrap gap-2">
          {work.map((w) => (
            <span
              key={w.client}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/85 backdrop-blur"
            >
              {w.client}
            </span>
          ))}
        </div>
      </PageHeader>

      <div className="border-b border-line bg-surface py-5">
        <Marquee seconds={40}>
          {[...work, ...work].map((w, i) => (
            <a
              key={i}
              href={w.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display mx-8 whitespace-nowrap text-2xl font-bold text-ink/25 transition-colors hover:text-brand md:text-3xl"
            >
              {w.client}
            </a>
          ))}
        </Marquee>
      </div>

      <div className="pt-16 md:pt-24">
        <WorkStack />
      </div>

      <CTABand
        title={
          <>
            Your website <span className="text-aurora">could be next.</span>
          </>
        }
        lead="Share your idea and we'll show you how we'd build it."
        cta="Start a project"
        href="/contact"
        phone={oddtech.phone}
      />
    </main>
  );
}
