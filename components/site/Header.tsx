"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import Button from "@/components/ui/Button";
import Icon, { type IconName } from "@/components/ui/Icon";
import OddTechLogo from "@/components/OddTechLogo";
import ModeToggle from "./ModeToggle";
import { site } from "@/lib/site";
import { agencyUrl, oddtech, oddtechNav, services } from "@/lib/oddtech";

type MegaItem = { icon: IconName; title: string; desc: string; href: string; isNew?: boolean };

// The OddTech site header.
// No phone numbers are shown in the navbar (by request).
const brands = {
  oddtech: {
    home: "/",
    name: oddtech.name,
    title: "Tech",
    sub: "IT Solutions",
    links: oddtechNav,
    cta: { label: "Get a quote", href: "/contact", mobile: "Get a free quote" },
    phone: oddtech.phone,
    email: oddtech.email,
    back: { label: "Odd Creatives", href: agencyUrl } as null | { label: string; href: string },
    mega: {
      href: "/services",
      items: services.map((s) => ({ icon: s.icon, title: s.title, desc: s.short, href: `/services#${s.key}`, isNew: s.isNew })) as MegaItem[],
      featured: { eyebrow: "Live work", title: "See sites we've shipped", desc: "Hover-scroll through real client websites.", href: "/work" },
      cols: "grid-cols-3",
    },
  },
};

