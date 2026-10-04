"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Section, SectionHeading } from "@/components/ui/Section";
import { stack } from "@/lib/oddtech";

export default function StackTabs() {
  const [active, setActive] = useState(stack[0].key);
  const current = stack.find((s) => s.key === active)!;

  return (
    <Section className="bg-paper" id="stack">
      <SectionHeading
        align="center"
        eyebrow="Technology"
        title={
          <>
            A modern stack, <span className="text-aurora">chosen for your project.</span>
          </>
        }
        lead="We pick proven tools that fit your goals, budget, and team, not whatever is trending this week."
      />

      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Technology categories">
          {stack.map((s) => (
            <button
              key={s.key}
              role="tab"
              aria-selected={active === s.key}
              onClick={() => setActive(s.key)}
              className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                active === s.key ? "text-white" : "text-ink/70 hover:text-ink"
              }`}
            >
              {active === s.key && (
                <motion.span
                  layoutId="stack-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-deep to-brand shadow-glow"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Shown as a config file in a code editor */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-line bg-night text-white shadow-lift" role="tabpanel">
          <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-soft/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-aqua/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="ml-3 font-mono text-xs text-white/60">stack/{current.key}.json</span>
            <span className="ml-auto font-mono text-xs text-white/35">{current.items.length} tools</span>
          </div>
          <div className="min-h-[15rem] px-5 py-6 font-mono text-sm md:px-8 md:py-8">
            <p>
              <span className="text-white/45">{"{"}</span>
            </p>
            <p className="pl-5">
              <span className="text-brand-soft">&quot;category&quot;</span>
              <span className="text-white/45">: </span>
              <span className="text-aqua">&quot;{current.label}&quot;</span>
              <span className="text-white/45">,</span>
            </p>
            <p className="pl-5">
              <span className="text-brand-soft">&quot;tools&quot;</span>
              <span className="text-white/45">: [</span>
            </p>
            {/* initial={false}: first tab renders visible (even without JS); later switches animate */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.ul
                key={current.key}
                initial="hide"
                animate="show"
                exit="hide"
                variants={{ show: { transition: { staggerChildren: 0.05 } }, hide: {} }}
                className="my-2 grid grid-cols-1 gap-2 pl-10 sm:grid-cols-2 lg:grid-cols-3"
              >
                {current.items.map((item, k) => (
                  <motion.li
                    key={item}
                    variants={{ hide: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="group flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 transition-colors hover:border-aqua/40 hover:bg-aqua/[0.06]"
                  >
                    <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-aqua/60 transition-colors group-hover:bg-aqua" />
                    <span className="text-aqua">&quot;{item}&quot;</span>
                    {k < current.items.length - 1 && <span className="text-white/45">,</span>}
                  </motion.li>
                ))}
              </motion.ul>
            </AnimatePresence>
            <p className="pl-5">
              <span className="text-white/45">]</span>
            </p>
            <p>
              <span className="text-white/45">{"}"}</span>
              <span className="caret ml-1 inline-block h-[1.1em] w-[0.5em] translate-y-[0.2em] bg-aqua" />
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
