# OddTech IT Solutions

The website for **OddTech IT Solutions**, the technology arm of
[Odd Creatives & Management](https://oddcreatives.in). Split out of the
`oddcreativesAndManagement` project, where it used to live under `/oddtech`.

Stack: Next.js (App Router) + React + Tailwind CSS + GSAP + Framer Motion +
Lenis + Three.js / React Three Fiber.

## Run it

```bash
npm install
npm run dev
```

Pages: `/` (overview), `/services`, `/work`, `/contact`.

## Where things live

- `lib/oddtech.ts` — all site copy: services, work, stack, FAQs, contact
  details, and `agencyUrl` (the "Back to Odd Creatives" link target).
- `lib/site.ts` — parent-company details used in the footer.
- `lib/sheetEndpoint.ts` — where the quote form submits.
- `components/oddtech/*` — the page sections.
- `components/site/*`, `components/ui/*` — header, footer, and shared UI.
- `app/globals.css` — theme tokens; the OddTech palette is the
  `[data-site="oddtech"]` block (set on `<html>` in `app/layout.tsx`).
