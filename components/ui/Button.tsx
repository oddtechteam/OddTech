import Link from "next/link";
import Icon from "./Icon";
import Magnetic from "./Magnetic";

const variants = {
  // Gradient pill with a light sweep on hover
  primary:
    "relative overflow-hidden bg-gradient-to-r from-brand-deep via-brand to-plum text-white shadow-glow hover:shadow-lift before:absolute before:inset-y-0 before:-left-1/2 before:w-1/3 before:-skew-x-12 before:bg-white/25 before:transition-transform before:duration-700 hover:before:translate-x-[400%]",
  secondary: "border border-line bg-surface text-ink shadow-soft hover:border-brand/40 hover:text-brand",
  dark: "bg-night text-white hover:bg-brand-deep",
  // Bright accent pill (yellow on Odd Creatives) with dark text
  accent: "bg-aqua text-night hover:bg-white",
  // Outline for bright (yellow) backgrounds
  outlineDark: "border-2 border-night text-night hover:bg-night hover:text-aqua",
  light: "bg-white text-night hover:bg-white/90",
  ghostLight: "border border-white/20 bg-white/5 text-white backdrop-blur hover:border-white/40 hover:bg-white/10",
};

const sizes = {
  md: "h-11 px-5 text-sm",
  lg: "h-[3.4rem] px-7 text-[0.95rem]",
};

export default function Button({
  href,
  children,
  variant = "primary",
  size = "lg",
  arrow = true,
  magnetic = true,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  arrow?: boolean;
  magnetic?: boolean;
  className?: string;
}) {
  const cls = `group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all duration-300 ${variants[variant]} ${sizes[size]} ${className}`;
  const content = (
    <>
      <span className="relative">{children}</span>
      {arrow && (
        <span className="relative flex h-6 w-6 items-center justify-center overflow-hidden">
          <Icon name="arrowRight" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-6" strokeWidth={2.2} />
          <Icon
            name="arrowRight"
            className="absolute h-4 w-4 -translate-x-6 transition-transform duration-300 group-hover:translate-x-0"
            strokeWidth={2.2}
          />
        </span>
      )}
    </>
  );

  // mailto:/tel:/external links bypass the Next router.
  const external = /^(mailto:|tel:|https?:)/.test(href);
  const el = external ? (
    <a href={href} className={cls} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {content}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );

  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}
