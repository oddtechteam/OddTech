"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { Eyebrow, Section } from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import { faqs, oddtech } from "@/lib/oddtech";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section className="bg-surface" id="faq">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="font-display mt-5 text-[2.25rem] font-extrabold leading-[1.02] text-ink md:text-[3.25rem]">
            Questions, <span className="text-aurora">answered.</span>
          </h2>
          <p className="mt-5 max-w-sm text-muted">Can&apos;t find what you&apos;re looking for? Talk to the team directly.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/contact" size="md">
              Ask a question
            </Button>
            <Button href={oddtech.phone.href} variant="secondary" size="md" arrow={false}>
              Call us
            </Button>
          </div>
        </Reveal>

        <ul className="flex flex-col gap-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q} className={`rounded-2xl border transition-colors ${isOpen ? "border-brand/30 bg-brand-50/40" : "border-line bg-paper"}`}>
                <h3>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
                  >
                    <span className="font-display text-lg font-bold text-ink">{f.q}</span>
                    <span
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                        isOpen ? "rotate-45 bg-brand text-white" : "bg-surface text-ink"
                      }`}
                    >
                      <Icon name="plus" className="h-4 w-4" strokeWidth={2.4} />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 leading-relaxed text-muted">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
