"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import OddTechLogo from "@/components/OddTechLogo";
import Marquee from "@/components/ui/Marquee";
import ParallaxLayer, { usePointer } from "@/components/ui/ParallaxLayer";
import { Container, Eyebrow } from "@/components/ui/Section";
import HeroBackdrop from "./HeroBackdrop";
import { oddtech, work } from "@/lib/oddtech";

const words = ["scale.", "convert.", "perform.", "grow."];
const lines = [
  ["We", "build", "websites"],
  ["&", "apps", "that"],
];
const reel = work.map((w) => ({
  src: w.image.replace(".jpg", "-hero.jpg"),
  domain: w.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""),
  client: w.client,
}));

// The build script shown in the hero editor: [className, text] tokens per line.
const kw = "text-brand-soft";
const str = "text-aqua";
const fn = "text-white";
const dim = "text-white/45";
const code: [string, string][][] = [
  [[dim, "// your idea, shipped"]],
  [[kw, "const "], [fn, "site"], [dim, " = "], [kw, "await "], [fn, "build"], [dim, "({"]],
  [[dim, "  design: "], [str, '"custom"'], [dim, ","]],
  [[dim, "  apps: ["], [str, '"web"'], [dim, ", "], [str, '"ios"'], [dim, "],"]],
  [[dim, "  seo: "], [kw, "true"], [dim, ","]],
  [[dim, "});"]],
  [[kw, "await "], [fn, "deploy"], [dim, "(site);"]],
];

