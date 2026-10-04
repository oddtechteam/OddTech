"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Icon from "@/components/ui/Icon";

type Mode = "light" | "dark";

// Light / dark switch. Sets <html data-mode>, remembered per browser.
// Every toggle on the page stays in sync by watching the attribute.
export default function ModeToggle({ withLabel = false }: { withLabel?: boolean }) {
  const [mode, setMode] = useState<Mode>("light");

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setMode(root.dataset.mode === "dark" ? "dark" : "light");
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(root, { attributes: true, attributeFilter: ["data-mode"] });
    return () => mo.disconnect();
  }, []);

  const set = (m: Mode) => {
    document.documentElement.dataset.mode = m;
    try {
      localStorage.setItem("odd-mode", m);
    } catch {
      /* private mode — still applies for this visit */
    }
  };

  return (
    <div role="radiogroup" aria-label="Light or dark mode" className="relative flex items-center rounded-full border border-white/10 bg-white/[0.04] p-1">
      {(["light", "dark"] as const).map((m) => (
        <button
          key={m}
          role="radio"
          aria-checked={mode === m}
          aria-label={m === "light" ? "Light mode" : "Dark mode"}
          title={m === "light" ? "Light mode" : "Dark mode"}
          onClick={() => set(m)}
          className={`relative flex h-7 items-center justify-center gap-1.5 rounded-full text-xs font-semibold transition-colors ${
            withLabel ? "px-3" : "w-7"
          } ${mode === m ? "text-night" : "text-white/60 hover:text-white"}`}
        >
          {mode === m && (
            <motion.span
              layoutId={`mode-pill-${withLabel ? "l" : "s"}`}
              className="absolute inset-0 rounded-full bg-white"
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
            />
          )}
          <Icon name={m === "light" ? "sun" : "moon"} className="relative h-4 w-4" />
          {withLabel && <span className="relative capitalize">{m}</span>}
        </button>
      ))}
    </div>
  );
}
