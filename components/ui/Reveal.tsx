"use client";

import { useEffect, useRef } from "react";

// Fades content up the first time it scrolls into view. Pure CSS transition
// driven by an IntersectionObserver — content is only hidden once JS has
// loaded (see `.js .reveal` in globals.css), so it's never stuck invisible.
export default function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "article" | "section";
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} id={id} className={`reveal ${className}`} style={{ "--d": `${delay}s` } as React.CSSProperties}>
      {children}
    </Tag>
  );
}
