/** @type {import('tailwindcss').Config} */

// Every colour reads from a CSS variable (RGB channels) so themes can be
// swapped at runtime — see the [data-theme] blocks in app/globals.css.
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ink = main text (flips in dark mode); night = always-dark surfaces.
        ink: { DEFAULT: v("ink"), 2: v("ink-2"), 3: v("ink-3") },
        night: v("night"),
        paper: v("paper"),
        surface: v("surface"),
        brand: { DEFAULT: v("brand"), deep: v("brand-deep"), soft: v("brand-soft"), 50: v("brand-50"), 100: v("brand-100"), 200: v("brand-200") },
        aqua: { DEFAULT: v("aqua"), deep: v("aqua-deep"), deeper: v("aqua-deeper"), 50: v("aqua-50") },
        plum: v("plum"),
        line: v("line"),
        muted: v("muted"),
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        soft: "0 1px 2px rgb(var(--ink) / 0.04), 0 12px 32px -16px rgb(var(--brand-deep) / 0.22)",
        lift: "0 2px 4px rgb(var(--ink) / 0.05), 0 28px 56px -24px rgb(var(--brand-deep) / 0.4)",
        glow: "0 16px 40px -12px rgb(var(--brand) / 0.65)",
      },
      maxWidth: {
        site: "78rem",
      },
    },
  },
  plugins: [],
};
