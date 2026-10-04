import Reveal from "./Reveal";

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-site px-5 md:px-8 ${className}`}>{children}</div>;
}

export function Section({
  children,
  className = "",
  id,
  dark = false,
  backdrop,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  dark?: boolean;
  backdrop?: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`relative py-24 md:py-32 ${dark ? "grain overflow-hidden bg-night text-white" : ""} ${className}`}
    >
      {backdrop}
      <Container className="relative">{children}</Container>
    </section>
  );
}

export function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 rounded-full border px-3.5 py-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.16em] ${
        light ? "border-white/15 bg-white/5 text-aqua" : "border-brand/15 bg-brand-50/70 text-brand"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${light ? "bg-aqua" : "bg-brand"}`} />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  light = false,
  action,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  light?: boolean;
  action?: React.ReactNode;
}) {
  const centered = align === "center";
  return (
    <Reveal
      className={`mb-14 flex flex-col gap-6 md:mb-20 ${
        centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"
      }`}
    >
      <div className={centered ? "max-w-3xl" : "max-w-2xl"}>
        <Eyebrow light={light}>{eyebrow}</Eyebrow>
        <h2
          className={`font-display mt-5 text-[2.25rem] font-extrabold leading-[1.02] md:text-[3.5rem] ${
            light ? "text-white" : "text-ink"
          }`}
        >
          {title}
        </h2>
        {lead && (
          <p className={`mt-5 text-base leading-relaxed md:text-lg ${light ? "text-white/60" : "text-muted"}`}>{lead}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </Reveal>
  );
}

export function IconBadge({
  children,
  tone = "brand",
  size = "md",
}: {
  children: React.ReactNode;
  tone?: "brand" | "aqua" | "dark";
  size?: "md" | "lg";
}) {
  const tones = {
    brand: "bg-brand-50 text-brand",
    aqua: "bg-aqua-50 text-aqua-deep",
    dark: "border border-white/10 bg-white/5 text-aqua",
  };
  return (
    <span
      className={`flex flex-shrink-0 items-center justify-center rounded-xl transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110 ${tones[tone]} ${
        size === "lg" ? "h-14 w-14" : "h-11 w-11"
      }`}
    >
      {children}
    </span>
  );
}
