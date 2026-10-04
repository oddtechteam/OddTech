// Seamless infinite marquee; the list is rendered twice and shifted by -50%.
export default function Marquee({
  children,
  reverse = false,
  seconds = 40,
  className = "",
  pauseOnHover = true,
}: {
  children: React.ReactNode;
  reverse?: boolean;
  seconds?: number;
  className?: string;
  pauseOnHover?: boolean;
}) {
  return (
    <div className={`group relative flex overflow-hidden ${className}`}>
      <div
        className={`flex w-max shrink-0 ${pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""}`}
        style={{ animation: `${reverse ? "marqueeReverse" : "marquee"} ${seconds}s linear infinite` }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
