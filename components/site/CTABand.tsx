import Button from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import Aurora from "./Aurora";
import { oddtech } from "@/lib/oddtech";

export default function CTABand({
  title = (
    <>
      Every great brand begins with <span className="text-aurora">one bold decision.</span>
    </>
  ),
  lead = "Whether you're launching a startup, scaling an established business, or reimagining your brand, let's create something people don't just see, but remember.",
  cta = "Book a consultation",
  href = "/contact",
  phone = oddtech.phone,
}: {
  title?: React.ReactNode;
  lead?: React.ReactNode;
  cta?: string;
  href?: string;
  phone?: { label: string; href: string };
}) {
  return (
    <section className="bg-paper py-20 md:py-28">
      <Container>
        <Reveal className="ring-aurora grain relative overflow-hidden rounded-[2.5rem] bg-night px-7 py-16 text-center text-white md:px-16 md:py-24">
          <Aurora intense />
          <div className="relative mx-auto max-w-3xl">
            <span className="font-script inline-block rotate-[-4deg] text-3xl text-aqua">Let&apos;s build together</span>
            <h2 className="font-display mt-4 text-4xl font-extrabold leading-[1.02] md:text-6xl">{title}</h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">{lead}</p>
            <div className="mt-10 flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
              <Button href={href}>{cta}</Button>
              <Button href={phone.href} variant="ghostLight" arrow={false}>
                Call us
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
