import OddTechHero from "@/components/oddtech/OddTechHero";
import Highlights from "@/components/oddtech/Highlights";
import ServiceCards from "@/components/oddtech/ServiceCards";
import Industries from "@/components/oddtech/Industries";
import WhyOddTech from "@/components/oddtech/WhyOddTech";
import StackTabs from "@/components/oddtech/StackTabs";
import WorkShowcase from "@/components/oddtech/WorkShowcase";
import Engagement from "@/components/oddtech/Engagement";
import FAQ from "@/components/oddtech/FAQ";
import Process from "@/components/sections/Process";
import CTABand from "@/components/site/CTABand";
import { devProcess, oddtech } from "@/lib/oddtech";

export default function OddTechHome() {
  return (
    <main>
      <OddTechHero />
      <Highlights />
      <ServiceCards />
      <WorkShowcase />
      <Industries />
      <WhyOddTech />
      <StackTabs />
      <Process
        steps={devProcess}
        eyebrow="Development process"
        title={
          <>
            From idea to launch, <span className="text-aurora">without the chaos.</span>
          </>
        }
        lead="Six clear stages with demos along the way, so you always know what's done, what's next, and when you'll go live."
      />
      <Engagement />
      <FAQ />
      <CTABand
        title={
          <>
            Turn your idea into an <span className="text-aurora">app, store, or system.</span>
          </>
        }
        lead="Tell us what you want to build. We'll scope it, design it, and ship it."
        cta="Let's build it"
        href="/contact"
        phone={oddtech.phone}
      />
    </main>
  );
}
