"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { oddtech } from "@/lib/oddtech";

// Phone-only quick actions pinned to the bottom of the screen:
// Call · WhatsApp · the main CTA.
export default function MobileBar() {
  const [show, setShow] = useState(false);

  // Appears once the visitor scrolls past the hero's own buttons.
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const phone = oddtech.phone;
  const whatsapp = `https://wa.me/${phone.href.replace(/\D/g, "")}`;
  const cta = { label: "Get a quote", href: "/contact" };

  return (
    <>
      {/* Spacer so the bar never covers the end of the footer */}
      <div className="h-20 bg-night lg:hidden" aria-hidden="true" />
      <nav
        aria-label="Quick actions"
        className={`fixed inset-x-3 bottom-3 z-40 flex items-center gap-2 rounded-2xl border border-white/10 bg-night/85 p-2 shadow-lift backdrop-blur-xl transition-all duration-500 lg:hidden ${
          show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[130%] opacity-0"
        }`}
      >
        <a
          href={phone.href}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-white/5 text-sm font-semibold text-white active:bg-white/10"
        >
          <Icon name="phone" className="h-4 w-4 text-aqua" />
          Call
        </a>
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-white/5 text-sm font-semibold text-white active:bg-white/10"
        >
          <Icon name="chat" className="h-4 w-4 text-aqua" />
          WhatsApp
        </a>
        <Link
          href={cta.href}
          className="flex h-12 flex-[1.3] items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-deep via-brand to-plum text-sm font-semibold text-white shadow-glow"
        >
          {cta.label}
          <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2.2} />
        </Link>
      </nav>
    </>
  );
}
