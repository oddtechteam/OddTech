import Link from "next/link";
import OddTechLogo from "@/components/OddTechLogo";
import Icon from "@/components/ui/Icon";
import Marquee from "@/components/ui/Marquee";
import { Container } from "@/components/ui/Section";
import { site } from "@/lib/site";
import { agencyUrl, oddtech, oddtechNav, services } from "@/lib/oddtech";

export default function OddTechFooter() {
  return (
    <footer className="grain relative overflow-hidden bg-night text-white">
      <Link href="/contact" className="group block border-b border-white/10 py-10 md:py-14" aria-label="Start a project with OddTech">
        <Marquee seconds={30}>
          {["Let's build it", "Get a free quote", "Let's build it", "Ship something odd"].map((t, i) => (
            <span key={i} className="font-display flex items-center whitespace-nowrap px-8 text-6xl font-extrabold md:text-8xl">
              <span className={i % 2 ? "text-white/20 transition-colors group-hover:text-white/40" : "text-aurora"}>{t}</span>
              <Icon name="terminal" className="ml-16 h-10 w-10 text-aqua md:h-14 md:w-14" />
            </span>
          ))}
        </Marquee>
      </Link>

      <Container className="relative pb-10 pt-16 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1.3fr_0.7fr_1fr]">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-3">
              <OddTechLogo badge size={44} />
              <span className="block text-[0.66rem] uppercase tracking-[0.2em] text-white/45">IT Solutions</span>
            </Link>
            <p className="mt-6 text-sm leading-relaxed text-white/55">{oddtech.intro}</p>
            <p className="font-mono mt-5 text-xs text-aqua/80">{oddtech.tagline}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-aqua">Services</p>
            <ul className="mt-5 grid grid-cols-1 gap-3 text-sm text-white/65 sm:grid-cols-2">
              {services.map((s) => (
                <li key={s.key}>
                  <Link href={`/services#${s.key}`} className="transition-colors hover:text-white">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-aqua">OddTech</p>
            <ul className="mt-5 flex flex-col gap-3 text-sm text-white/65">
              {oddtechNav.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-aqua">Talk to us</p>
            <ul className="mt-5 flex flex-col gap-3 text-sm text-white/65">
              <li>
                <a href={`mailto:${oddtech.email}`} className="flex items-center gap-2.5 hover:text-white">
                  <Icon name="mail" className="h-4 w-4 text-white/35" />
                  {oddtech.email}
                </a>
              </li>
              <li>
                <a href={oddtech.phone.href} className="flex items-center gap-2.5 hover:text-white">
                  <Icon name="phone" className="h-4 w-4 text-white/35" />
                  {oddtech.phone.label}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Icon name="pin" className="h-4 w-4 text-white/35" />
                {site.city}, Maharashtra
              </li>
            </ul>
            <div className="mt-6 flex gap-2">
              {site.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/75 transition-all hover:-translate-y-0.5 hover:border-aqua hover:text-aqua"
                >
                  <Icon name={s.icon} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
          <span>
            © {new Date().getFullYear()} {oddtech.name}, the technology arm of{" "}
            <Link href={agencyUrl} className="text-white/70 hover:text-aqua">
              {site.name}
            </Link>
            .
          </span>
          <Link href={agencyUrl} className="group inline-flex items-center gap-1.5 text-white/60 hover:text-white">
            <Icon name="arrowRight" className="h-3.5 w-3.5 rotate-180 transition-transform group-hover:-translate-x-0.5" />
            Back to Odd Creatives
          </Link>
        </div>
      </Container>
    </footer>
  );
}
