import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import Spotlight from "@/components/ui/Spotlight";
import { Eyebrow, IconBadge, Section } from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import Aurora from "@/components/site/Aurora";
import { reasons } from "@/lib/oddtech";

export default function WhyOddTech() {
  return (
    <Section dark backdrop={<Aurora />}>
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow light>Why OddTech</Eyebrow>
          <h2 className="font-display mt-5 text-[2.25rem] font-extrabold leading-[1.02] md:text-[3.5rem]">
            Engineering with a <span className="text-aurora">creative edge.</span>
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/60">
            We&apos;re developers who sit next to strategists, designers, and marketers, so what we build doesn&apos;t
            just work, it gets used.
          </p>
          <div className="mt-9">
            <Button href="/contact">Start your project</Button>
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2">
          {reasons.map((r, i) => (
            <Reveal key={r.t} delay={(i % 2) * 0.08}>
              <Spotlight dark className="card-dark group h-full p-7">
                <IconBadge tone="dark">
                  <Icon name={r.icon} className="h-5 w-5" />
                </IconBadge>
                <h3 className="font-display mt-6 text-lg font-bold">{r.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{r.d}</p>
              </Spotlight>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
