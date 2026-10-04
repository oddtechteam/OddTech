"use client";

import { useRef, useState } from "react";
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import Icon from "@/components/ui/Icon";

// A browser-window frame around a full-page screenshot of a live site.
// Hover: the whole page glides top → bottom inside the frame.
// Otherwise: the screenshot drifts gently as the card scrolls past.
export default function SitePreview({
  src,
  url,
  title,
  className = "aspect-[16/11]",
}: {
  src: string;
  url: string;
  title: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Stay on the site's hero until the card is mid-screen, then drift as it leaves.
  const drift = useTransform(scrollYProgress, [0.4, 1], [0, 28], { clamp: true });
  const position = useMotionTemplate`50% ${drift}%`;
  const domain = url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

  return (
    <div
      ref={ref}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={() => setHover(false)}
      className="overflow-hidden rounded-2xl border border-line bg-surface shadow-lift"
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-3 border-b border-line bg-paper px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
        </span>
        <span className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md bg-surface px-3 py-1 font-mono text-[0.7rem] text-muted">
          <Icon name="shield" className="h-3 w-3 flex-shrink-0 text-aqua-deep" />
          <span className="truncate">{domain}</span>
        </span>
        <Icon name="arrowUpRight" className="h-4 w-4 text-muted" />
      </div>

      {/* Viewport */}
      <div className={`relative overflow-hidden bg-paper ${className}`}>
        <motion.img
          src={src}
          alt={`${title} website, full page screenshot`}
          loading="lazy"
          decoding="async"
          width={1200}
          height={4300}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            objectPosition: hover ? "50% 100%" : position,
            transition: hover
              ? "object-position 7s cubic-bezier(0.45, 0, 0.2, 1)"
              : "object-position 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
        {/* Hint, fades away while previewing */}
        <span
          className={`pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full bg-night/80 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur transition-opacity duration-300 md:flex ${
            hover ? "opacity-0" : "opacity-100"
          }`}
        >
          <Icon name="arrowUp" className="h-3.5 w-3.5 rotate-180" strokeWidth={2.4} />
          Hover to scroll the site
        </span>
      </div>
    </div>
  );
}
