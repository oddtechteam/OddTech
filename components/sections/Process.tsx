"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { Section, SectionHeading } from "@/components/ui/Section";
import { process as defaultSteps } from "@/lib/site";

type StepData = { t: string; d: string };

function Step({ i, n, t, d, progress }: { i: number; n: number; t: string; d: string; progress: MotionValue<number> }) {
  const at = i / (n - 1);
  const on = useTransform(progress, [at - 0.12, at], [0, 1]);
  const scale = useTransform(on, [0, 1], [0.85, 1]);
  return (
    <li className="relative flex gap-5 md:flex-col md:gap-0">
      <span className="font-display relative z-10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-line bg-surface text-sm font-bold text-muted">
        {String(i + 1).padStart(2, "0")}
        <motion.span
          style={{ opacity: on, scale }}
          className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-br from-brand to-plum text-white shadow-glow"
        >
          {String(i + 1).padStart(2, "0")}
        </motion.span>
      </span>
      <div className="md:mt-7 md:pr-4">
        <h3 className="font-display text-xl font-bold text-ink">{t}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
      </div>
    </li>
  );
}

// Steps light up in order as the connecting line fills with scroll.
export default function Process({
  steps = defaultSteps,
  eyebrow = "How we work",
  title = (
    <>
      From vision to reality, <span className="text-aurora">in five steps.</span>
    </>
  ),
  lead = "A clear, repeatable process, so you always know what's happening, what's next, and why.",
  id,
}: {
  steps?: StepData[];
  eyebrow?: string;
  title?: React.ReactNode;
  lead?: string;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.55"] });
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const fill = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <Section className="bg-surface" id={id}>
      <SectionHeading eyebrow={eyebrow} title={title} lead={lead} />
      <div ref={ref} className="relative">
        {/* Track + animated fill: vertical on mobile, horizontal on desktop */}
        <div className="absolute bottom-0 left-[27px] top-0 w-[2px] bg-line md:bottom-auto md:left-7 md:right-7 md:top-[27px] md:h-[2px] md:w-auto">
          <motion.div className="h-full w-full origin-top bg-gradient-to-b from-brand via-plum to-aqua md:hidden" style={{ scaleY: progress }} />
          <motion.div className="hidden h-full bg-gradient-to-r from-brand via-plum to-aqua md:block" style={{ width: fill }} />
        </div>
        <ol className={`relative grid gap-10 ${steps.length === 6 ? "md:grid-cols-6" : "md:grid-cols-5"} md:gap-6`}>
          {steps.map((s, i) => (
            <Step key={s.t} i={i} n={steps.length} t={s.t} d={s.d} progress={progress} />
          ))}
        </ol>
      </div>
    </Section>
  );
}
