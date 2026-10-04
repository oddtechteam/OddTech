// Animated backdrop for the OddTech hero: deep indigo with two soft glows, a
// faint dot grid, and circuit traces with mint signals running along them.
// CSS/SVG only (keyframes in app/globals.css).
const traces = [
  { d: "M0 180H220L280 240H520", dur: 5.5, delay: 0 },
  { d: "M0 640H150L210 580H420L470 530H600", dur: 7, delay: 1.4 },
  { d: "M1440 140H1230L1170 200H990", dur: 6, delay: 0.6 },
  { d: "M1440 720H1270L1210 780H1010L970 740H830", dur: 7.5, delay: 2.2 },
  { d: "M640 900V820L700 760H860", dur: 5, delay: 3 },
  { d: "M1120 0V80L1080 120H920", dur: 4.5, delay: 1.8 },
  { d: "M0 400H90L130 440H260", dur: 4, delay: 2.8 },
];

// End-point "pads" of each trace
const pads = [
  [520, 240], [600, 530], [990, 200], [830, 740], [860, 760], [920, 120], [260, 440],
] as const;

export default function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Soft glows */}
      <div className="absolute -right-[12%] -top-[25%] h-[40rem] w-[40rem] rounded-full bg-brand opacity-40 blur-[130px]" style={{ animation: "blob 20s ease-in-out infinite" }} />
      <div className="absolute -bottom-[30%] -left-[10%] h-[34rem] w-[34rem] rounded-full bg-aqua opacity-[0.16] blur-[130px]" style={{ animation: "blob 24s ease-in-out infinite reverse" }} />

      {/* Dot grid, fading out from the centre */}
      <div
        className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
        style={{ backgroundImage: "radial-gradient(rgb(255 255 255 / 0.09) 1px, transparent 1.2px)", backgroundSize: "26px 26px" }}
      />

      {/* Circuit traces with travelling signals */}
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" fill="none">
        {traces.map((t) => (
          <g key={t.d}>
            <path d={t.d} stroke="rgb(var(--aqua) / 0.14)" strokeWidth="1.5" />
            <path
              d={t.d}
              pathLength={100}
              stroke="rgb(var(--aqua))"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="7 93"
              className="trace-signal"
              style={{ animationDuration: `${t.dur}s`, animationDelay: `${t.delay}s` }}
            />
          </g>
        ))}
        {pads.map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="7" stroke="rgb(var(--aqua) / 0.35)" strokeWidth="1.5" />
            <circle cx={x} cy={y} r="2.5" fill="rgb(var(--aqua))" className="pad-pulse" />
          </g>
        ))}
      </svg>
    </div>
  );
}