// Link label that rolls up to a duplicate on hover.
function RollText({ children }: { children: string }) {
  return (
    <span className="relative block h-[1.3em] overflow-hidden leading-[1.3em]">
      <span className="block transition-transform duration-300 ease-out group-hover/link:-translate-y-full">{children}</span>
      <span className="absolute inset-x-0 top-full block transition-transform duration-300 ease-out group-hover/link:-translate-y-full" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}

export default function Header({ variant = "oddtech" }: { variant?: keyof typeof brands }) {
  const b = brands[variant];
  // Normalise "/x.html" and trailing slashes (some static hosts) for active-link matching.
  const pathname = (usePathname() || "/").replace(/\.html$/, "").replace(/(.)\/+$/, "$1");
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const megaTimer = useRef<ReturnType<typeof setTimeout>>();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    setOpen(false);
    setMega(false);
  }, [pathname]);

  // Compact on scroll; tuck away when scrolling down, return when scrolling up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (y > 500 && y > last + 2) {
        setHidden(true);
        setMega(false);
      }
      if (y < last - 2) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
  }, [open]);

  const openMega = () => {
    clearTimeout(megaTimer.current);
    setMega(true);
  };
  const closeMega = () => {
    clearTimeout(megaTimer.current);
    megaTimer.current = setTimeout(() => setMega(false), 140);
  };

  // Section anchors (#...) are never "current"; brand home matches exactly.
  const isActive = (href: string) =>
    !href.includes("#") && (href === b.home ? pathname === b.home : pathname.startsWith(href));
  const links = b.links.filter((l) => l.href !== b.cta.href);
  const whatsapp = `https://wa.me/${b.phone.href.replace(/\D/g, "")}`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-500 md:px-5 md:pt-4 ${
        hidden && !open ? "-translate-y-[140%]" : ""
      }`}
    >
      {/* ---------- Floating island ---------- */}
      <div
        className={`relative mx-auto flex max-w-site items-center justify-between gap-3 rounded-full border pl-2 pr-2 transition-all duration-500 ${
          scrolled || open || mega
            ? "h-14 border-white/10 bg-night/95 shadow-lift backdrop-blur-xl"
            : "h-16 border-white/[0.08] bg-night/80 backdrop-blur-md"
        }`}
      >
        {/* Soft inner sheen */}
        <span className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        <Link href={b.home} className="group flex items-center gap-2.5" aria-label={`${b.name} home`}>
          <span className="block transition-transform duration-500 group-hover:-rotate-2 group-hover:scale-105">
            <OddTechLogo badge size={scrolled ? 26 : 30} />
          </span>
          <span className={`leading-tight text-white hidden sm:block`}>
            <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-aqua">{b.sub}</span>
          </span>
        </Link>

        {/* Desktop links: gliding hover pill, rolling labels, Services mega-menu */}
        <nav className="hidden items-center lg:flex" aria-label="Main" onMouseLeave={() => setHovered(null)}>
          {links.map((l) => {
            const active = isActive(l.href);
            const isMega = l.href === b.mega.href;
            const link = (
              <Link
                href={l.href}
                onMouseEnter={() => setHovered(l.href)}
                aria-current={active ? "page" : undefined}
                aria-haspopup={isMega ? "true" : undefined}
                aria-expanded={isMega ? mega : undefined}
                className={`group/link relative flex items-center gap-1 rounded-full px-4 py-2 text-[0.9rem] font-medium transition-colors duration-300 ${
                  active ? "text-night" : "text-white/75 hover:text-white"
                }`}
              >
                {hovered === l.href && !active && (
                  <motion.span
                    layoutId={`hover-pill-${variant}`}
                    className="absolute inset-0 rounded-full bg-white/[0.08]"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                {active && (
                  <motion.span
                    layoutId={`nav-pill-${variant}`}
                    className="absolute inset-0 rounded-full bg-aqua"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">
                  <RollText>{l.label}</RollText>
                </span>
                {!active && (
                  <span
                    className={`absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-brand transition-all duration-300 ${
                      hovered === l.href ? "scale-100 opacity-100" : "scale-0 opacity-0"
                    }`}
                  />
                )}
                {isMega && (
                  <svg
                    viewBox="0 0 24 24"
                    className={`relative h-3.5 w-3.5 transition-transform duration-300 ${mega ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </Link>
            );
            if (!isMega) return <span key={l.href}>{link}</span>;
            return (
              <div
                key={l.href}
                onMouseEnter={openMega}
                onMouseLeave={closeMega}
                onFocus={openMega}
                onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && closeMega()}
              >
                {link}
                {/* Centring lives on this plain wrapper; the inner motion.div owns transform for its animation. */}
                <div className="pointer-events-none absolute left-1/2 top-full w-[min(56rem,calc(100vw-2.5rem))] -translate-x-1/2 pt-3">
                <AnimatePresence>
                  {mega && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className="pointer-events-auto origin-top"
                    >
                      <div className="grain relative overflow-hidden rounded-3xl border border-white/10 bg-ink-2 p-3 shadow-lift">
                        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-brand/20 blur-3xl" />
                        <div className="relative grid grid-cols-[1fr_15rem] gap-3">
                          <ul className={`grid ${b.mega.cols} gap-1`}>
                            {b.mega.items.map((it, i) => (
                              <motion.li
                                key={it.href}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.03 * i, duration: 0.25 }}
                              >
                                <Link href={it.href} className="group/item flex gap-3 rounded-2xl p-3 transition-colors hover:bg-white/[0.06]">
                                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-aqua transition-all duration-300 group-hover/item:scale-110 group-hover/item:bg-brand group-hover/item:text-white">
                                    <Icon name={it.icon} className="h-[1.1rem] w-[1.1rem]" />
                                  </span>
                                  <span className="min-w-0">
                                    <span className="block text-sm font-semibold text-white">
                                      {it.title}
                                      {it.isNew && (
                                        <span className="ml-1.5 rounded-full bg-aqua px-1.5 py-0.5 align-middle text-[0.6rem] font-bold uppercase text-night">New</span>
                                      )}
                                    </span>
                                    <span className="mt-0.5 block text-xs leading-snug text-white/50">{it.desc}</span>
                                  </span>
                                </Link>
                              </motion.li>
                            ))}
                          </ul>
                          <Link
                            href={b.mega.featured.href}
                            className="group/feat relative flex flex-col justify-end overflow-hidden rounded-2xl bg-aqua p-5 text-night"
                          >
                            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full border-[14px] border-night/10" />
                            <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white transition-transform duration-500 group-hover/feat:rotate-45">
                              <Icon name="arrowUpRight" className="h-4 w-4" strokeWidth={2.4} />
                            </span>
                            <span className="relative text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-night/60">{b.mega.featured.eyebrow}</span>
                            <span className="font-display relative mt-1 text-xl font-bold leading-tight">{b.mega.featured.title}</span>
                            <span className="relative mt-1 text-xs text-night/70">{b.mega.featured.desc}</span>
                            <span className="relative mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-night px-3.5 py-1.5 text-sm font-semibold text-white">
                              Explore
                              <Icon name="arrowRight" className="h-4 w-4 transition-transform group-hover/feat:translate-x-1" strokeWidth={2.2} />
                            </span>
                          </Link>
                        </div>
                        <div className="relative mt-2 flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm">
                          <span className="text-white/60">Not sure what you need?</span>
                          <Link href={b.cta.href} className="inline-flex items-center gap-1.5 font-semibold text-aqua hover:text-white">
                            Talk to us
                            <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2.2} />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {b.back && (
            <Link href={b.back.href} className="group mr-1 hidden items-center gap-1.5 text-sm font-medium text-white/60 hover:text-white 2xl:flex">
              <Icon name="arrowRight" className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-0.5" />
              {b.back.label}
            </Link>
          )}
          <div className="hidden lg:block">
            <ModeToggle />
          </div>
          <div className="hidden lg:block">
            <Button href={b.cta.href} size="md" variant="accent">
              {b.cta.label}
            </Button>
          </div>

          {/* Mobile: animated hamburger */}
          <button
            className={`relative flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-300 lg:hidden ${
              open ? "bg-white text-night" : "bg-aqua text-night"
            }`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="relative block h-3.5 w-5" aria-hidden="true">
              <span className={`absolute left-0 h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span
                className={`absolute left-0 top-1.5 h-[2px] rounded-full bg-current transition-all duration-300 ${
                  open ? "w-0 opacity-0" : "w-3.5 opacity-100"
                }`}
              />
              <span className={`absolute left-0 h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>

        {/* Reading-progress line */}
        <motion.span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-8 bottom-0 h-[2px] origin-left rounded-full bg-gradient-to-r from-brand to-aqua transition-opacity duration-500 ${
            scrolled && !open ? "opacity-100" : "opacity-0"
          }`}
          style={{ scaleX: progress }}
        />
      </div>

      {/* ---------- Mobile menu (portalled to <body> so the header's blur/transform can't clip it) ---------- */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ clipPath: "circle(0% at calc(100% - 2.6rem) 2.6rem)" }}
                animate={{ clipPath: "circle(150% at calc(100% - 2.6rem) 2.6rem)" }}
                exit={{ clipPath: "circle(0% at calc(100% - 2.6rem) 2.6rem)" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-aqua text-night lg:hidden"
              >
                <div className="relative flex min-h-full flex-col px-6 pb-8 pt-28">
                  <nav className="flex flex-col" aria-label="Mobile">
                    {b.links.map((l, i) => {
                      const active = isActive(l.href);
                      return (
                        <motion.div
                          key={l.href}
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <Link href={l.href} onClick={() => setOpen(false)} className="group flex items-baseline gap-4 border-b border-night/15 py-4">
                            <span className="font-mono text-xs font-medium text-brand">{String(i + 1).padStart(2, "0")}</span>
                            <span className={`font-display text-[2rem] font-bold leading-none ${active ? "text-brand" : "text-night"}`}>{l.label}</span>
                            <Icon name="arrowUpRight" className="ml-auto h-5 w-5 self-center text-night/40 transition-transform group-active:translate-x-1" />
                          </Link>
                        </motion.div>
                      );
                    })}
                    {b.back && (
                      <Link href={b.back.href} onClick={() => setOpen(false)} className="mt-5 flex items-center gap-2 text-sm font-semibold text-night/70">
                        <Icon name="arrowRight" className="h-4 w-4 rotate-180" />
                        Back to {b.back.label}
                      </Link>
                    )}
                  </nav>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.5 }}
                    className="mt-auto flex flex-col gap-5 pt-10"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="rounded-2xl bg-night p-4">
                        <Icon name="chat" className="h-5 w-5 text-aqua" />
                        <span className="mt-3 block text-xs text-white/50">WhatsApp</span>
                        <span className="block text-sm font-semibold text-white">Chat with us</span>
                      </a>
                      <a href={`mailto:${b.email}`} className="min-w-0 rounded-2xl bg-night p-4">
                        <Icon name="mail" className="h-5 w-5 text-aqua" />
                        <span className="mt-3 block text-xs text-white/50">Email</span>
                        <span className="block text-sm font-semibold text-white">Write to us</span>
                      </a>
                    </div>

                    <div className="flex flex-col gap-3 rounded-2xl bg-night px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">Mode</span>
                        <ModeToggle withLabel />
                      </div>
                    </div>

                    <Button href={b.cta.href} className="w-full" variant="dark" magnetic={false}>
                      {b.cta.mobile}
                    </Button>

                    <div className="flex justify-center gap-3">
                      {site.socials.map((s) => (
                        <a
                          key={s.label}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={s.label}
                          className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-night text-night transition-colors hover:bg-night hover:text-aqua"
                        >
                          <Icon name={s.icon} className="h-5 w-5" />
                        </a>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </header>
  );
}
