import { Container, Eyebrow } from "@/components/ui/Section";
import Aurora from "./Aurora";

// Dark aurora banner at the top of every inner page (no JS needed to show it).
export default function PageHeader({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="grain relative overflow-hidden bg-night pb-20 pt-40 text-white md:pb-28 md:pt-48">
      <Aurora />
      <Container className="relative">
        <div className="max-w-4xl">
          <div className="fade-up">
            <Eyebrow light>{eyebrow}</Eyebrow>
          </div>
          <h1
            className="fade-up font-display mt-6 text-[2.75rem] font-extrabold leading-[0.98] md:text-7xl"
            style={{ animationDelay: "0.08s" }}
          >
            {title}
          </h1>
          {lead && (
            <p className="fade-up mt-7 max-w-2xl text-lg leading-relaxed text-white/65" style={{ animationDelay: "0.16s" }}>
              {lead}
            </p>
          )}
          {children && (
            <div className="fade-up mt-9" style={{ animationDelay: "0.24s" }}>
              {children}
            </div>
          )}
        </div>
      </Container>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </section>
  );
}