// OddTech hero: code that types itself out next to the live result — real client sites.
export default function OddTechHero() {
  const { mx, my, onPointerMove } = usePointer();
  const [w, setW] = useState(0);
  const [site, setSite] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const a = setInterval(() => setW((i) => (i + 1) % words.length), 2600);
    const b = setInterval(() => setSite((i) => (i + 1) % reel.length), 5200);
    return () => {
      clearInterval(a);
      clearInterval(b);
    };
  }, []);

  const current = reel[site];

  return (
    <section onPointerMove={onPointerMove} className="grain relative flex min-h-[100svh] flex-col overflow-hidden bg-night pt-28 text-white lg:pt-32">
      <HeroBackdrop />
      <div
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{ background: "radial-gradient(560px circle at var(--gx, 70%) var(--gy, 40%), rgb(var(--aqua) / 0.18), transparent 60%)" }}
      />

      <Container className="relative grid flex-1 grid-cols-1 items-center gap-16 pb-16 lg:grid-cols-[1.12fr_0.88fr] lg:gap-10">
        {/* ---------- Copy ---------- */}
        <div className="min-w-0">
          <div className="fade-up">
            <Eyebrow light>{oddtech.tagline}</Eyebrow>
          </div>

          <h1 className="font-display mt-8 text-[2.6rem] font-extrabold leading-[1.04] sm:text-6xl lg:text-[3.4rem] xl:text-[3.9rem]">
            <span className="sr-only">We build websites and apps that scale.</span>
            <span aria-hidden="true">
              {lines.map((line, l) => (
                <span key={l} className="block lg:whitespace-nowrap">
                  {line.map((wd, i) => (
                    <span key={wd} className="fade-up mr-[0.22em] inline-block" style={{ animationDelay: `${0.06 + (l * 3 + i) * 0.07}s` }}>
                      {wd}
                    </span>
                  ))}
                </span>
              ))}
              <span className="relative inline-flex h-[1.12em] overflow-hidden align-bottom">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={words[w]}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative inline-block whitespace-nowrap pb-[0.08em] text-aqua"
                  >
                    {words[w]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <svg key={w} viewBox="0 0 300 20" className="-mt-1 block h-4 w-[min(70%,18rem)] text-aqua" fill="none" preserveAspectRatio="none">
                <path className="draw-line" pathLength={1} d="M3 14C60 5 120 4 180 8s90 6 117-2" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="fade-up mt-7 max-w-xl text-lg leading-relaxed text-white/65" style={{ animationDelay: "0.45s" }}>
            <span className="font-semibold text-white">{oddtech.sub}</span> {oddtech.intro}
          </p>

          <div className="fade-up mt-9 flex flex-wrap items-center gap-4" style={{ animationDelay: "0.55s" }}>
            <Button href="/contact">Get a free quote</Button>
            <Button href="/work" variant="ghostLight" arrow={false}>
              See live work
            </Button>
          </div>

          <div className="fade-up mt-10 flex flex-wrap gap-2" style={{ animationDelay: "0.65s" }} aria-label="What we build">
            {["Websites", "Mobile apps", "Online stores", "CRMs", "SEO & ads", "LinkedIn"].map((t) => (
              <span key={t} className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 font-mono text-xs text-white/75">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* ---------- Code → live site ---------- */}
        <div className="fade-up relative mx-auto aspect-[1/0.95] w-full min-w-0 max-w-[34rem]" style={{ animationDelay: "0.25s" }}>
          {/* Editor: the build script types itself out */}
          <ParallaxLayer mx={mx} my={my} depth={0.35} className="left-0 top-[2%] z-10 w-[82%]">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-2/90 shadow-lift backdrop-blur-md">
              <div className="flex items-center gap-2 border-b border-white/10 px-3.5 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-soft/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-aqua/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="ml-3 rounded-md bg-white/[0.06] px-2.5 py-0.5 font-mono text-[0.68rem] text-white/60">launch.ts</span>
              </div>
              <pre className="overflow-hidden px-4 py-4 font-mono text-[0.68rem] leading-[1.7] text-white/85 sm:text-[0.78rem]">
                {code.map((line, k) => (
                  <span key={k} className="code-line block whitespace-pre" style={{ animationDelay: `${0.5 + k * 0.32}s` }}>
                    <span className="mr-4 inline-block w-4 select-none text-right text-white/25">{k + 1}</span>
                    {line.map(([cls, txt], j) => (
                      <span key={j} className={cls}>
                        {txt}
                      </span>
                    ))}
                    {k === code.length - 1 && <span className="caret ml-0.5 inline-block h-[1.1em] w-[0.5em] translate-y-[0.2em] bg-aqua" />}
                  </span>
                ))}
              </pre>
            </div>
          </ParallaxLayer>

          {/* Browser: the result — real client sites */}
          <ParallaxLayer mx={mx} my={my} depth={0.7} className="bottom-[9%] right-0 z-20 h-[56%] w-[80%]">
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-white shadow-[0_30px_70px_-20px_rgb(0_0_0/0.6)]">
              <div className="flex items-center gap-2 border-b border-line bg-paper px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-ink/15" />
                <span className="h-2 w-2 rounded-full bg-ink/15" />
                <span className="h-2 w-2 rounded-full bg-ink/15" />
                <span className="ml-1.5 flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md bg-white px-3 py-0.5 font-mono text-[0.64rem] text-night/60">
                  <Icon name="shield" className="h-3 w-3 flex-shrink-0 text-aqua-deep" />
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span key={current.domain} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="truncate">
                      {current.domain}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </div>
              <div className="relative flex-1 overflow-hidden bg-paper">
                <AnimatePresence initial={false}>
                  <motion.img
                    key={current.src}
                    src={current.src}
                    alt={`${current.client} website, built by OddTech`}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ animation: "autoScroll 5.2s ease-in-out both" }}
                  />
                </AnimatePresence>
                <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-full bg-night/80 px-2.5 py-1 text-[0.65rem] font-semibold text-white backdrop-blur">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-aqua" />
                  Live · {current.client}
                </span>
              </div>
            </div>
          </ParallaxLayer>

          {/* Terminal: deploy status */}
          <ParallaxLayer mx={mx} my={my} depth={1.1} className="bottom-0 left-[3%] z-30">
            <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-night/95 px-3.5 py-2.5 font-mono text-[0.68rem] text-white/75 shadow-lift sm:text-xs">
              <span className="text-aqua">$</span>
              <span>deploy --prod</span>
              <span className="flex items-center gap-1 rounded-md bg-aqua/15 px-1.5 py-0.5 text-aqua">
                <Icon name="check" className="h-3 w-3" strokeWidth={3} />
                live
              </span>
            </div>
          </ParallaxLayer>

          {/* Logo badge */}
          <ParallaxLayer mx={mx} my={my} depth={1.3} className="-right-1 -top-4 z-30 h-24 w-24 sm:h-28 sm:w-28 md:-right-5">
            <div className="relative h-full w-full rounded-full bg-white shadow-glow">
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-[spin_18s_linear_infinite] text-night">
                <defs>
                  <path id="ot-badge-ring" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0" />
                </defs>
                <text className="fill-current text-[8.4px] font-bold uppercase tracking-[0.2em]">
                  <textPath href="#ot-badge-ring">OddTech • Web • Apps • Growth • </textPath>
                </text>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center">
                <OddTechLogo size={28} />
              </span>
            </div>
          </ParallaxLayer>
        </div>
      </Container>

      {/* ---------- Built for ---------- */}
      <div className="relative border-y border-white/10 bg-night/85 py-5 backdrop-blur-md">
        <div className="flex items-center">
          <span className="hidden whitespace-nowrap pl-[max(1.25rem,calc((100vw-78rem)/2+2rem))] pr-8 text-xs font-semibold uppercase tracking-[0.2em] text-aqua md:block">
            Built for
          </span>
          <div className="min-w-0 flex-1 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <Marquee seconds={32}>
              {[...work, ...work].map((c, i) => (
                <a key={i} href={c.url} target="_blank" rel="noopener noreferrer" className="font-display mx-7 flex items-center gap-7 whitespace-nowrap text-xl font-bold text-white/90 transition-colors hover:text-aqua">
                  {c.client}
                  <span className="h-1.5 w-1.5 rounded-full bg-aqua" aria-hidden="true" />
                </a>
              ))}
            </Marquee>
          </div>
        </div>
      </div>
    </section>
  );
}
